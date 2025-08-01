/**
 * Advanced Alignment Scoring Engine
 * Preserves all sophisticated algorithms from the 2170-line prototype
 * For educational outcome alignment analysis
 */

class AlignmentEngine {
    constructor() {
        // Bloom's Taxonomy levels for cognitive analysis
        this.bloomLevels = {
            'remember': 1, 'recognize': 1, 'recall': 1, 'identify': 1, 'define': 1, 'list': 1,
            'understand': 2, 'explain': 2, 'interpret': 2, 'classify': 2, 'summarize': 2,
            'apply': 3, 'implement': 3, 'use': 3, 'execute': 3, 'demonstrate': 3,
            'analyze': 4, 'differentiate': 4, 'compare': 4, 'examine': 4, 'categorize': 4,
            'evaluate': 5, 'assess': 5, 'judge': 5, 'critique': 5, 'justify': 5,
            'create': 6, 'design': 6, 'develop': 6, 'formulate': 6, 'synthesize': 6
        };

        // Common action verbs for educational outcomes
        this.actionVerbs = [
            'analyze', 'apply', 'assess', 'create', 'define', 'demonstrate', 'design', 
            'develop', 'evaluate', 'explain', 'identify', 'implement', 'interpret', 
            'plan', 'solve', 'understand', 'use', 'synthesize', 'formulate', 'construct'
        ];

        // Common semantic phrases in educational context
        this.semanticPhrases = [
            'knowledge', 'skills', 'analyze', 'evaluate', 'create', 
            'problem', 'solution', 'research', 'communicate', 'demonstrate',
            'professional', 'ethical', 'team', 'individual', 'practice'
        ];
    }

    /**
     * Main alignment analysis function
     * @param {Array} outcomes1 - First set of learning outcomes (PLOs or CLOs)
     * @param {Array} outcomes2 - Second set of learning outcomes (MLOs)
     * @returns {Object} Complete alignment analysis results
     */
    analyzeAlignment(outcomes1, outcomes2) {
        const results = {};
        
        outcomes1.forEach((outcome1, index1) => {
            const outcomeKey = `outcome-${index1}`;
            results[outcomeKey] = {};
            
            // Group outcomes2 by category if they have category info
            const groupedOutcomes2 = this.groupOutcomesByCategory(outcomes2);
            
            Object.keys(groupedOutcomes2).forEach(category => {
                const categoryOutcomes = groupedOutcomes2[category];
                let categoryScores = [];
                let categoryJustifications = [];
                
                categoryOutcomes.forEach((outcome2, index2) => {
                    const score = this.calculateAlignmentScore(
                        this.getOutcomeText(outcome1), 
                        this.getOutcomeText(outcome2)
                    );
                    const justification = this.generateAlignmentReason(
                        this.getOutcomeText(outcome1), 
                        this.getOutcomeText(outcome2), 
                        score
                    );
                    
                    categoryScores.push(score);
                    categoryJustifications.push({
                        outcomeIndex: index2,
                        score: score,
                        justification: justification,
                        outcome: outcome2
                    });
                });
                
                // Calculate average score for the category
                const averageScore = categoryScores.length > 0 
                    ? categoryScores.reduce((sum, score) => sum + score, 0) / categoryScores.length 
                    : 0;
                
                results[outcomeKey][category] = {
                    score: Math.round(averageScore),
                    exactScore: averageScore.toFixed(2),
                    individualScores: categoryScores,
                    justifications: categoryJustifications
                };
            });
        });
        
        return results;
    }

    /**
     * Calculate alignment score between two learning outcomes (1-5 scale)
     * Preserves the sophisticated algorithm from the original prototype
     */
    calculateAlignmentScore(text1, text2) {
        // Extract components for analysis
        const keywords1 = this.extractKeywords(text1);
        const keywords2 = this.extractKeywords(text2);
        const verbs1 = this.extractVerbs(text1);
        const verbs2 = this.extractVerbs(text2);
        
        // Calculate keyword match score
        let keywordScore = 0;
        keywords1.forEach(keyword => {
            if (text2.toLowerCase().includes(keyword)) {
                keywordScore += 0.5;
            }
            
            // Check for partial matches
            const partialMatches = keywords2.filter(k2 => 
                k2.includes(keyword) || keyword.includes(k2)
            );
            if (partialMatches.length > 0) {
                keywordScore += 0.2;
            }
        });
        
        // Calculate verb alignment score
        const verbScore = this.calculateVerbScore(verbs1, verbs2);
        
        // Calculate semantic similarity
        const semanticScore = this.calculateSemanticScore(text1, text2);
        
        // Calculate final score
        let finalScore = 1; // Base score
        finalScore += Math.min(keywordScore, 2); // Max 2 points from keywords
        finalScore += Math.min(verbScore, 1); // Max 1 point from verbs
        finalScore += Math.min(semanticScore, 1); // Max 1 point from semantic similarity
        
        return Math.min(Math.round(finalScore), 5); // Cap at 5
    }

    /**
     * Calculate verb alignment score based on Bloom's taxonomy
     */
    calculateVerbScore(verbs1, verbs2) {
        // Get highest Bloom's levels
        let level1 = 0;
        let level2 = 0;
        
        verbs1.forEach(verb => {
            const level = this.bloomLevels[verb] || 0;
            level1 = Math.max(level1, level);
        });
        
        verbs2.forEach(verb => {
            const level = this.bloomLevels[verb] || 0;
            level2 = Math.max(level2, level);
        });
        
        // Score based on level alignment
        if (level1 === level2 && level1 > 0) {
            return 1.0; // Exact match
        } else if (Math.abs(level1 - level2) <= 1 && level1 > 0 && level2 > 0) {
            return 0.8; // Close match
        } else if (verbs1.filter(v => verbs2.includes(v)).length > 0) {
            return 0.6; // Some common verbs
        } else if (level1 > 0 && level2 > 0) {
            return 0.3; // Both have verbs but no alignment
        }
        
        return 0;
    }

