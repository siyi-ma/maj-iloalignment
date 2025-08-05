import OpenAI from 'openai';

/**
 * OpenAI Experiment for CLO-MLO Analysis
 * Purpose: Compare OpenAI performance with existing Gemini implementation
 */
class OpenAIExperiment {
    constructor() {
        this.client = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }

    /**
     * Test CLO-MLO alignment analysis using OpenAI
     * @param {string} cloText - Course Learning Outcome text
     * @param {string} mloText - Module Learning Outcome text
     * @returns {Promise<Object>} Analysis result
     */
    async analyzeCLOMLOAlignment(cloText, mloText) {
        try {
            const prompt = `
            Analyze the alignment between this Course Learning Outcome (CLO) and Module Learning Outcome (MLO):
            
            CLO: "${cloText}"
            MLO: "${mloText}"
            
            Please provide:
            1. Alignment score (1-5 scale where 1=minimal, 5=excellent alignment)
            2. Detailed justification for the score
            3. Specific keywords/concepts that connect them
            4. Improvement suggestions if alignment is weak
            
            Format your response as JSON with keys: score, justification, keywords, suggestions
            `;

            const completion = await this.client.chat.completions.create({
                messages: [{ role: "user", content: prompt }],
                model: "gpt-3.5-turbo",
                temperature: 0.3,
                max_tokens: 600,
                response_format: { type: "json_object" }
            });

            return {
                provider: 'OpenAI',
                result: JSON.parse(completion.choices[0].message.content),
                timestamp: new Date().toISOString(),
                usage: completion.usage
            };
        } catch (error) {
            console.error('OpenAI API error:', error);
            return {
                provider: 'OpenAI',
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }

    /**
     * Batch analysis for multiple CLO-MLO pairs
     * @param {Array} pairs - Array of {clo, mlo, name} objects
     * @returns {Promise<Array>} Results array
     */
    async batchAnalysis(pairs) {
        const results = [];
        
        for (let i = 0; i < pairs.length; i++) {
            const pair = pairs[i];
            console.log(`Processing ${i + 1}/${pairs.length}: ${pair.name}`);
            
            const result = await this.analyzeCLOMLOAlignment(pair.clo, pair.mlo);
            results.push({
                testCase: pair.name,
                ...result
            });
            
            // Rate limiting - wait 1 second between requests
            if (i < pairs.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
        
        return results;
    }

    /**
     * Generate performance report
     * @param {Array} results - Analysis results
     * @returns {Object} Performance report
     */
    generateReport(results) {
        const successful = results.filter(r => !r.error);
        const failed = results.filter(r => r.error);
        
        if (successful.length === 0) {
            return { error: 'No successful analyses to report' };
        }

        const scores = successful.map(r => r.result.score);
        const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
        
        const totalTokens = successful.reduce((total, r) => {
            return total + (r.usage?.total_tokens || 0);
        }, 0);

        return {
            summary: {
                totalTests: results.length,
                successful: successful.length,
                failed: failed.length,
                averageScore: avgScore.toFixed(2),
                totalTokensUsed: totalTokens
            },
            scoreDistribution: {
                score1: scores.filter(s => s === 1).length,
                score2: scores.filter(s => s === 2).length,
                score3: scores.filter(s => s === 3).length,
                score4: scores.filter(s => s === 4).length,
                score5: scores.filter(s => s === 5).length
            },
            results: results
        };
    }
}

export default OpenAIExperiment;
