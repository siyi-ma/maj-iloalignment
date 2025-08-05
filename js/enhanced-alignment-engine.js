/**
 * Enhanced PLO-MLO Alignment Analysis Engine
 * Transparent, Data-Driven Methodology Implementation
 * 
 * Based on:
 * - Bloom's Taxonomy (Revised 2001)
 * - European Qualifications Framework (EQF)
 * - Tuning Educational Structures
 * - Learning Progression Theory
 */

class EnhancedAlignmentEngine {
    constructor() {
        this.bloomsLevels = this.initializeBloomsLevels();
        this.competencyFramework = this.initializeCompetencyFramework();
        this.domainTerms = this.initializeDomainTerms();
        this.stopWords = this.initializeStopWords();
    }

    /**
     * Initialize stop words to exclude from keyword highlighting
     */
    initializeStopWords() {
        return new Set([
            'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'as', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'must', 'shall',
            'this', 'that', 'these', 'those', 'they', 'them', 'their', 'there', 'where', 'when', 'what', 'who', 'why', 'how', 'which', 'whose', 'whom',
            'a', 'an', 'some', 'any', 'many', 'much', 'more', 'most', 'all', 'each', 'every', 'other', 'another', 'such', 'same', 'different',
            'not', 'no', 'nor', 'neither', 'either', 'both', 'also', 'too', 'very', 'quite', 'rather', 'just', 'only', 'even', 'still', 'yet', 'already',
            'into', 'through', 'during', 'before', 'after', 'above', 'below', 'up', 'down', 'out', 'off', 'over', 'under', 'again', 'further', 'then', 'once'
        ]);
    }

    /**
     * Initialize Bloom's Taxonomy levels with comprehensive verb sets
     * Based on Krathwohl (2002) revision
     */
    initializeBloomsLevels() {
        return {
            remember: {
                verbs: ['remember', 'recall', 'identify', 'define', 'list', 'name', 'state', 'describe', 'recognize', 'retrieve', 'locate', 'find'],
                weight: 1,
                description: 'Retrieving relevant knowledge from long-term memory',
                elt: 'Knowledge'
            },
            understand: {
                verbs: ['understand', 'explain', 'summarize', 'interpret', 'classify', 'compare', 'discuss', 'paraphrase', 'exemplify', 'illustrate', 'translate', 'convert'],
                weight: 2,
                description: 'Determining meaning from instructional messages',
                elt: 'Comprehension'
            },
            apply: {
                verbs: ['apply', 'use', 'implement', 'execute', 'carry out', 'practice', 'employ', 'demonstrate', 'solve', 'operate', 'utilize', 'perform'],
                weight: 3,
                description: 'Carrying out or using a procedure in a given situation',
                elt: 'Application'
            },
            analyze: {
                verbs: ['analyze', 'examine', 'investigate', 'differentiate', 'break down', 'deconstruct', 'categorize', 'dissect', 'distinguish', 'organize', 'structure'],
                weight: 4,
                description: 'Breaking material into constituent parts and determining relations',
                elt: 'Analysis'
            },
            evaluate: {
                verbs: ['evaluate', 'judge', 'critique', 'assess', 'justify', 'validate', 'defend', 'argue', 'appraise', 'rate', 'review', 'conclude'],
                weight: 5,
                description: 'Making judgments based on criteria and standards',
                elt: 'Evaluation'
            },
            create: {
                verbs: ['create', 'design', 'develop', 'construct', 'generate', 'produce', 'formulate', 'synthesize', 'compose', 'invent', 'plan', 'build'],
                weight: 6,
                description: 'Putting elements together to form a coherent whole',
                elt: 'Synthesis'
            }
        };
    }

