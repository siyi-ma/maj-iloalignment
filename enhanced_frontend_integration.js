/**
 * Enhanced PLO-MLO Analysis Frontend Integration
 * Connects the existing JavaScript frontend with AI-powered backend analysis
 */

class EnhancedAnalyzer {
    constructor() {
        this.apiEndpoint = '/api/enhanced-analysis';
        this.cache = new Map();
        this.loadingStates = new Set();
    }

    /**
     * Enhanced alignment scoring with multiple AI approaches
     */
    async getEnhancedAlignmentScore(ploCode, mloCode, mloData) {
        const cacheKey = `${ploCode}-${mloCode}`;
        
        // Return cached result if available
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        // Prevent duplicate requests
        if (this.loadingStates.has(cacheKey)) {
            return this.waitForResult(cacheKey);
        }

        this.loadingStates.add(cacheKey);

        try {
            // Get PLO and MLO text content
            const ploText = this.getPLOText(ploCode);
            const mloText = this.getMLOText(mloData);

            // Call enhanced analysis API
            const result = await this.callEnhancedAPI(ploText, mloText);
            
            // Cache and return result
            this.cache.set(cacheKey, result);
            return result;

        } catch (error) {
            console.error('Enhanced analysis failed:', error);
            // Fallback to traditional scoring
            return this.fallbackToTraditional(ploCode, mloCode, mloData);
        } finally {
            this.loadingStates.delete(cacheKey);
        }
    }

    /**
     * Call the enhanced analysis backend API
     */
    async callEnhancedAPI(ploText, mloText) {
        const response = await fetch(this.apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                plo_text: ploText,
                mlo_text: mloText,
                analysis_options: {
                    include_concepts: true,
                    include_bloom_mapping: true,
                    include_recommendations: true
                }
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.error || 'Analysis failed');
        }

