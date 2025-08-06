// Secure API Configuration
// This file handles API key management securely

class SecureAPIConfig {
    constructor() {
        this.endpoint = '/.netlify/functions/gemini-proxy';
        this.initialized = false;
        // Token usage tracking
        this.tokenUsage = {
            totalRequests: 0,
            totalInputTokens: 0,
            totalOutputTokens: 0,
            totalTokens: 0,
            requestHistory: [],
            dailyLimit: 30000,
            estimatedCostUSD: 0
        };
        this.loadTokenUsage();
    }

    // Initialize API configuration
    async init() {
        // No API key needed in frontend; always ready
        this.initialized = true;
        console.log('✅ API configuration initialized for Netlify proxy.');
    }

    // Load API key from a secure backend endpoint (recommended for production)
    async loadFromSecureEndpoint() {
        try {
            // This would call your backend API to get the key
            // const response = await fetch('/api/config/gemini-key', {
            //     method: 'GET',
            //     credentials: 'include' // Include session cookies
            // });
            // const config = await response.json();
            // this.apiKey = config.apiKey;
        } catch (error) {
            console.log('Secure endpoint not available, trying fallback...');
        }
    }

    // Get API key
    getApiKey() {
        if (!this.initialized) {
            console.error('API configuration not initialized. Call init() first.');
            return null;
        }
        return this.apiKey;
    }

    // Get API endpoint
    getEndpoint() {
        return this.endpoint;
    }