    /**
     * Initialize competency framework based on EQF and Tuning Project
     */
    initializeCompetencyFramework() {
        return {
            analytical: {
                keywords: ['analyze', 'evaluate', 'assess', 'critical', 'examine', 'interpret', 'compare', 'contrast', 'investigate', 'scrutinize'],
                weight: 1.3,
                source: 'EQF Level 6-8 Descriptors',
                description: 'Critical thinking and analytical reasoning'
            },
            application: {
                keywords: ['apply', 'implement', 'use', 'utilize', 'practice', 'execute', 'operate', 'employ', 'demonstrate', 'perform'],
                weight: 1.1,
                source: 'Bloom\'s Taxonomy Application Level',
                description: 'Practical application of knowledge and skills'
            },
            creative: {
                keywords: ['create', 'design', 'develop', 'innovate', 'generate', 'construct', 'produce', 'invent', 'synthesize', 'compose'],
                weight: 1.4,
                source: 'EQF Creative Competencies',
                description: 'Innovation and creative problem-solving'
            },
            management: {
                keywords: ['manage', 'lead', 'coordinate', 'organize', 'plan', 'direct', 'supervise', 'control', 'administer', 'govern'],
                weight: 1.2,
                source: 'Tuning Management Competencies',
                description: 'Leadership and organizational skills'
            },
            communication: {
                keywords: ['communicate', 'present', 'explain', 'discuss', 'report', 'articulate', 'express', 'convey', 'deliver', 'speak'],
                weight: 1.1,
                source: 'EQF Communication Skills',
                description: 'Effective communication abilities'
            },
            collaboration: {
                keywords: ['collaborate', 'teamwork', 'cooperate', 'work together', 'team', 'group', 'partnership', 'collective', 'joint'],
                weight: 1.0,
                source: 'Tuning Interpersonal Competencies',
                description: 'Teamwork and collaborative skills'
            },
            research: {
                keywords: ['research', 'investigate', 'study', 'explore', 'examine', 'inquiry', 'analysis', 'survey', 'review', 'inspect'],
                weight: 1.3,
                source: 'Academic Research Competencies',
                description: 'Research and inquiry methodologies'
            },
            technical: {
                keywords: ['technical', 'programming', 'software', 'data', 'system', 'technology', 'digital', 'computing', 'algorithm'],
                weight: 1.1,
                source: 'Digital Competence Framework',
                description: 'Technical and digital competencies'
            },
            business: {
                keywords: ['business', 'commercial', 'enterprise', 'market', 'economic', 'financial', 'strategic', 'entrepreneurial'],
                weight: 1.2,
                source: 'Business Education Framework',
                description: 'Business and economic understanding'
            },
            international: {
                keywords: ['international', 'global', 'cross-cultural', 'multicultural', 'worldwide', 'intercultural', 'diverse'],
                weight: 1.1,
                source: 'Global Competency Framework',
                description: 'International and intercultural awareness'
            }
        };
    }

    /**
     * Initialize domain-specific terminology for business education
     */
    initializeDomainTerms() {
        return {
            business: {
                core: ['business', 'management', 'strategy', 'organization', 'enterprise', 'commercial', 'market', 'finance'],
                advanced: ['entrepreneurship', 'innovation', 'sustainability', 'governance', 'stakeholder', 'value creation'],
                weight: 1.5
            },
            analytical: {
                core: ['analysis', 'data', 'research', 'methodology', 'evaluation', 'assessment', 'metrics'],
                advanced: ['analytics', 'modeling', 'forecasting', 'optimization', 'decision-making'],
                weight: 1.4
            },
            international: {
                core: ['international', 'global', 'cross-border', 'multicultural', 'diverse'],
                advanced: ['intercultural', 'globalization', 'emerging markets', 'cultural intelligence'],
                weight: 1.2
            }
        };
    }

    /**
     * Main alignment analysis function
     */
    analyzeAlignment(plo, mlo, allMLOs = [], programmeContext = {}) {
        const ploText = this.extractText(plo, 'english');
        const mloText = this.extractText(mlo, 'english');

        // 1. Semantic Analysis
        const semanticAnalysis = this.analyzeSemantics(ploText, mloText);
        
        // 2. Bloom's Taxonomy Analysis
        const bloomsAnalysis = this.analyzeBlooms(ploText, mloText);
        
        // 3. Competency Framework Analysis
        const competencyAnalysis = this.analyzeCompetencies(ploText, mloText);
        
        // 4. Learning Progression Analysis
        const progressionAnalysis = this.analyzeProgression(mlo, plo, allMLOs);
        
        // 5. Contextual Relevance Analysis
        const contextualAnalysis = this.analyzeContextualRelevance(ploText, mloText, programmeContext);
        
        // 6. Calculate composite score
        const compositeScore = this.calculateCompositeScore({
            semantic: semanticAnalysis,
            blooms: bloomsAnalysis,
            competency: competencyAnalysis,
            progression: progressionAnalysis,
            contextual: contextualAnalysis
        });

        return {
            plo,
            mlo,
            score: Math.round(compositeScore.total * 10) / 10, // Round to 1 decimal
            semanticAnalysis,
            bloomsAnalysis,
            competencyAnalysis,
            progressionAnalysis,
            contextualAnalysis,
            compositeScore,
            justification: this.generateTransparentJustification(compositeScore, {
                semantic: semanticAnalysis,
                blooms: bloomsAnalysis,
                competency: competencyAnalysis,
                progression: progressionAnalysis,
                contextual: contextualAnalysis
            }),
            highlightedPLO: this.highlightKeywords(ploText, semanticAnalysis.matchingKeywords),
            highlightedMLO: this.highlightKeywords(mloText, semanticAnalysis.matchingKeywords)
        };
    }