        return {
            score: data.scores.final,
            breakdown: {
                traditional: data.scores.traditional,
                semantic: data.scores.semantic,
                concept: data.scores.concept
            },
            analysis: data.analysis,
            recommendations: data.recommendations,
            isEnhanced: true
        };
    }

    /**
     * Generate enhanced justifications using AI analysis results
     */
    generateEnhancedJustification(score, analysisData, language = 'english') {
        if (!analysisData || !analysisData.isEnhanced) {
            return this.generateTraditionalJustification(score, language);
        }

        const { breakdown, analysis, recommendations } = analysisData;
        
        // Base justification with detailed breakdown
        let justification = this.buildScoreJustification(score, breakdown, analysis, language);
        
        // Add AI-powered insights
        if (analysis.extracted_concepts && analysis.extracted_concepts.length > 0) {
            justification += this.addConceptualInsights(analysis.extracted_concepts, language);
        }

        // Add Bloom's taxonomy analysis
        if (analysis.bloom_alignment && Object.keys(analysis.bloom_alignment).length > 0) {
            justification += this.addBloomAnalysis(analysis.bloom_alignment, language);
        }

        return justification;
    }

    /**
     * Generate enhanced improvement suggestions
     */
    generateEnhancedImprovements(score, analysisData, language = 'english') {
        if (!analysisData || !analysisData.isEnhanced || score >= 3) {
            return ''; // Only show improvements for scores < 3
        }

        const { recommendations, analysis } = analysisData;
        
        let improvements = '';
        
        // AI-generated recommendations
        if (recommendations && recommendations.length > 0) {
            const title = language === 'english' ? 'AI-Powered Recommendations:' : 'AI-põhised soovitused:';
            improvements += `<strong>${title}</strong><br>`;
            
            recommendations.forEach(rec => {
                improvements += `• ${rec}<br>`;
            });
        }

        // Concept-based suggestions
        if (analysis.extracted_concepts) {
            improvements += this.generateConceptBasedSuggestions(analysis.extracted_concepts, language);
        }

        return improvements;
    }

    /**
     * Build detailed score justification
     */
    buildScoreJustification(score, breakdown, analysis, language) {
        const isEnglish = language === 'english';
        
        let justification = '';
        
        // Multi-dimensional analysis summary
        if (isEnglish) {
            justification = `Comprehensive analysis: ${score.toFixed(1)}/5 alignment score. `;
            justification += `Traditional keyword overlap: ${breakdown.traditional.toFixed(1)}, `;
            justification += `Semantic similarity: ${breakdown.semantic.toFixed(1)}, `;
            justification += `Conceptual alignment: ${breakdown.concept.toFixed(1)}. `;
        } else {
            justification = `Terviklik analüüs: ${score.toFixed(1)}/5 vastavuse skoor. `;
            justification += `Traditsiooniline märksõnade kattuvus: ${breakdown.traditional.toFixed(1)}, `;
            justification += `Semantiline sarnasus: ${breakdown.semantic.toFixed(1)}, `;
            justification += `Kontseptuaalne vastavus: ${breakdown.concept.toFixed(1)}. `;
        }

        return justification;
    }

    /**
     * Add conceptual insights to justification
     */
    addConceptualInsights(concepts, language) {
        const isEnglish = language === 'english';
        
        // Group concepts by type
        const conceptTypes = {};
        concepts.forEach(concept => {
            if (!conceptTypes[concept.type]) {
                conceptTypes[concept.type] = [];
            }
            conceptTypes[concept.type].push(concept);
        });

        let insights = '';
        
        if (Object.keys(conceptTypes).length > 0) {
            const header = isEnglish ? 'Identified concepts: ' : 'Tuvastatud kontseptsioonid: ';
            insights += header;
            
            Object.keys(conceptTypes).forEach(type => {
                const count = conceptTypes[type].length;
                insights += `${count} ${type}${count > 1 ? 's' : ''}, `;
            });
            
            insights = insights.slice(0, -2) + '. '; // Remove trailing comma
        }

        return insights;
    }

    /**
     * Add Bloom's taxonomy analysis
     */
    addBloomAnalysis(bloomAlignment, language) {
        const isEnglish = language === 'english';
        
        if (Object.keys(bloomAlignment).length === 0) {
            return '';
        }

        const header = isEnglish ? 'Cognitive alignment: ' : 'Kognitiivne vastavus: ';
        let analysis = header;

        Object.entries(bloomAlignment).forEach(([ploLevel, mloLevel]) => {
            if (ploLevel === mloLevel) {
                const match = isEnglish ? 'exact match' : 'täpne vastavus';
                analysis += `${ploLevel} (${match}), `;
            } else {
                const progression = isEnglish ? 'progression' : 'progressioon';
                analysis += `${ploLevel}→${mloLevel} (${progression}), `;
            }
        });

        return analysis.slice(0, -2) + '. ';
    }

    /**
     * Generate concept-based improvement suggestions
     */
    generateConceptBasedSuggestions(concepts, language) {
        const isEnglish = language === 'english';
        
        // Analyze missing cognitive levels
        const presentLevels = new Set();
        concepts.forEach(concept => {
            if (concept.attributes && concept.attributes.bloom_level) {
                presentLevels.add(concept.attributes.bloom_level);
            }
        });

        const allBloomLevels = ['remember', 'understand', 'apply', 'analyze', 'evaluate', 'create'];
        const missingLevels = allBloomLevels.filter(level => !presentLevels.has(level));

        if (missingLevels.length > 0) {
            const header = isEnglish ? 'Suggested cognitive enhancements: ' : 'Soovitatud kognitiivsed täiendused: ';
            let suggestions = `<br><strong>${header}</strong><br>`;
            
            missingLevels.slice(0, 3).forEach(level => { // Show top 3 missing levels
                const suggestion = this.getBloomLevelSuggestion(level, language);
                suggestions += `• ${suggestion}<br>`;
            });
            
            return suggestions;
        }

        return '';
    }

    /**
     * Get specific suggestions for Bloom's taxonomy levels
     */
    getBloomLevelSuggestion(level, language) {
        const isEnglish = language === 'english';
        
        const suggestions = {
            remember: {
                english: "Add activities requiring recall of key terms, facts, and basic concepts",
                estonian: "Lisa tegevusi, mis nõuavad võtmeterminite, faktide ja põhikontseptsioonide meenutamist"
            },
            understand: {
                english: "Include explanations, interpretations, and concept clarifications",
                estonian: "Kaasa selgitused, tõlgendused ja kontseptsioonide selgitused"
            },
            apply: {
                english: "Develop practical scenarios and real-world application exercises",
                estonian: "Arenda praktilisi stsenaariume ja reaalelu rakendusharjutusi"
            },
            analyze: {
                english: "Add complex problem decomposition and systematic analysis tasks",
                estonian: "Lisa keerukate probleemide lahutamist ja süstemaatilise analüüsi ülesandeid"
            },
            evaluate: {
                english: "Include criterion-based assessment and critical judgment activities",
                estonian: "Kaasa kriteeriumipõhist hindamist ja kriitilise otsustamise tegevusi"
            },
            create: {
                english: "Develop innovative solution creation and synthesis projects",
                estonian: "Arenda innovaatiliste lahenduste loomist ja sünteesi projekte"
            }
        };

        const langKey = isEnglish ? 'english' : 'estonian';
        return suggestions[level]?.[langKey] || suggestions[level]?.english || level;
    }

    /**
     * Wait for ongoing analysis to complete
     */
    async waitForResult(cacheKey) {
        return new Promise((resolve) => {
            const checkResult = () => {
                if (this.cache.has(cacheKey)) {
                    resolve(this.cache.get(cacheKey));
                } else if (this.loadingStates.has(cacheKey)) {
                    setTimeout(checkResult, 100);
                } else {
                    // Analysis failed, resolve with null
                    resolve(null);
                }
            };
            checkResult();
        });
    }

    /**
     * Fallback to traditional scoring if enhanced analysis fails
     */
    fallbackToTraditional(ploCode, mloCode, mloData) {
        console.warn('Falling back to traditional analysis');
        
        // Use existing traditional scoring logic
        const traditionalScore = calculateContentBasedScore(ploCode, mloCode, mloData);
        
        return {
            score: traditionalScore,
            breakdown: {
                traditional: traditionalScore,
                semantic: 0,
                concept: 0
            },
            analysis: {},
            recommendations: [],
            isEnhanced: false
        };
    }

    /**
     * Helper methods to extract text content
     */
    getPLOText(ploCode) {
        // Extract PLO text from the current programme data
        const currentProgramme = document.getElementById('programme-selector').value;
        const plos = programmeData[currentProgramme]?.ilos || [];
        const plo = plos.find(p => p.plokood === ploCode);
        
        return currentLanguage === 'english' 
            ? (plo?.plosisuik || plo?.ilosisu || '')
            : (plo?.plosisuek || plo?.ilosisu || '');
    }

    getMLOText(mloData) {
        return currentLanguage === 'english'
            ? (mloData.mlosisuik || mloData.ilosisu || '')
            : (mloData.mlosisuek || mloData.ilosisu || '');
    }

    /**
     * Enhanced visualization for concept mapping
     */
    generateConceptVisualization(analysisData) {
        if (!analysisData.isEnhanced || !analysisData.analysis.extracted_concepts) {
            return '';
        }

        const concepts = analysisData.analysis.extracted_concepts;
        let visualization = '<div class="concept-visualization">';
        
        // Group concepts by type
        const conceptGroups = {};
        concepts.forEach(concept => {
            if (!conceptGroups[concept.type]) {
                conceptGroups[concept.type] = [];
            }
            conceptGroups[concept.type].push(concept);
        });

        // Create visual representation
        Object.entries(conceptGroups).forEach(([type, conceptList]) => {
            visualization += `
                <div class="concept-group">
                    <h5>${type.replace('_', ' ').toUpperCase()}</h5>
                    <div class="concept-items">
            `;
            
            conceptList.forEach(concept => {
                const bloomLevel = concept.attributes?.bloom_level || '';
                const bloomClass = bloomLevel ? ` bloom-${bloomLevel}` : '';
                
                visualization += `
                    <span class="concept-tag${bloomClass}" title="${JSON.stringify(concept.attributes)}">
                        ${concept.text}
                    </span>
                `;
            });
            
            visualization += '</div></div>';
        });

        visualization += '</div>';
        return visualization;
    }
}