    /**
     * Calculate semantic similarity score
     */
    calculateSemanticScore(text1, text2) {
        let commonCount = 0;
        this.semanticPhrases.forEach(phrase => {
            if (text1.toLowerCase().includes(phrase) && text2.toLowerCase().includes(phrase)) {
                commonCount++;
            }
        });
        
        const lengthRatio = Math.min(text1.length, text2.length) / Math.max(text1.length, text2.length);
        
        return (commonCount / 10) * 0.7 + lengthRatio * 0.3;
    }

    /**
     * Extract keywords from text
     */
    extractKeywords(text) {
        const commonWords = ['the', 'and', 'is', 'in', 'to', 'of', 'a', 'for', 'with', 'on', 'at'];
        
        return text.toLowerCase()
            .replace(/[.,;:'"!?()]/g, '')
            .split(' ')
            .filter(word => word.length > 3 && !commonWords.includes(word))
            .slice(0, 5); // Take up to 5 keywords
    }

    /**
     * Extract action verbs from text
     */
    extractVerbs(text) {
        const textLower = text.toLowerCase();
        const foundVerbs = this.actionVerbs.filter(verb => textLower.includes(verb));
        
        return foundVerbs.length > 0 ? foundVerbs : ['demonstrate', 'analyze', 'develop'];
    }

    /**
     * Generate alignment reason based on score and analysis
     */
    generateAlignmentReason(text1, text2, score) {
        const keywords1 = this.extractKeywords(text1);
        const keywords2 = this.extractKeywords(text2);
        const verbs1 = this.extractVerbs(text1);
        const verbs2 = this.extractVerbs(text2);
        
        const commonKeywords = keywords1.filter(k => keywords2.includes(k));
        const commonVerbs = verbs1.filter(v => verbs2.includes(v));
        
        switch (score) {
            case 0:
                return `No alignment detected. The first outcome focuses on "${keywords1.join(', ')}" while the second addresses "${keywords2.join(', ')}" with different approaches.`;
            case 1:
                if (commonKeywords.length === 0 && commonVerbs.length === 0) {
                    return `Minimal alignment with no shared terminology or learning approaches. Different domain focus.`;
                } else {
                    return `Limited alignment with few conceptual connections. Outcomes address different learning domains.`;
                }
            case 2:
                if (commonKeywords.length > 0) {
                    return `Partial content alignment through shared terminology "${commonKeywords.join(', ')}", but different cognitive approaches.`;
                } else if (commonVerbs.length > 0) {
                    return `Partial methodological alignment through similar approaches (${commonVerbs.join(', ')}), but different content focus.`;
                } else {
                    return `Limited alignment with some indirect connections but different focal areas.`;
                }
            case 3:
                if (commonKeywords.length >= 2 && commonVerbs.length >= 1) {
                    return `Meaningful alignment through shared vocabulary (${commonKeywords.join(', ')}) and learning approaches (${commonVerbs.join(', ')}), though scope differs.`;
                } else {
                    return `Moderate alignment with complementary learning goals despite some differences in terminology and approach.`;
                }
            case 4:
                if (commonKeywords.length >= 2 && commonVerbs.length >= 1) {
                    return `Strong alignment through shared key concepts (${commonKeywords.join(', ')}) and learning approaches (${commonVerbs.join(', ')}). The outcomes effectively support each other.`;
                } else {
                    return `Strong alignment in purpose and application. The outcomes work synergistically toward similar learning goals.`;
                }
            case 5:
                return `Exceptional alignment across multiple dimensions. The outcomes directly reinforce and extend each other's learning expectations with strong conceptual and methodological connections.`;
            default:
                return `Alignment score ${score} - unable to generate specific justification.`;
        }
    }

    /**
     * Generate improvement suggestion for low scores
     */
    generateImprovementSuggestion(text1, text2) {
        const keywords1 = this.extractKeywords(text1);
        const keywords2 = this.extractKeywords(text2);
        const missingKeywords = keywords1.filter(k => !keywords2.includes(k));
        
        if (missingKeywords.length > 0) {
            return `Consider incorporating key concepts such as "${missingKeywords.slice(0, 3).join(', ')}" to strengthen alignment with programme goals.`;
        } else {
            return `Consider refining the outcome to more explicitly support higher-level learning objectives and programme-wide competencies.`;
        }
    }

    /**
     * Helper function to group outcomes by category
     */
    groupOutcomesByCategory(outcomes) {
        const grouped = { 'default': [] };
        
        outcomes.forEach(outcome => {
            // Try to extract category from outcome structure
            let category = 'default';
            
            if (outcome.mlokood) {
                // For MLOs, extract category from code
                category = outcome.mlokood.split('_')[0];
            } else if (outcome.category) {
                category = outcome.category;
            }
            
            if (!grouped[category]) {
                grouped[category] = [];
            }
            grouped[category].push(outcome);
        });
        
        return grouped;
    }

    /**
     * Helper function to extract text from outcome object
     */
    getOutcomeText(outcome) {
        if (typeof outcome === 'string') {
            return outcome;
        }
        
        // Handle different outcome structures
        return outcome.plosisuik || outcome.mlosisuik || outcome.text || outcome.description || '';
    }
}

// Create global instance
window.alignmentEngine = new AlignmentEngine();

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AlignmentEngine;
}