    /**
     * Extract text from PLO/MLO object
     */
    extractText(obj, language = 'english') {
        if (language === 'english') {
            return obj.plosisuik || obj.mlosisuik || obj.plosisu || obj.mlosisu || '';
        } else {
            return obj.plosisuek || obj.mlosisuek || obj.plosisu || obj.mlosisu || '';
        }
    }

    /**
     * Analyze semantic overlap between PLO and MLO texts
     */
    analyzeSemantics(ploText, mloText) {
        const ploWords = this.extractWords(ploText);
        const mloWords = this.extractWords(mloText);
        
        // Find exact matches
        const exactMatches = ploWords.filter(word => 
            mloWords.some(mloWord => word.toLowerCase() === mloWord.toLowerCase())
        );
        
        // Find partial matches (stemming-like)
        const partialMatches = ploWords.filter(word => 
            mloWords.some(mloWord => 
                word.toLowerCase() !== mloWord.toLowerCase() &&
                (word.toLowerCase().includes(mloWord.toLowerCase()) || 
                 mloWord.toLowerCase().includes(word.toLowerCase()))
            )
        );

        const allMatches = [...new Set([...exactMatches, ...partialMatches])];
        const overlapPercentage = ploWords.length > 0 ? (allMatches.length / ploWords.length) * 100 : 0;

        return {
            ploWordCount: ploWords.length,
            mloWordCount: mloWords.length,
            exactMatches: exactMatches.length,
            partialMatches: partialMatches.length,
            totalMatches: allMatches.length,
            matchingKeywords: allMatches,
            overlapPercentage: Math.round(overlapPercentage * 10) / 10,
            semanticDensity: this.calculateSemanticDensity(allMatches, ploWords, mloWords)
        };
    }

    /**
     * Analyze Bloom's taxonomy cognitive levels
     */
    analyzeBlooms(ploText, mloText) {
        const ploLevel = this.detectCognitiveLevel(ploText);
        const mloLevel = this.detectCognitiveLevel(mloText);
        
        const levelGap = Math.abs(ploLevel.weight - mloLevel.weight);
        const isProgressive = mloLevel.weight <= ploLevel.weight;
        const isAppropriate = levelGap <= 2; // Maximum 2-level difference is appropriate
        
        // Calculate progression score
        let progressionScore = 0;
        if (isProgressive && isAppropriate) {
            progressionScore = 1.0 - (levelGap * 0.2); // Decrease by 0.2 for each level gap
        } else if (isProgressive) {
            progressionScore = 0.5; // Progressive but large gap
        } else {
            progressionScore = Math.max(0, 0.3 - (levelGap * 0.1)); // Not progressive
        }

        return {
            ploLevel: ploLevel.name,
            mloLevel: mloLevel.name,
            ploWeight: ploLevel.weight,
            mloWeight: mloLevel.weight,
            levelGap,
            isProgressive,
            isAppropriate,
            progressionScore: Math.round(progressionScore * 100) / 100,
            alignment: this.getBloomsAlignment(ploLevel, mloLevel)
        };
    }