// Initialize enhanced analyzer
const enhancedAnalyzer = new EnhancedAnalyzer();

// Override the existing getAlignmentScore function to use enhanced analysis
const originalGetAlignmentScore = window.getAlignmentScore;

window.getAlignmentScore = async function(ploCode, mloCode, mloData) {
    try {
        // Try enhanced analysis first
        const enhancedResult = await enhancedAnalyzer.getEnhancedAlignmentScore(ploCode, mloCode, mloData);
        
        if (enhancedResult && enhancedResult.isEnhanced) {
            // Store enhanced data for use in justifications
            window.enhancedAnalysisCache = window.enhancedAnalysisCache || {};
            window.enhancedAnalysisCache[`${ploCode}-${mloCode}`] = enhancedResult;
            
            return enhancedResult.score;
        }
    } catch (error) {
        console.warn('Enhanced analysis unavailable, using traditional scoring:', error);
    }
    
    // Fallback to original function
    return originalGetAlignmentScore ? originalGetAlignmentScore(ploCode, mloCode, mloData) : 3;
};

// Enhanced justification generation
function generateEnhancedJustification(ploCode, mloCode, score, language = 'english') {
    const cacheKey = `${ploCode}-${mloCode}`;
    const enhancedData = window.enhancedAnalysisCache?.[cacheKey];
    
    if (enhancedData && enhancedData.isEnhanced) {
        return enhancedAnalyzer.generateEnhancedJustification(score, enhancedData, language);
    }
    
    // Fallback to traditional justification
    return generateTraditionalJustification(score, language);
}