    // Make a secure API call to Gemini
    async callGeminiAPI(prompt, options = {}) {
        if (!this.initialized) {
            throw new Error('API configuration not initialized. Call init() first.');
        }
        console.log('🚀 Making API call to Gemini via Netlify function...');
        console.log('Prompt:', prompt.substring(0, 100) + '...');
        const requestBody = {
            contents: [{
                parts: [{ text: prompt }]
            }],
            generationConfig: {
                temperature: options.temperature || 0.7,
                topP: options.topP || 0.8,
                topK: options.topK || 40,
                maxOutputTokens: options.maxOutputTokens || 2048,
            }
        };
        try {
            const response = await fetch(this.endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });
            console.log('📥 Response status:', response.status, response.statusText);
            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ API Error Response:', errorText);
                let errorMessage = `Gemini API error: ${response.status} ${response.statusText}`;
                let isQuotaError = false;
                let isRetryableError = false;
                try {
                    const errorData = JSON.parse(errorText);
                    if (errorData.error && errorData.error.message) {
                        errorMessage = errorData.error.message;
                        const quotaKeywords = ['quota', 'limit', 'exceeded', 'rate limit', 'billing'];
                        isQuotaError = quotaKeywords.some(keyword => errorMessage.toLowerCase().includes(keyword));
                        const retryableKeywords = ['overloaded', 'unavailable', 'try again later'];
                        isRetryableError = response.status === 503 || retryableKeywords.some(keyword => errorMessage.toLowerCase().includes(keyword));
                    }
                } catch (e) {
                    isRetryableError = response.status >= 500 && response.status < 600;
                }
                if (isRetryableError) {
                    errorMessage += '\n\n💡 The Gemini API is temporarily overloaded. This usually resolves in a few moments. Try again shortly.';
                }
                if (isQuotaError) {
                    console.warn('🚨 Quota limit reached, fallback system should activate');
                    errorMessage += '\n\nTip: The system will automatically fall back to local CLO generation.';
                }
                throw new Error(errorMessage);
            }
            const data = await response.json();
            console.log('📋 API Response received:', data);
            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                const result = data.candidates[0].content.parts[0].text;
                const usageMetadata = data.usageMetadata;
                this.updateTokenUsage(prompt, result, usageMetadata);
                this.showUsageStatus();
                console.log('✅ API call successful');
                return result;
            } else {
                console.error('❌ Unexpected response format:', data);
                throw new Error('Unexpected response format from Gemini API');
            }
        } catch (error) {
            console.error('❌ Gemini API call failed:', error);
            throw error;
        }
    }

    // Utility method to check if API is ready
    isReady() {
        return this.initialized;
    }

    // Token usage tracking methods
    loadTokenUsage() {
        try {
            const saved = localStorage.getItem('gemini_token_usage');
            if (saved) {
                const data = JSON.parse(saved);
                // Reset daily usage if it's a new day
                const today = new Date().toDateString();
                const lastUsageDate = data.lastUsageDate || '';
                
                if (lastUsageDate !== today) {
                    // Reset daily counters
                    data.dailyRequests = 0;
                    data.dailyTokens = 0;
                    data.lastUsageDate = today;
                }
                
                this.tokenUsage = { ...this.tokenUsage, ...data };
            }
        } catch (error) {
            console.warn('Failed to load token usage data:', error);
        }
    }

    saveTokenUsage() {
        try {
            this.tokenUsage.lastUsageDate = new Date().toDateString();
            localStorage.setItem('gemini_token_usage', JSON.stringify(this.tokenUsage));
        } catch (error) {
            console.warn('Failed to save token usage data:', error);
        }
    }

    estimateTokens(text) {
        // Rough estimation: ~4 characters per token for English text
        return Math.ceil(text.length / 4);
    }

    updateTokenUsage(inputText, outputText, actualUsage = null) {
        const inputTokens = actualUsage?.promptTokenCount || this.estimateTokens(inputText);
        const outputTokens = actualUsage?.candidatesTokenCount || this.estimateTokens(outputText);
        const totalTokens = inputTokens + outputTokens;

        this.tokenUsage.totalRequests++;
        this.tokenUsage.totalInputTokens += inputTokens;
        this.tokenUsage.totalOutputTokens += outputTokens;
        this.tokenUsage.totalTokens += totalTokens;
        
        // Daily tracking
        this.tokenUsage.dailyRequests = (this.tokenUsage.dailyRequests || 0) + 1;
        this.tokenUsage.dailyTokens = (this.tokenUsage.dailyTokens || 0) + totalTokens;

        // Cost estimation (Gemini 1.5 Flash pricing)
        const inputCost = (inputTokens / 1000000) * 0.075; // $0.075 per 1M input tokens
        const outputCost = (outputTokens / 1000000) * 0.30; // $0.30 per 1M output tokens
        this.tokenUsage.estimatedCostUSD += inputCost + outputCost;

        // Add to request history (keep last 50)
        this.tokenUsage.requestHistory.unshift({
            timestamp: new Date().toISOString(),
            inputTokens,
            outputTokens,
            totalTokens,
            cost: inputCost + outputCost
        });
        
        if (this.tokenUsage.requestHistory.length > 50) {
            this.tokenUsage.requestHistory = this.tokenUsage.requestHistory.slice(0, 50);
        }

        this.saveTokenUsage();
        
        // Log usage info
        console.log(`📊 Token Usage - Input: ${inputTokens}, Output: ${outputTokens}, Total: ${totalTokens}`);
        console.log(`💰 Estimated cost: $${(inputCost + outputCost).toFixed(6)}, Total: $${this.tokenUsage.estimatedCostUSD.toFixed(4)}`);
        console.log(`📈 Daily usage: ${this.tokenUsage.dailyTokens}/${this.tokenUsage.dailyLimit} tokens`);
    }

    getUsageStats() {
        const remainingDaily = Math.max(0, this.tokenUsage.dailyLimit - (this.tokenUsage.dailyTokens || 0));
        const usagePercentage = ((this.tokenUsage.dailyTokens || 0) / this.tokenUsage.dailyLimit * 100).toFixed(1);
        
        return {
            ...this.tokenUsage,
            remainingDaily,
            usagePercentage,
            isNearLimit: usagePercentage > 80,
            isOverLimit: usagePercentage >= 100
        };
    }

    showUsageStatus() {
        const stats = this.getUsageStats();
        
        console.group('📊 Gemini API Usage Statistics');
        console.log(`Daily Usage: ${stats.dailyTokens}/${stats.dailyLimit} tokens (${stats.usagePercentage}%)`);
        console.log(`Remaining Today: ${stats.remainingDaily} tokens`);
        console.log(`Total Requests: ${stats.totalRequests}`);
        console.log(`Total Tokens Used: ${stats.totalTokens.toLocaleString()}`);
        console.log(`Estimated Cost: $${stats.estimatedCostUSD.toFixed(4)}`);
        
        if (stats.isNearLimit) {
            console.warn('⚠️ Approaching daily limit!');
        }
        if (stats.isOverLimit) {
            console.error('🚫 Daily limit exceeded!');
        }
        console.groupEnd();
        
        // Trigger UI update if function exists
        if (typeof window.updateTokenUsageDisplay === 'function') {
            window.updateTokenUsageDisplay();
        }
        
        // Show user-friendly warnings
        this.showUserWarnings(stats);
        
        return stats;
    }

    showUserWarnings(stats) {
        if (stats.isOverLimit) {
            // Show error notification
            this.showNotification('🚫 Daily token limit exceeded! Please try again tomorrow or upgrade your plan.', 'error');
        } else if (stats.isNearLimit) {
            // Show warning notification
            this.showNotification(`⚠️ Approaching daily limit: ${stats.dailyTokens}/${stats.dailyLimit} tokens used (${stats.usagePercentage}%)`, 'warning');
        }
    }

    showNotification(message, type = 'info') {
        // Create or update notification
        let notification = document.getElementById('token-notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'token-notification';
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 12px 16px;
                border-radius: 8px;
                color: white;
                font-weight: 500;
                z-index: 10000;
                max-width: 300px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                transition: all 0.3s ease;
            `;
            document.body.appendChild(notification);
        }

        // Set message and style based on type
        notification.textContent = message;
        
        switch (type) {
            case 'error':
                notification.style.background = '#dc3545';
                break;
            case 'warning':
                notification.style.background = '#ffc107';
                notification.style.color = '#000';
                break;
            case 'success':
                notification.style.background = '#28a745';
                break;
            default:
                notification.style.background = '#007bff';
        }

        // Auto-hide after 5 seconds
        clearTimeout(this.notificationTimeout);
        this.notificationTimeout = setTimeout(() => {
            if (notification && notification.parentNode) {
                notification.style.opacity = '0';
                setTimeout(() => {
                    if (notification && notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        }, 5000);
    }
}

// Create global instance
window.secureAPIConfig = new SecureAPIConfig();

// Initialize automatically when the script loads
document.addEventListener('DOMContentLoaded', async () => {
    await window.secureAPIConfig.init();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SecureAPIConfig;
}