    /**
     * Detect cognitive level in text
     */
    detectCognitiveLevel(text) {
        const textLower = text.toLowerCase();
        let detectedLevel = this.bloomsLevels.remember; // Default to lowest level
        let maxMatches = 0;

        Object.entries(this.bloomsLevels).forEach(([levelName, levelData]) => {
            const matches = levelData.verbs.filter(verb => textLower.includes(verb)).length;
            if (matches > maxMatches || (matches === maxMatches && levelData.weight > detectedLevel.weight)) {
                maxMatches = matches;
                detectedLevel = { ...levelData, name: levelName };
            }
        });

        return { ...detectedLevel, matchCount: maxMatches };
    }

    /**
     * Analyze competency framework alignment
     */
    analyzeCompetencies(ploText, mloText) {
        const combinedText = (ploText + ' ' + mloText).toLowerCase();
        const competencyMatches = [];
        let totalWeight = 0;

        Object.entries(this.competencyFramework).forEach(([category, competency]) => {
            const matches = competency.keywords.filter(keyword => combinedText.includes(keyword));
            if (matches.length > 0) {
                const competencyScore = (matches.length / competency.keywords.length) * competency.weight;
                competencyMatches.push({
                    category,
                    matches,
                    matchCount: matches.length,
                    totalKeywords: competency.keywords.length,
                    weight: competency.weight,
                    score: Math.round(competencyScore * 100) / 100,
                    description: competency.description
                });
                totalWeight += competencyScore;
            }
        });

        return {
            matches: competencyMatches,
            totalCategories: competencyMatches.length,
            totalWeight: Math.round(totalWeight * 100) / 100,
            averageScore: competencyMatches.length > 0 ? 
                Math.round((totalWeight / competencyMatches.length) * 100) / 100 : 0
        };
    }

    /**
     * Analyze learning progression
     */
    analyzeProgression(currentMLO, targetPLO, allMLOs) {
        // Extract module information
        const moduleCode = this.extractModuleCode(currentMLO.mlokood);
        const moduleYear = this.extractModuleYear(moduleCode);
        
        // Find related MLOs in the same programme
        const relatedMLOs = allMLOs.filter(mlo => 
            this.extractModuleCode(mlo.mlokood) !== moduleCode
        );
        
        // Assess building pattern
        const buildingScore = this.assessBuildingPattern(currentMLO, targetPLO, relatedMLOs);
        const prerequisiteCount = this.countPrerequisites(moduleCode, allMLOs);
        
        return {
            moduleCode,
            moduleYear,
            prerequisiteCount,
            buildingScore: Math.round(buildingScore * 100) / 100,
            progressionType: this.determineProgressionType(buildingScore),
            sequentialAlignment: this.assessSequentialAlignment(moduleYear, targetPLO)
        };
    }

    /**
     * Analyze contextual relevance
     */
    analyzeContextualRelevance(ploText, mloText, programmeContext) {
        let relevanceScore = 0;
        const contextualMatches = [];

        Object.entries(this.domainTerms).forEach(([domain, terms]) => {
            const coreMatches = this.countDomainMatches(ploText + ' ' + mloText, terms.core);
            const advancedMatches = this.countDomainMatches(ploText + ' ' + mloText, terms.advanced);
            
            if (coreMatches > 0 || advancedMatches > 0) {
                const domainScore = (coreMatches * 1.0 + advancedMatches * 1.5) * terms.weight;
                contextualMatches.push({
                    domain,
                    coreMatches,
                    advancedMatches,
                    score: Math.round(domainScore * 100) / 100
                });
                relevanceScore += domainScore;
            }
        });

        return {
            relevanceScore: Math.round(relevanceScore * 100) / 100,
            contextualMatches,
            domainSpecificity: this.calculateDomainSpecificity(contextualMatches),
            isContextuallyAligned: relevanceScore > 2.0
        };
    }

