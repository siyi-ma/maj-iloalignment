import OpenAIExperiment from './index.js';

/**
 * Comparison framework to evaluate OpenAI vs other analysis methods
 */
class AnalysisComparison {
    constructor() {
        this.openaiExperiment = new OpenAIExperiment();
        this.results = [];
    }

    /**
     * Simulate local/rule-based analysis (placeholder for your existing logic)
     * @param {string} cloText 
     * @param {string} mloText 
     * @returns {Object} Local analysis result
     */
    simulateLocalAnalysis(cloText, mloText) {
        // Simplified keyword matching simulation
        const cloWords = cloText.toLowerCase().split(' ');
        const mloWords = mloText.toLowerCase().split(' ');
        
        const commonWords = cloWords.filter(word => 
            mloWords.includes(word) && word.length > 3
        );
        
        let score = Math.min(5, Math.max(1, commonWords.length));
        
        return {
            provider: 'Local',
            result: {
                score: score,
                justification: `Found ${commonWords.length} common keywords: ${commonWords.join(', ')}`,
                keywords: commonWords,
                method: 'keyword_matching'
            },
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Simulate Gemini API analysis (placeholder)
     * @param {string} cloText 
     * @param {string} mloText 
     * @returns {Promise<Object>} Simulated Gemini result
     */
    async simulateGeminiAnalysis(cloText, mloText) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Simulate Gemini-style response (you would replace this with actual Gemini calls)
        const baseScore = this.simulateLocalAnalysis(cloText, mloText).result.score;
        const variation = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
        const score = Math.min(5, Math.max(1, baseScore + variation));
        
        return {
            provider: 'Gemini',
            result: {
                score: score,
                justification: `Gemini analysis based on semantic understanding and context`,
                keywords: ['semantic', 'analysis', 'context'],
                confidence: 0.85
            },
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Run comprehensive comparison across multiple providers
     * @param {Array} testCases - Array of test cases
     * @returns {Promise<Object>} Comparison report
     */
    async runComparison(testCases) {
        console.log(`🔄 Running comparison across ${testCases.length} test cases...\n`);
        
        for (let i = 0; i < testCases.length; i++) {
            const testCase = testCases[i];
            console.log(`Testing: ${testCase.name} (${i + 1}/${testCases.length})`);
            
            try {
                // Get results from all providers
                const [openaiResult, geminiResult, localResult] = await Promise.all([
                    this.openaiExperiment.analyzeCLOMLOAlignment(testCase.clo, testCase.mlo),
                    this.simulateGeminiAnalysis(testCase.clo, testCase.mlo),
                    Promise.resolve(this.simulateLocalAnalysis(testCase.clo, testCase.mlo))
                ]);

                const comparison = this.compareResults(openaiResult, geminiResult, localResult);
                
                this.results.push({
                    testCase: testCase.name,
                    clo: testCase.clo,
                    mlo: testCase.mlo,
                    openai: openaiResult,
                    gemini: geminiResult,
                    local: localResult,
                    comparison: comparison
                });
                
                console.log(`  OpenAI: ${openaiResult.error ? 'ERROR' : openaiResult.result.score}/5`);
                console.log(`  Gemini: ${geminiResult.result.score}/5`);
                console.log(`  Local:  ${localResult.result.score}/5`);
                console.log(`  Variance: ${comparison.scoreVariance.toFixed(2)}\n`);
                
            } catch (error) {
                console.error(`Error in test case ${testCase.name}:`, error);
            }
        }
        
        return this.generateComparisonReport();
    }

    /**
     * Compare results from different providers
     * @param {Object} openaiResult 
     * @param {Object} geminiResult 
     * @param {Object} localResult 
     * @returns {Object} Comparison metrics
     */
    compareResults(openaiResult, geminiResult, localResult) {
        const scores = [
            openaiResult.error ? null : openaiResult.result.score,
            geminiResult.result.score,
            localResult.result.score
        ].filter(s => s !== null);
        
        const variance = this.calculateVariance(scores);
        const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
        
        // Determine recommended provider based on consistency and explanation quality
        let recommendedProvider = 'Local'; // Default fallback
        
        if (!openaiResult.error) {
            const openaiQuality = (openaiResult.result.justification?.length || 0) > 50 ? 2 : 1;
            const geminiQuality = (geminiResult.result.justification?.length || 0) > 50 ? 2 : 1;
            const localQuality = 1; // Simple keyword matching
            
            if (openaiQuality >= geminiQuality && openaiQuality >= localQuality) {
                recommendedProvider = 'OpenAI';
            } else if (geminiQuality > localQuality) {
                recommendedProvider = 'Gemini';
            }
        }
        
        return {
            scoreVariance: variance,
            averageScore: avgScore,
            consistency: variance < 1 ? 'High' : variance < 2 ? 'Medium' : 'Low',
            recommendedProvider: recommendedProvider,
            reasoning: this.getRecommendationReasoning(openaiResult, geminiResult, localResult)
        };
    }

    /**
     * Calculate variance of scores
     * @param {Array} scores 
     * @returns {number} Variance
     */
    calculateVariance(scores) {
        if (scores.length < 2) return 0;
        
        const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
        const variance = scores.reduce((acc, score) => acc + Math.pow(score - mean, 2), 0) / scores.length;
        return Math.sqrt(variance);
    }

    /**
     * Generate reasoning for provider recommendation
     * @param {Object} openaiResult 
     * @param {Object} geminiResult 
     * @param {Object} localResult 
     * @returns {string} Reasoning text
     */
    getRecommendationReasoning(openaiResult, geminiResult, localResult) {
        if (openaiResult.error) {
            return 'OpenAI failed, comparing Gemini vs Local';
        }
        
        const explanationLengths = {
            openai: openaiResult.result.justification?.length || 0,
            gemini: geminiResult.result.justification?.length || 0,
            local: localResult.result.justification?.length || 0
        };
        
        const maxLength = Math.max(...Object.values(explanationLengths));
        const bestProvider = Object.keys(explanationLengths).find(
            key => explanationLengths[key] === maxLength
        );
        
        return `Recommended based on explanation quality and consistency. ${bestProvider} provided most detailed analysis.`;
    }

    /**
     * Generate comprehensive comparison report
     * @returns {Object} Report object
     */
    generateComparisonReport() {
        const successful = this.results.filter(r => !r.openai.error);
        
        const providerStats = {
            openai: this.calculateProviderStats(this.results, 'openai'),
            gemini: this.calculateProviderStats(this.results, 'gemini'),
            local: this.calculateProviderStats(this.results, 'local')
        };
        
        const recommendations = this.generateRecommendations();
        
        return {
            summary: {
                totalTests: this.results.length,
                successfulOpenAI: successful.length,
                averageVariance: this.results.reduce((acc, r) => acc + r.comparison.scoreVariance, 0) / this.results.length
            },
            providerStats: providerStats,
            recommendations: recommendations,
            detailedResults: this.results
        };
    }

    /**
     * Calculate statistics for a specific provider
     * @param {Array} results 
     * @param {string} provider 
     * @returns {Object} Provider statistics
     */
    calculateProviderStats(results, provider) {
        const scores = results
            .map(r => r[provider]?.result?.score)
            .filter(s => s !== undefined && s !== null);
        
        if (scores.length === 0) {
            return { error: 'No valid scores' };
        }
        
        return {
            averageScore: (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2),
            minScore: Math.min(...scores),
            maxScore: Math.max(...scores),
            totalAnalyses: scores.length
        };
    }

    /**
     * Generate actionable recommendations
     * @returns {Array} Recommendations array
     */
    generateRecommendations() {
        const recommendations = [];
        
        const openaiSuccessRate = this.results.filter(r => !r.openai.error).length / this.results.length;
        
        if (openaiSuccessRate < 0.8) {
            recommendations.push('Consider API key configuration and rate limiting for OpenAI');
        }
        
        const highVarianceTests = this.results.filter(r => r.comparison.scoreVariance > 1.5);
        if (highVarianceTests.length > 0) {
            recommendations.push(`${highVarianceTests.length} test cases show high variance - review edge cases`);
        }
        
        const providerPreferences = this.results.map(r => r.comparison.recommendedProvider);
        const openaiPreferred = providerPreferences.filter(p => p === 'OpenAI').length;
        
        if (openaiPreferred > this.results.length * 0.6) {
            recommendations.push('OpenAI shows superior analysis quality - consider integration');
        } else {
            recommendations.push('Local/Gemini methods sufficient for current use cases');
        }
        
        return recommendations;
    }
}

export default AnalysisComparison;
