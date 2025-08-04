// Secure API Configuration
// This file handles API key management securely

class SecureAPIConfig {
    constructor() {
        this.apiKey = null;
        this.endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
        this.initialized = false;
    }

    // Initialize API configuration
    async init() {
        try {
            // First try to get from personal API config (your actual key)
            if (window.personalAPIConfig && window.personalAPIConfig.getApiKey()) {
                this.apiKey = window.personalAPIConfig.getApiKey();
                this.endpoint = window.personalAPIConfig.getEndpoint('gemini-1.5-flash'); // Use working model
                console.log('✅ Using personal API configuration with gemini-1.5-flash');
            }
            
            // Try to load from environment variables (for local development)
            else if (typeof process !== 'undefined' && process.env) {
                this.apiKey = process.env.GEMINI_API_KEY || process.env.LANGEXTRACT_API_KEY;
                console.log('✅ Using environment variable API key');
            }

            // Fallback: Try to load from a secure configuration endpoint
            else if (!this.apiKey) {
                await this.loadFromSecureEndpoint();
            }

            // Last resort: Use a hardcoded key (NOT RECOMMENDED for production)
            else if (!this.apiKey) {
                console.warn('No API key found. Using fallback configuration.');
                this.apiKey = this.getSecureKey();
            }

            if (!this.apiKey) {
                throw new Error('No API key available from any source');
            }

            this.initialized = true;
            console.log('✅ API configuration initialized successfully');
            console.log('API Key present:', this.apiKey ? 'Yes' : 'No');
            console.log('API Key length:', this.apiKey ? this.apiKey.length : 0);
        } catch (error) {
            console.error('❌ Failed to initialize API configuration:', error);
            this.initialized = false;
        }
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

    // Secure key retrieval (use this method for your personal key)
    getSecureKey() {
        // OPTION 1: Base64 encoded (light obfuscation)
        // Replace this with your actual API key encoded in base64
        const encodedKey = 'QUl6YVN5Qm9lLUUzcnFXWFB5QzJJSnJIcmNvdzNqRWczU05kNVpV'; // This is just an example
        
        try {
            return atob(encodedKey);
        } catch (error) {
            console.error('Failed to decode API key');
            return null;
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

        if (!this.apiKey) {
            throw new Error('No API key available. Check your personal-api-config.js file.');
        }

        console.log('🚀 Making API call to Gemini...');
        console.log('Prompt:', prompt.substring(0, 100) + '...');

        const requestBody = {
            contents: [{
                parts: [{
                    text: prompt
                }]
            }],
            generationConfig: {
                temperature: options.temperature || 0.7,
                topP: options.topP || 0.8,
                topK: options.topK || 40,
                maxOutputTokens: options.maxOutputTokens || 2048,
            }
        };

        try {
            const url = `${this.endpoint}?key=${this.apiKey}`;
            console.log('📡 API Endpoint:', this.endpoint);
            
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            console.log('📥 Response status:', response.status, response.statusText);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ API Error Response:', errorText);
                
                // Parse the error for more specific feedback
                let errorMessage = `Gemini API error: ${response.status} ${response.statusText}`;
                try {
                    const errorData = JSON.parse(errorText);
                    if (errorData.error && errorData.error.message) {
                        errorMessage = errorData.error.message;
                    }
                } catch (e) {
                    // Fallback to generic error
                }
                
                throw new Error(errorMessage);
            }

            const data = await response.json();
            console.log('📋 API Response received:', data);
            
            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                const result = data.candidates[0].content.parts[0].text;
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
        return this.initialized && this.apiKey !== null;
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