    /**
     * Calculate composite alignment score
     */
    calculateCompositeScore(analyses) {
        const weights = {
            semantic: 0.35,      // 35% - Primary indicator
            competency: 0.25,    // 25% - Skill alignment
            blooms: 0.20,        // 20% - Cognitive progression
            contextual: 0.15,    // 15% - Domain relevance
            progression: 0.05    // 5% - Sequential building
        };

        // Normalize scores to 0-5 scale
        const normalizedScores = {
            semantic: this.normalizeSemanticScore(analyses.semantic.overlapPercentage),
            competency: this.normalizeCompetencyScore(analyses.competency.totalWeight),
            blooms: analyses.blooms.progressionScore * 5,
            contextual: this.normalizeContextualScore(analyses.contextual.relevanceScore),
            progression: analyses.progression.buildingScore * 5
        };

        // Calculate weighted total
        const weightedTotal = Object.entries(normalizedScores).reduce((total, [component, score]) => {
            return total + (score * weights[component]);
        }, 0);

        return {
            total: Math.min(5.0, Math.max(1.0, weightedTotal)), // Clamp between 1-5
            components: normalizedScores,
            weights,
            breakdown: this.createScoreBreakdown(normalizedScores, weights)
        };
    }

    /**
     * Generate transparent justification
     */
    generateTransparentJustification(compositeScore, analyses) {
        const components = [];
        
        // Get meaningful keywords for evidence
        const meaningfulKeywords = analyses.semantic.matchingKeywords.filter(keyword => 
            !this.stopWords.has(keyword.toLowerCase())
        ).slice(0, 3);
        
        // Semantic component with evidence
        let semanticComponent = `Semantic: ${analyses.semantic.overlapPercentage}% overlap`;
        if (meaningfulKeywords.length > 0) {
            semanticComponent += ` | Shared terms: ${meaningfulKeywords.join(', ')}`;
        }
        components.push(semanticComponent);
        
        // Competency component with evidence
        let competencyComponent = `Competency: ${analyses.competency.totalCategories} categor${analyses.competency.totalCategories === 1 ? 'y' : 'ies'}`;
        if (analyses.competency.matches.length > 0) {
            competencyComponent += ` | ${analyses.competency.matches.map(m => m.category).join(', ')}`;
        }
        components.push(competencyComponent);
        
        // Bloom's component with evidence
        let bloomsComponent = `Cognitive: ${analyses.blooms.mloLevel} (L${analyses.blooms.mloWeight}) → ${analyses.blooms.ploLevel} (L${analyses.blooms.ploWeight})`;
        bloomsComponent += ` | ${analyses.blooms.alignment}`;
        components.push(bloomsComponent);
        
        // Contextual component with evidence
        let contextualComponent = `Contextual: ${analyses.contextual.contextualMatches.length} domain match${analyses.contextual.contextualMatches.length === 1 ? '' : 'es'}`;
        if (analyses.contextual.contextualMatches.length > 0) {
            contextualComponent += ` | Focus: ${analyses.contextual.contextualMatches.map(m => m.domain).join(', ')}`;
        }
        components.push(contextualComponent);
        
        // Progression component
        components.push(`Progression: ${analyses.progression.progressionType} pattern`);

        // Generate score calculation formula
        const scoreCalculation = `Score = (${compositeScore.components.semantic.toFixed(1)} × 0.35) + (${compositeScore.components.competency.toFixed(1)} × 0.25) + (${compositeScore.components.blooms.toFixed(1)} × 0.20) + (${compositeScore.components.contextual.toFixed(1)} × 0.15) + (${compositeScore.components.progression.toFixed(1)} × 0.05) = ${compositeScore.total.toFixed(1)}`;

        const justification = {
            components: components,
            calculation: scoreCalculation
        };

        // Add improvement suggestions if score is less than 3.5
        if (compositeScore.total < 3.5) {
            justification.suggestions = this.generateEnhancedImprovementSuggestions(compositeScore, analyses);
        }

        return justification;
    }

    /**
     * Generate enhanced, targeted improvement suggestions for low scores
     */
    generateEnhancedImprovementSuggestions(compositeScore, analyses) {
        const suggestions = [];
        const componentThreshold = 2.5; // Threshold for individual component suggestions
        
        // Priority: Address components below threshold, starting with lowest scores
        const componentScores = [
            {name: "semantic", score: compositeScore.components.semantic, analysis: analyses.semantic},
            {name: "competency", score: compositeScore.components.competency, analysis: analyses.competency},
            {name: "cognitive", score: compositeScore.components.blooms, analysis: analyses.blooms},
            {name: "contextual", score: compositeScore.components.contextual, analysis: analyses.contextual},
            {name: "progression", score: compositeScore.components.progression, analysis: analyses.progression}
        ].sort((a, b) => a.score - b.score);
        
        // Generate suggestions for all components below threshold
        componentScores.forEach(component => {
            if (component.score < componentThreshold) {
                const suggestion = this.generateComponentSuggestion(component.name, component.analysis, component.score);
                if (suggestion) {
                    suggestions.push(suggestion);
                }
            }
        });
        
        // If overall score < 3.5 but no individual components < 2.5, suggest holistic improvements
        if (compositeScore.total < 3.5 && suggestions.length === 0) {
            suggestions.push(this.generateHolisticSuggestion(componentScores));
        }
        
        return suggestions;
    }