// Enhanced improvement suggestions
function generateEnhancedImprovements(ploCode, mloCode, score, language = 'english') {
    const cacheKey = `${ploCode}-${mloCode}`;
    const enhancedData = window.enhancedAnalysisCache?.[cacheKey];
    
    if (enhancedData && enhancedData.isEnhanced) {
        return enhancedAnalyzer.generateEnhancedImprovements(score, enhancedData, language);
    }
    
    return ''; // No improvements for traditional analysis
}

// Add CSS for enhanced visualizations
const enhancedStyles = `
<style>
.concept-visualization {
    margin: 10px 0;
    padding: 10px;
    background: #f8f9fa;
    border-radius: 6px;
    border-left: 4px solid #342b60;
}

.concept-group {
    margin-bottom: 15px;
}

.concept-group h5 {
    margin: 0 0 8px 0;
    color: #342b60;
    font-size: 0.9em;
    font-weight: bold;
}

.concept-items {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
}

.concept-tag {
    background: #e9ecef;
    color: #495057;
    padding: 3px 8px;
    border-radius: 12px;
    font-size: 0.8em;
    border: 1px solid #dee2e6;
}

.concept-tag.bloom-remember { background: #ffeaa7; color: #856404; }
.concept-tag.bloom-understand { background: #fd79a8; color: #7d1935; }
.concept-tag.bloom-apply { background: #fdcb6e; color: #8d5524; }
.concept-tag.bloom-analyze { background: #74b9ff; color: #2d3436; }
.concept-tag.bloom-evaluate { background: #a29bfe; color: #2d3436; }
.concept-tag.bloom-create { background: #00b894; color: #2d3436; }

.enhanced-analysis-indicator {
    display: inline-block;
    background: linear-gradient(45deg, #e4067e, #342b60);
    color: white;
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 0.7em;
    margin-left: 5px;
}
</style>
`;

// Inject enhanced styles
document.head.insertAdjacentHTML('beforeend', enhancedStyles);

console.log('✅ Enhanced PLO-MLO Analysis Frontend Integration Loaded');
