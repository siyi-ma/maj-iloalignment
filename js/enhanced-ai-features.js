// Enhanced AI Features with Custom Prompt Support
// Supports both predefined analysis functions and custom user prompts

class EnhancedAIFeatures {
    constructor() {
        this.apiConfig = window.secureAPIConfig;
        this.isInitialized = false;
    }

    // Initialize the AI features
    async init() {
        try {
            if (this.apiConfig && !this.apiConfig.initialized) {
                await this.apiConfig.init();
            }
            this.isInitialized = this.apiConfig && this.apiConfig.isReady();
            return this.isInitialized;
        } catch (error) {
            console.error('Failed to initialize AI features:', error);
            return false;
        }
    }

    // Check if AI features are ready
    isReady() {
        return this.isInitialized && this.apiConfig && this.apiConfig.isReady();
    }

    // ========== CUSTOM PROMPT FEATURE ==========
    
    /**
     * Execute a custom user prompt with optional context
     * @param {string} userPrompt - The user's custom prompt
     * @param {Object} context - Optional context data to include
     * @param {Object} options - Optional AI parameters
     */
    async executeCustomPrompt(userPrompt, context = {}, options = {}) {
        try {
            if (!this.isReady()) {
                throw new Error('AI features not initialized. Please wait for setup to complete.');
            }

            // Validate input
            if (!userPrompt || userPrompt.trim().length === 0) {
                throw new Error('Please provide a valid prompt');
            }

            // Build the complete prompt with context
            let completePrompt = this.buildPromptWithContext(userPrompt, context);

            // Set default options for Gemini 1.5 Flash
            const aiOptions = {
                temperature: options.temperature || 0.7,
                maxOutputTokens: options.maxTokens || 2048,
                topP: options.topP || 0.8,
                topK: options.topK || 40,
                ...options
            };

            console.log('🤖 Executing custom prompt with Gemini 1.5 Flash...');
            const response = await this.apiConfig.callGeminiAPI(completePrompt, aiOptions);

            return {
                success: true,
                response: response,
                prompt: userPrompt,
                tokensUsed: this.estimateTokens(completePrompt + response)
            };

        } catch (error) {
            console.error('Custom prompt failed:', error);
            return {
                success: false,
                error: error.message,
                prompt: userPrompt
            };
        }
    }

    /**
     * Build a prompt with educational context for better results
     */
    buildPromptWithContext(userPrompt, context) {
        let contextualPrompt = '';

        // Add educational context if available
        if (context.ploData || context.mloData || context.courseData) {
            contextualPrompt += 'EDUCATIONAL CONTEXT:\n';
            
            if (context.ploData) {
                contextualPrompt += `Programme Learning Outcomes: ${JSON.stringify(context.ploData, null, 2)}\n`;
            }
            
            if (context.mloData) {
                contextualPrompt += `Module Learning Outcomes: ${JSON.stringify(context.mloData, null, 2)}\n`;
            }
            
            if (context.courseData) {
                contextualPrompt += `Course Information: ${JSON.stringify(context.courseData, null, 2)}\n`;
            }
            
            contextualPrompt += '\n';
        }

        // Add the user's prompt
        contextualPrompt += 'USER REQUEST:\n' + userPrompt;

        // Add helpful instruction for educational analysis
        contextualPrompt += '\n\nPlease provide a comprehensive response that considers educational best practices, curriculum design principles, and learning outcome alignment where relevant.';

        return contextualPrompt;
    }

    // ========== PREDEFINED ANALYSIS FUNCTIONS ==========

    /**
     * Generate improvement suggestions for PLO-MLO alignment
     */
    async generateImprovementSuggestions(ploText, mloText, currentScore) {
        const context = {
            ploData: { text: ploText, type: 'Programme Learning Outcome' },
            mloData: { text: mloText, type: 'Module Learning Outcome' },
            alignmentScore: currentScore
        };

        const prompt = `Analyze the alignment between these learning outcomes and provide 3-5 specific improvement suggestions:

PLO: "${ploText}"
MLO: "${mloText}"
Current Score: ${currentScore}/5

Focus on vocabulary alignment, cognitive levels, and competency development.`;

        return await this.executeCustomPrompt(prompt, context);
    }

    /**
     * Analyze course content for CLO-MLO mapping
     */
    async analyzeCourseContent(courseDescription, learningOutcomes) {
        const context = {
            courseData: { description: courseDescription },
            mloData: learningOutcomes
        };

        const prompt = `Analyze this course for optimal CLO-MLO mapping:

Course: "${courseDescription}"
Learning Outcomes: ${learningOutcomes.map((lo, i) => `${i+1}. ${lo}`).join('\n')}

Provide mapping recommendations and identify gaps.`;

        return await this.executeCustomPrompt(prompt, context);
    }

    /**
     * Quick alignment check between two learning outcomes
     */
    async quickAlignmentCheck(outcome1, outcome2, type1 = 'PLO', type2 = 'MLO') {
        const prompt = `Quickly analyze the alignment between these learning outcomes:

${type1}: "${outcome1}"
${type2}: "${outcome2}"

Provide:
1. Alignment score (1-5)
2. Key strengths
3. Main concerns
4. One quick improvement suggestion`;

        return await this.executeCustomPrompt(prompt);
    }

    // ========== UTILITY FUNCTIONS ==========

    /**
     * Estimate token usage (rough approximation)
     */
    estimateTokens(text) {
        // Rough estimate: 1 token ≈ 4 characters for English text
        return Math.ceil(text.length / 4);
    }

    /**
     * Check remaining quota (approximate)
     */
    checkQuotaStatus() {
        // This is informational - actual quota tracking would need server-side implementation
        return {
            model: 'Gemini 1.5 Flash',
            freeQuota: {
                requestsPerMinute: 15,
                tokensPerDay: 1000000,
                requestsPerDay: 1500
            },
            recommendations: [
                'Monitor your usage in Google AI Studio console',
                'Consider upgrading to paid tier for higher limits',
                'Use shorter prompts when possible to conserve tokens'
            ]
        };
    }

    /**
     * Get API status information
     */
    getAPIStatus() {
        if (!this.apiConfig) {
            return 'Not configured';
        } else if (!this.apiConfig.initialized) {
            return 'Initializing...';
        } else if (this.apiConfig.isReady()) {
            return 'Ready (Gemini 1.5 Flash)';
        } else {
            return 'Configuration error';
        }
    }

    // ========== FALLBACK FUNCTIONS ==========

    getFallbackSuggestions(score) {
        const suggestions = [
            'Review vocabulary alignment between outcomes',
            'Check cognitive level progression using Bloom\'s taxonomy',
            'Ensure measurable and specific language',
            'Consider assessment method alignment',
            'Review competency development pathways'
        ];
        
        return {
            success: false,
            response: suggestions.slice(0, Math.max(2, 5 - score)).join('\n• '),
            fallback: true
        };
    }
}

// Create global instance
window.enhancedAIFeatures = new EnhancedAIFeatures();

// Auto-initialize when DOM loads
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🤖 Initializing Enhanced AI Features...');
    const success = await window.enhancedAIFeatures.init();
    if (success) {
        console.log('✅ Enhanced AI Features ready with Gemini 1.5 Flash!');
    } else {
        console.warn('⚠️ AI Features initialization failed - check API configuration');
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnhancedAIFeatures;
}