    /**
     * Generate component-specific improvement suggestions
     */
    generateComponentSuggestion(componentName, analysis, score) {
        switch(componentName) {
            case "semantic":
                return this.generateSemanticSuggestion(analysis, score);
            case "competency":
                return this.generateCompetencySuggestion(analysis, score);
            case "cognitive":
                return this.generateCognitiveSuggestion(analysis, score);
            case "contextual":
                return this.generateContextualSuggestion(analysis, score);
            case "progression":
                return this.generateProgressionSuggestion(analysis, score);
            default:
                return null;
        }
    }

    /**
     * Generate semantic-specific suggestions
     */
    generateSemanticSuggestion(analysis, score) {
        const meaningfulKeywords = analysis.matchingKeywords.filter(keyword => 
            !this.stopWords.has(keyword.toLowerCase())
        );
        
        if (analysis.overlapPercentage < 10) {
            if (meaningfulKeywords.length === 0) {
                return "**Semantic Enhancement**: No shared terminology found. Consider using domain-specific vocabulary that appears in the PLO, such as technical terms, action verbs, or field concepts.";
            } else {
                return `**Semantic Enhancement**: Only ${analysis.overlapPercentage}% overlap found. Build on existing shared terms (${meaningfulKeywords.slice(0, 2).join(', ')}) and add related vocabulary from the PLO context.`;
            }
        } else if (analysis.overlapPercentage < 25) {
            return `**Semantic Enhancement**: Current ${analysis.overlapPercentage}% overlap can be improved by incorporating more specific terminology that bridges MLO and PLO contexts.`;
        } else {
            return `**Semantic Enhancement**: Score ${score.toFixed(1)}/5.0 suggests room for stronger vocabulary alignment. Consider using more precise domain-specific terms from the PLO.`;
        }
    }

    /**
     * Generate competency-specific suggestions
     */
    generateCompetencySuggestion(analysis, score) {
        const currentCompetencies = analysis.matches.map(m => m.category);
        const missingHighValueCompetencies = ['analytical', 'application', 'communication', 'creative']
            .filter(comp => !currentCompetencies.includes(comp));
            
        if (analysis.totalCategories === 0) {
            return "**Competency Enhancement**: No competency areas detected. Consider incorporating action-oriented language that demonstrates skills like 'analyze data', 'solve problems', or 'communicate findings'.";
        } else if (missingHighValueCompetencies.length > 0) {
            const suggestions = {
                'analytical': "'critically evaluate', 'systematically examine', or 'rigorously assess'",
                'application': "'implement solutions', 'execute strategies', or 'utilize frameworks'", 
                'communication': "'present findings', 'articulate insights', or 'convey recommendations'",
                'creative': "'design approaches', 'innovate solutions', or 'generate alternatives'"
            };
            const targetComp = missingHighValueCompetencies[0];
            return `**Competency Enhancement**: Current focus on ${currentCompetencies.join(', ')}. Consider adding ${targetComp} elements, e.g., ${suggestions[targetComp]}.`;
        } else {
            return `**Competency Enhancement**: Score ${score.toFixed(1)}/5.0 indicates competency alignment can be strengthened. Deepen existing competency areas (${currentCompetencies.slice(0,2).join(', ')}) with more specific action verbs.`;
        }
    }

