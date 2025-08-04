// Example: How to use the Secure API Configuration
// This demonstrates how to make AI-powered improvements to your webapp

class AIFeatures {
    constructor() {
        this.apiConfig = window.personalAPIConfig || window.secureAPIConfig;
    }

    // Example: Generate improvement suggestions for PLO-MLO alignment
    async generateImprovementSuggestions(ploText, mloText, currentScore) {
        try {
            const prompt = `
As an educational curriculum expert, analyze the alignment between this Programme Learning Outcome (PLO) and Module Learning Outcome (MLO):

PLO: "${ploText}"
MLO: "${mloText}"
Current Alignment Score: ${currentScore}/5

Provide 3-5 specific, actionable improvement suggestions to enhance the alignment between these outcomes. Focus on:
1. Vocabulary and terminology alignment
2. Cognitive level progression (Bloom's taxonomy)
3. Competency development
4. Assessment methods

Format your response as a bulleted list with practical recommendations.
            `;

            // Use the secure API configuration
            if (window.secureAPIConfig && window.secureAPIConfig.isReady()) {
                const response = await window.secureAPIConfig.callGeminiAPI(prompt);
                return this.parseImprovementSuggestions(response);
            } else {
                throw new Error('API configuration not ready');
            }
        } catch (error) {
            console.error('Failed to generate AI suggestions:', error);
            return this.getFallbackSuggestions(currentScore);
        }
    }

    // Example: Analyze course content for better CLO-MLO mapping
    async analyzeCourseContent(courseDescription, learningOutcomes) {
        try {
            const prompt = `
Analyze this course for optimal Course Learning Outcome (CLO) to Module Learning Outcome (MLO) mapping:

Course Description: "${courseDescription}"
Current Learning Outcomes: ${learningOutcomes.map((lo, i) => `${i+1}. ${lo}`).join('\n')}

Provide recommendations for:
1. Missing learning outcomes that should be added
2. Redundant outcomes that could be consolidated
3. Alignment with industry standards
4. Assessment strategy recommendations

Format as structured analysis with clear sections.
            `;

            if (window.secureAPIConfig && window.secureAPIConfig.isReady()) {
                return await window.secureAPIConfig.callGeminiAPI(prompt);
            } else {
                throw new Error('API configuration not ready');
            }
        } catch (error) {
            console.error('Failed to analyze course content:', error);
            return null;
        }
    }

    // Parse AI response into structured suggestions
    parseImprovementSuggestions(response) {
        const suggestions = [];
        const lines = response.split('\n');
        
        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*')) {
                suggestions.push(trimmed.substring(1).trim());
            } else if (trimmed.match(/^\d+\./)) {
                suggestions.push(trimmed.replace(/^\d+\./, '').trim());
            }
        }
        
        return suggestions.filter(s => s.length > 10); // Filter out short/empty suggestions
    }

    // Fallback suggestions when AI is not available
    getFallbackSuggestions(score) {
        const fallbacks = {
            1: [
                "Critical misalignment detected. Consider restructuring the MLO to directly address PLO requirements.",
                "Review the cognitive level progression between PLO and MLO using Bloom's taxonomy.",
                "Identify and incorporate key terminology from the PLO into the MLO description."
            ],
            2: [
                "Partial alignment present. Enhance MLO by adding specific assessment methods.",
                "Include competency-based language that mirrors the PLO expectations.",
                "Consider expanding the MLO to include measurable learning activities."
            ],
            3: [
                "Moderate alignment achieved. Fine-tune vocabulary consistency between PLO and MLO.",
                "Strengthen the connection by adding explicit skill development components.",
                "Review assessment strategies to ensure they demonstrate PLO achievement."
            ]
        };
        
        return fallbacks[score] || fallbacks[2]; // Default to score 2 suggestions
    }

    // Check if AI features are available
    isAIReady() {
        return window.secureAPIConfig && window.secureAPIConfig.isReady();
    }

    // Get API status for debugging
    getAPIStatus() {
        if (!window.secureAPIConfig) {
            return 'API configuration not loaded';
        }
        
        if (!window.secureAPIConfig.initialized) {
            return 'API configuration not initialized';
        }
        
        if (!window.secureAPIConfig.getApiKey()) {
            return 'No API key available';
        }
        
        return 'Ready';
    }
}

// Make available globally
window.aiFeatures = new AIFeatures();

// Example usage in your existing code:
/*
// In your improvement suggestions function:
async function generateImprovementSuggestions(score, competencyMatches, keywordOverlap, mloText, ploText) {
    if (score >= 3) return null;
    
    // Try AI-powered suggestions first
    if (window.aiFeatures.isAIReady()) {
        try {
            const aiSuggestions = await window.aiFeatures.generateImprovementSuggestions(ploText, mloText, score);
            if (aiSuggestions && aiSuggestions.length > 0) {
                return aiSuggestions;
            }
        } catch (error) {
            console.log('AI suggestions failed, using fallback');
        }
    }
    
    // Fallback to your existing logic
    // ... your existing suggestion generation code ...
}
*/