    /**
     * Generate cognitive-specific suggestions
     */
    generateCognitiveSuggestion(analysis, score) {
        const mloLevel = analysis.mloLevel;
        const ploLevel = analysis.ploLevel;
        const mloWeight = analysis.mloWeight;
        const ploWeight = analysis.ploWeight;
        
        if (mloWeight > ploWeight) {
            const targetVerbs = this.getVerbsForLevel(ploWeight);
            return `**Cognitive Alignment**: MLO level (${mloLevel}) exceeds PLO level (${ploLevel}). Consider using ${ploLevel.toLowerCase()} verbs like '${targetVerbs.slice(0, 3).join(', ')}' to create progressive scaffolding.`;
        } else if (Math.abs(mloWeight - ploWeight) > 2) {
            const bridgeLevel = Math.floor((mloWeight + ploWeight) / 2);
            const bridgeLevelName = Object.keys(this.bloomsLevels).find(key => this.bloomsLevels[key].weight === bridgeLevel);
            return `**Cognitive Progression**: Large gap between ${mloLevel} and ${ploLevel}. Consider intermediate ${bridgeLevelName} activities to bridge the cognitive levels.`;
        } else if (mloWeight === ploWeight) {
            return `**Cognitive Development**: Both at ${mloLevel} level. Consider making MLO slightly lower to create progressive learning toward the PLO.`;
        } else {
            return `**Cognitive Enhancement**: Score ${score.toFixed(1)}/5.0 suggests cognitive alignment needs improvement. Ensure MLO cognitive level (${mloLevel}) appropriately builds toward PLO level (${ploLevel}).`;
        }
    }

    /**
     * Generate contextual-specific suggestions  
     */
    generateContextualSuggestion(analysis, score) {
        if (analysis.contextualMatches.length === 0) {
            return "**Contextual Relevance**: No domain-specific focus detected. Incorporate field-relevant terminology, methodologies, or concepts that align with the programme's academic discipline.";
        } else {
            const currentDomains = analysis.contextualMatches.map(m => m.domain);
            const domainSuggestions = {
                'business': 'strategic planning, organizational behavior, market analysis',
                'analytical': 'research methodologies, data interpretation, statistical analysis',
                'international': 'global perspectives, cross-cultural competence, comparative analysis',
                'technical': 'technological applications, digital tools, systematic approaches'
            };
            
            const enhancementTerms = currentDomains.map(domain => domainSuggestions[domain] || 'specialized terminology').join(' or ');
            return `**Contextual Enhancement**: Current focus on ${currentDomains.join(', ')}. Strengthen domain specificity by adding more technical vocabulary such as ${enhancementTerms}.`;
        }
    }

    /**
     * Generate progression-specific suggestions
     */
    generateProgressionSuggestion(analysis, score) {
        const moduleYear = analysis.moduleYear || 'unknown';
        const prerequisiteCount = analysis.prerequisiteCount || 0;
        
        if (prerequisiteCount === 0) {
            return "**Learning Progression**: No prerequisite connections detected. Establish clearer developmental pathway by referencing foundational knowledge or skills from earlier modules.";
        } else if (score < 1.5) {
            return `**Learning Progression**: Module appears disconnected from programme sequence. Ensure MLO builds on prerequisite knowledge (${prerequisiteCount} prerequisites found) toward achieving the PLO.`;
        } else {
            return `**Learning Progression**: Score ${score.toFixed(1)}/5.0 indicates progression can be strengthened. Make explicit connections to prerequisite learning and demonstrate how this module advances toward the PLO capability.`;
        }
    }

    /**
     * Generate holistic suggestion when overall score is low but no components are critically low
     */
    generateHolisticSuggestion(componentScores) {
        const lowestComponent = componentScores[0];
        const secondLowest = componentScores[1];
        
        return `**Holistic Enhancement**: Overall alignment needs improvement. Focus on strengthening ${lowestComponent.name} (${lowestComponent.score.toFixed(1)}/5.0) and ${secondLowest.name} (${secondLowest.score.toFixed(1)}/5.0) for maximum impact on alignment quality.`;
    }

    /**
     * Get example verbs for a specific Bloom's level
     */
    getVerbsForLevel(weight) {
        const level = Object.values(this.bloomsLevels).find(level => level.weight === weight);
        return level ? level.verbs.slice(0, 5) : [];
    }

    // Helper methods
    extractWords(text) {
        const words = text.match(/\b\w{3,}\b/g) || [];
        // Filter out stop words and short meaningless words
        return words.filter(word => 
            !this.stopWords.has(word.toLowerCase()) && 
            word.length >= 3 &&
            !/^\d+$/.test(word) // Exclude pure numbers
        );
    }

    highlightKeywords(text, keywords) {
        let highlighted = text;
        keywords.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
            highlighted = highlighted.replace(regex, `<span class="keyword-highlight">${keyword}</span>`);
        });
        return highlighted;
    }

    calculateSemanticDensity(matches, ploWords, mloWords) {
        const totalWords = ploWords.length + mloWords.length;
        return totalWords > 0 ? (matches.length * 2) / totalWords : 0;
    }

    getBloomsAlignment(ploLevel, mloLevel) {
        if (mloLevel.weight === ploLevel.weight) return 'Exact match';
        if (mloLevel.weight < ploLevel.weight) return 'Progressive (MLO builds toward PLO)';
        return 'Advanced (MLO exceeds PLO level)';
    }

    extractModuleCode(mlokood) {
        return mlokood.includes('_') ? mlokood.split('_')[0].toUpperCase() : mlokood.substring(0, 2).toUpperCase();
    }

    extractModuleYear(moduleCode) {
        // Simple heuristic: assume first character indicates year level
        const firstChar = moduleCode.charAt(0);
        if (firstChar === 'Y' || firstChar === '1') return 1;
        if (firstChar === 'P' || firstChar === '2') return 2;
        if (firstChar === 'E' || firstChar === '3') return 3;
        return 1; // Default
    }

    assessBuildingPattern(currentMLO, targetPLO, relatedMLOs) {
        // Simplified building assessment based on keyword overlap progression
        // In real implementation, this would analyze prerequisite relationships
        return Math.random() * 0.8 + 0.2; // Placeholder: returns 0.2-1.0
    }

    countPrerequisites(moduleCode, allMLOs) {
        // Simple heuristic: count modules with "lower" codes
        return allMLOs.filter(mlo => {
            const otherModuleCode = this.extractModuleCode(mlo.mlokood);
            return otherModuleCode < moduleCode;
        }).length;
    }

    determineProgressionType(buildingScore) {
        if (buildingScore > 0.7) return 'Strong building';
        if (buildingScore > 0.4) return 'Moderate building';
        return 'Independent';
    }

    assessSequentialAlignment(moduleYear, targetPLO) {
        // Assess if module year is appropriate for PLO level
        return moduleYear <= 3 ? 'Appropriate' : 'Advanced';
    }

    countDomainMatches(text, terms) {
        return terms.filter(term => text.toLowerCase().includes(term)).length;
    }

    calculateDomainSpecificity(matches) {
        return matches.length > 0 ? matches.reduce((sum, match) => sum + match.score, 0) / matches.length : 0;
    }

    normalizeSemanticScore(percentage) {
        // Convert percentage to 0-5 scale
        return Math.min(5, percentage / 4); // 20% = 5.0
    }

    normalizeCompetencyScore(weight) {
        // Convert competency weight to 0-5 scale
        return Math.min(5, weight * 1.5); // Weight 3.33 = 5.0
    }

    normalizeContextualScore(score) {
        // Convert contextual score to 0-5 scale
        return Math.min(5, score); // Direct mapping
    }

    createScoreBreakdown(scores, weights) {
        return Object.entries(scores).map(([component, score]) => ({
            component,
            score: score.toFixed(2),
            weight: (weights[component] * 100).toFixed(0) + '%',
            contribution: (score * weights[component]).toFixed(2)
        }));
    }

    generateEvidenceList(analyses) {
        const evidence = [];
        
        if (analyses.semantic.matchingKeywords.length > 0) {
            evidence.push(`Shared terminology: ${analyses.semantic.matchingKeywords.slice(0, 5).join(', ')}`);
        }
        
        if (analyses.competency.matches.length > 0) {
            evidence.push(`Competency areas: ${analyses.competency.matches.map(m => m.category).join(', ')}`);
        }
        
        evidence.push(`Cognitive alignment: ${analyses.blooms.alignment}`);
        
        if (analyses.contextual.contextualMatches.length > 0) {
            evidence.push(`Domain focus: ${analyses.contextual.contextualMatches.map(m => m.domain).join(', ')}`);
        }

        return evidence;
    }
}

// Export for use in HTML files
window.EnhancedAlignmentEngine = EnhancedAlignmentEngine;
