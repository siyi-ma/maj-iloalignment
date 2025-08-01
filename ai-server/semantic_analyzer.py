#!/usr/bin/env python3
"""
Advanced Semantic Analysis for Learning Outcomes
Uses sentence transformers for true semantic understanding
"""

import re
import logging
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass
from enum import Enum
import json

# Try to import advanced NLP libraries
try:
    from sentence_transformers import SentenceTransformer
    import numpy as np
    from sklearn.metrics.pairwise import cosine_similarity
    ADVANCED_NLP_AVAILABLE = True
except ImportError:
    ADVANCED_NLP_AVAILABLE = False
    print("Advanced NLP libraries not available. Install with: pip install sentence-transformers scikit-learn")

@dataclass
class SemanticAnalysisResult:
    """Result of semantic analysis between two learning outcomes"""
    semantic_similarity: float  # 0-1 similarity score
    conceptual_alignment: float  # 0-1 concept alignment
    cognitive_coherence: float   # 0-1 Bloom's level coherence
    enhanced_score: float        # 1-5 final score
    confidence: float           # 0-1 confidence in analysis
    reasoning: str              # Detailed explanation
    suggestions: List[str]      # Improvement suggestions
    key_concepts: List[str]     # Identified concepts
    missing_concepts: List[str] # Concepts in PLO but not MLO

class BloomLevel(Enum):
    """Bloom's Taxonomy cognitive levels"""
    REMEMBER = 1
    UNDERSTAND = 2
    APPLY = 3
    ANALYZE = 4
    EVALUATE = 5
    CREATE = 6

class ConceptType(Enum):
    """Types of educational concepts"""
    SKILL = "skill"
    KNOWLEDGE = "knowledge"
    COMPETENCY = "competency"
    METHOD = "method"
    ASSESSMENT = "assessment"
    DOMAIN = "domain"

@dataclass
class EducationalConcept:
    """Represents an educational concept with metadata"""
    name: str
    type: ConceptType
    bloom_level: BloomLevel
    weight: float
    synonyms: List[str]
    related_concepts: List[str]

class AdvancedSemanticAnalyzer:
    """Advanced semantic analyzer using sentence transformers"""
    
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        
        # Load sentence transformer model if available
        if ADVANCED_NLP_AVAILABLE:
            try:
                # Use a model that's good for educational content
                self.model = SentenceTransformer('all-MiniLM-L6-v2')
                self.logger.info("Loaded sentence transformer model successfully")
            except Exception as e:
                self.logger.warning(f"Failed to load sentence transformer: {e}")
                self.model = None
        else:
            self.model = None
            
        # Initialize educational concept knowledge base
        self._init_educational_concepts()
        self._init_bloom_patterns()
        
    def _init_educational_concepts(self):
        """Initialize comprehensive educational concept mappings"""
        self.educational_concepts = {
            # Analytical concepts
            "analysis": EducationalConcept(
                name="analysis",
                type=ConceptType.SKILL,
                bloom_level=BloomLevel.ANALYZE,
                weight=0.9,
                synonyms=["analyze", "analytical", "examination", "investigation", "breakdown"],
                related_concepts=["evaluation", "critical thinking", "problem solving"]
            ),
            
            # Sustainability concepts
            "sustainability": EducationalConcept(
                name="sustainability",
                type=ConceptType.DOMAIN,
                bloom_level=BloomLevel.APPLY,
                weight=0.9,
                synonyms=["sustainable", "environmental", "green", "eco-friendly"],
                related_concepts=["lifecycle assessment", "environmental impact", "resource management"]
            ),
            
            "lifecycle_assessment": EducationalConcept(
                name="lifecycle assessment",
                type=ConceptType.METHOD,
                bloom_level=BloomLevel.ANALYZE,
                weight=0.95,
                synonyms=["lca", "life cycle analysis", "lifecycle analysis"],
                related_concepts=["sustainability", "environmental assessment", "impact analysis"]
            ),
            
            # Business concepts
            "management": EducationalConcept(
                name="management",
                type=ConceptType.COMPETENCY,
                bloom_level=BloomLevel.APPLY,
                weight=0.8,
                synonyms=["manage", "organize", "coordinate", "lead", "direct"],
                related_concepts=["leadership", "planning", "strategy"]
            ),
            
            "strategy": EducationalConcept(
                name="strategy",
                type=ConceptType.KNOWLEDGE,
                bloom_level=BloomLevel.CREATE,
                weight=0.85,
                synonyms=["strategic", "planning", "approach", "methodology"],
                related_concepts=["management", "planning", "decision making"]
            ),
            
            # Assessment concepts
            "evaluation": EducationalConcept(
                name="evaluation",
                type=ConceptType.ASSESSMENT,
                bloom_level=BloomLevel.EVALUATE,
                weight=0.9,
                synonyms=["evaluate", "assess", "appraise", "critique", "judge"],
                related_concepts=["analysis", "critical thinking", "assessment"]
            ),
            
            # Technical concepts
            "design": EducationalConcept(
                name="design",
                type=ConceptType.SKILL,
                bloom_level=BloomLevel.CREATE,
                weight=0.85,
                synonyms=["create", "develop", "construct", "build", "formulate"],
                related_concepts=["innovation", "creativity", "problem solving"]
            ),
            
            "innovation": EducationalConcept(
                name="innovation",
                type=ConceptType.COMPETENCY,
                bloom_level=BloomLevel.CREATE,
                weight=0.9,
                synonyms=["innovative", "creative", "novel", "breakthrough"],
                related_concepts=["design", "creativity", "entrepreneurship"]
            ),
            
            # Communication concepts
            "communication": EducationalConcept(
                name="communication",
                type=ConceptType.SKILL,
                bloom_level=BloomLevel.APPLY,
                weight=0.8,
                synonyms=["communicate", "present", "express", "articulate", "convey"],
                related_concepts=["presentation", "teamwork", "collaboration"]
            ),
            
            # Research concepts
            "research": EducationalConcept(
                name="research",
                type=ConceptType.METHOD,
                bloom_level=BloomLevel.ANALYZE,
                weight=0.85,
                synonyms=["investigate", "study", "explore", "inquiry", "examination"],
                related_concepts=["analysis", "methodology", "data collection"]
            )
        }
        
    def _init_bloom_patterns(self):
        """Initialize Bloom's taxonomy detection patterns"""
        self.bloom_patterns = {
            BloomLevel.REMEMBER: [
                r'\b(remember|recall|recognize|identify|define|list|name|state|describe)\b',
                r'\b(basic|fundamental|elementary|simple)\b',
                r'\b(knowledge|facts|information|data)\b'
            ],
            BloomLevel.UNDERSTAND: [
                r'\b(understand|comprehend|explain|interpret|summarize|paraphrase)\b',
                r'\b(meaning|concept|idea|principle)\b',
                r'\b(illustrate|demonstrate|show)\b'
            ],
            BloomLevel.APPLY: [
                r'\b(apply|use|implement|execute|carry out|perform)\b',
                r'\b(practical|practice|hands-on|real-world)\b',
                r'\b(solve|calculate|compute|operate)\b'
            ],
            BloomLevel.ANALYZE: [
                r'\b(analyze|analyse|examine|investigate|compare|contrast)\b',
                r'\b(breakdown|deconstruct|dissect|separate)\b',
                r'\b(relationships|patterns|structure|organization)\b'
            ],
            BloomLevel.EVALUATE: [
                r'\b(evaluate|assess|critique|judge|justify|defend)\b',
                r'\b(quality|value|worth|effectiveness|validity)\b',
                r'\b(criteria|standards|benchmarks)\b'
            ],
            BloomLevel.CREATE: [
                r'\b(create|design|develop|generate|produce|construct)\b',
                r'\b(original|new|innovative|novel)\b',
                r'\b(synthesize|combine|integrate|formulate)\b'
            ]
        }

    def analyze_semantic_similarity(self, plo_text: str, mlo_text: str) -> float:
        """Calculate true semantic similarity using sentence embeddings"""
        if not self.model:
            # Fallback to keyword-based similarity
            return self._fallback_similarity(plo_text, mlo_text)
            
        try:
            # Get sentence embeddings
            plo_embedding = self.model.encode([plo_text])
            mlo_embedding = self.model.encode([mlo_text])
            
            # Calculate cosine similarity
            similarity = cosine_similarity(plo_embedding, mlo_embedding)[0][0]
            
            # Convert to 0-1 range and apply educational context adjustment
            adjusted_similarity = max(0, min(1, similarity))
            
            self.logger.debug(f"Semantic similarity: {adjusted_similarity:.3f}")
            return adjusted_similarity
            
        except Exception as e:
            self.logger.warning(f"Semantic similarity calculation failed: {e}")
            return self._fallback_similarity(plo_text, mlo_text)
    
    def _fallback_similarity(self, text1: str, text2: str) -> float:
        """Fallback similarity calculation using advanced keyword matching"""
        # Normalize texts
        text1_clean = self._normalize_text(text1)
        text2_clean = self._normalize_text(text2)
        
        # Extract concept-aware keywords
        concepts1 = self._extract_educational_concepts(text1_clean)
        concepts2 = self._extract_educational_concepts(text2_clean)
        
        if not concepts1 or not concepts2:
            return 0.0
            
        # Calculate weighted concept overlap
        common_concepts = set(concepts1.keys()) & set(concepts2.keys())
        
        if not common_concepts:
            return 0.0
            
        # Weight by concept importance
        similarity_score = 0.0
        total_weight = 0.0
        
        for concept in common_concepts:
            weight = self.educational_concepts.get(concept, 
                    EducationalConcept("unknown", ConceptType.KNOWLEDGE, BloomLevel.UNDERSTAND, 0.5, [], [])).weight
            similarity_score += weight
            total_weight += weight
            
        # Add bonus for related concepts
        for c1 in concepts1:
            for c2 in concepts2:
                if c1 != c2 and c1 in self.educational_concepts and c2 in self.educational_concepts:
                    if c2 in self.educational_concepts[c1].related_concepts:
                        similarity_score += 0.3
                        total_weight += 0.3
        
        return min(1.0, similarity_score / max(total_weight, 1.0))

    def analyze_conceptual_alignment(self, plo_text: str, mlo_text: str) -> Tuple[float, List[str], List[str]]:
        """Analyze conceptual alignment between PLO and MLO"""
        plo_concepts = self._extract_educational_concepts(plo_text)
        mlo_concepts = self._extract_educational_concepts(mlo_text)
        
        # Find aligned concepts
        aligned_concepts = []
        missing_concepts = []
        
        alignment_score = 0.0
        total_plo_weight = 0.0
        
        for concept, confidence in plo_concepts.items():
            concept_weight = self.educational_concepts.get(concept, 
                EducationalConcept("unknown", ConceptType.KNOWLEDGE, BloomLevel.UNDERSTAND, 0.5, [], [])).weight
            total_plo_weight += concept_weight
            
            if concept in mlo_concepts:
                # Direct concept match
                aligned_concepts.append(concept)
                alignment_score += concept_weight * min(confidence, mlo_concepts[concept])
            else:
                # Check for related concepts
                concept_obj = self.educational_concepts.get(concept)
                if concept_obj:
                    related_found = False
                    for related in concept_obj.related_concepts:
                        if related in mlo_concepts:
                            aligned_concepts.append(f"{concept} (via {related})")
                            alignment_score += concept_weight * 0.7 * mlo_concepts[related]
                            related_found = True
                            break
                    
                    if not related_found:
                        missing_concepts.append(concept)
                else:
                    missing_concepts.append(concept)
        
        # Normalize alignment score
        if total_plo_weight > 0:
            alignment_score = alignment_score / total_plo_weight
        
        return min(1.0, alignment_score), aligned_concepts, missing_concepts

    def analyze_cognitive_coherence(self, plo_text: str, mlo_text: str) -> Tuple[float, BloomLevel, BloomLevel]:
        """Analyze cognitive level coherence using Bloom's taxonomy"""
        plo_bloom = self._detect_bloom_level(plo_text)
        mlo_bloom = self._detect_bloom_level(mlo_text)
        
        # Calculate coherence based on level appropriateness
        level_diff = abs(plo_bloom.value - mlo_bloom.value)
        
        if level_diff == 0:
            coherence = 1.0  # Perfect match
        elif level_diff == 1:
            coherence = 0.8  # Close match
        elif level_diff == 2:
            coherence = 0.6  # Moderate gap
        else:
            coherence = 0.3  # Large gap
            
        # Bonus if MLO meets or exceeds PLO level
        if mlo_bloom.value >= plo_bloom.value:
            coherence = min(1.0, coherence + 0.1)
        
        return coherence, plo_bloom, mlo_bloom

    def _detect_bloom_level(self, text: str) -> BloomLevel:
        """Detect Bloom's taxonomy level from text"""
        text_lower = text.lower()
        level_scores = {level: 0 for level in BloomLevel}
        
        for level, patterns in self.bloom_patterns.items():
            for pattern in patterns:
                matches = len(re.findall(pattern, text_lower))
                level_scores[level] += matches
        
        # Find highest scoring level
        if any(level_scores.values()):
            detected_level = max(level_scores.items(), key=lambda x: x[1])[0]
        else:
            # Default to UNDERSTAND if no clear indicators
            detected_level = BloomLevel.UNDERSTAND
            
        return detected_level

    def _extract_educational_concepts(self, text: str) -> Dict[str, float]:
        """Extract educational concepts with confidence scores"""
        text_lower = self._normalize_text(text)
        found_concepts = {}
        
        for concept_name, concept_obj in self.educational_concepts.items():
            confidence = 0.0
            
            # Check for direct concept name
            if concept_name in text_lower:
                confidence = 1.0
            else:
                # Check synonyms
                for synonym in concept_obj.synonyms:
                    if synonym in text_lower:
                        confidence = max(confidence, 0.8)
                        
            # Check for partial matches and context
            if confidence == 0:
                words = text_lower.split()
                for word in words:
                    if word in concept_name or concept_name in word:
                        confidence = max(confidence, 0.6)
                    for synonym in concept_obj.synonyms:
                        if word in synonym or synonym in word:
                            confidence = max(confidence, 0.5)
            
            if confidence > 0:
                found_concepts[concept_name] = confidence
                
        return found_concepts

    def _normalize_text(self, text: str) -> str:
        """Normalize text for analysis"""
        # Convert to lowercase
        text = text.lower()
        
        # Remove extra whitespace and punctuation
        text = re.sub(r'[^\w\s]', ' ', text)
        text = re.sub(r'\s+', ' ', text)
        
        return text.strip()

    def generate_enhancement_suggestions(self, plo_text: str, mlo_text: str, 
                                       aligned_concepts: List[str], missing_concepts: List[str],
                                       plo_bloom: BloomLevel, mlo_bloom: BloomLevel) -> List[str]:
        """Generate specific improvement suggestions"""
        suggestions = []
        
        # Cognitive level suggestions
        if plo_bloom.value > mlo_bloom.value + 1:
            suggestions.append(f"🎯 Elevate cognitive level: MLO should target {plo_bloom.name} level thinking - add {', '.join(self.bloom_patterns[plo_bloom][:2])}")
        elif plo_bloom.value < mlo_bloom.value:
            suggestions.append(f"⚠️ MLO cognitive level ({mlo_bloom.name}) exceeds PLO expectation ({plo_bloom.name}) - ensure appropriate scaffolding")
        
        # Missing concept suggestions
        if missing_concepts:
            high_priority = [concept for concept in missing_concepts 
                           if self.educational_concepts.get(concept, 
                              EducationalConcept("", ConceptType.KNOWLEDGE, BloomLevel.UNDERSTAND, 0.5, [], [])).weight > 0.8]
            
            if high_priority:
                suggestions.append(f"🔍 Critical concepts missing: Add explicit mention of {', '.join(high_priority[:3])}")
            
            # Suggest related concepts that could bridge gaps
            for missing in missing_concepts[:2]:
                concept_obj = self.educational_concepts.get(missing)
                if concept_obj and concept_obj.related_concepts:
                    suggestions.append(f"🔗 Bridge to {missing}: Consider incorporating {', '.join(concept_obj.related_concepts[:2])}")
        
        # Assessment alignment suggestions
        assessment_concepts = ["evaluation", "assessment", "analysis"]
        plo_has_assessment = any(concept in plo_text.lower() for concept in assessment_concepts)
        mlo_has_assessment = any(concept in mlo_text.lower() for concept in assessment_concepts)
        
        if plo_has_assessment and not mlo_has_assessment:
            suggestions.append("📋 Add assessment component: Include evaluation criteria or analytical methods")
        
        # Domain-specific suggestions based on identified concepts
        if "sustainability" in aligned_concepts:
            if "lifecycle_assessment" not in aligned_concepts:
                suggestions.append("🌱 Enhance sustainability focus: Consider adding lifecycle assessment (LCA) methodology")
        
        if "management" in aligned_concepts:
            if "strategy" not in aligned_concepts and "planning" not in mlo_text.lower():
                suggestions.append("📈 Strengthen management component: Add strategic planning or decision-making elements")
        
        return suggestions[:5]  # Limit to top 5 suggestions

    def analyze_plo_mlo_alignment(self, plo_text: str, mlo_text: str, 
                                 original_score: float) -> SemanticAnalysisResult:
        """Comprehensive semantic analysis of PLO-MLO alignment"""
        
        # Perform all analyses
        semantic_similarity = self.analyze_semantic_similarity(plo_text, mlo_text)
        conceptual_alignment, aligned_concepts, missing_concepts = self.analyze_conceptual_alignment(plo_text, mlo_text)
        cognitive_coherence, plo_bloom, mlo_bloom = self.analyze_cognitive_coherence(plo_text, mlo_text)
        
        # Calculate enhanced score
        # Weighted combination: semantic (40%), conceptual (40%), cognitive (20%)
        enhanced_score = (
            semantic_similarity * 0.4 +
            conceptual_alignment * 0.4 +
            cognitive_coherence * 0.2
        ) * 5.0  # Scale to 1-5
        
        # Ensure score is within bounds and consider original score
        enhanced_score = max(1.0, min(5.0, enhanced_score))
        
        # Blend with original score (70% new analysis, 30% original)
        if original_score > 0:
            enhanced_score = enhanced_score * 0.7 + original_score * 0.3
        
        # Calculate confidence based on analysis consistency
        confidence = (semantic_similarity + conceptual_alignment + cognitive_coherence) / 3.0
        
        # Generate reasoning
        reasoning = self._generate_detailed_reasoning(
            semantic_similarity, conceptual_alignment, cognitive_coherence,
            aligned_concepts, missing_concepts, plo_bloom, mlo_bloom
        )
        
        # Generate suggestions
        suggestions = self.generate_enhancement_suggestions(
            plo_text, mlo_text, aligned_concepts, missing_concepts, plo_bloom, mlo_bloom
        )
        
        return SemanticAnalysisResult(
            semantic_similarity=semantic_similarity,
            conceptual_alignment=conceptual_alignment,
            cognitive_coherence=cognitive_coherence,
            enhanced_score=enhanced_score,
            confidence=confidence,
            reasoning=reasoning,
            suggestions=suggestions,
            key_concepts=aligned_concepts,
            missing_concepts=missing_concepts
        )

    def _generate_detailed_reasoning(self, semantic_sim: float, conceptual_align: float, 
                                   cognitive_coh: float, aligned_concepts: List[str],
                                   missing_concepts: List[str], plo_bloom: BloomLevel, 
                                   mlo_bloom: BloomLevel) -> str:
        """Generate detailed reasoning for the analysis"""
        reasoning_parts = []
        
        # Semantic analysis
        if semantic_sim > 0.7:
            reasoning_parts.append(f"Strong semantic similarity ({semantic_sim:.2f}) indicates high conceptual overlap")
        elif semantic_sim > 0.4:
            reasoning_parts.append(f"Moderate semantic similarity ({semantic_sim:.2f}) shows some conceptual connection")
        else:
            reasoning_parts.append(f"Low semantic similarity ({semantic_sim:.2f}) suggests conceptual misalignment")
        
        # Conceptual alignment
        if conceptual_align > 0.7:
            reasoning_parts.append(f"Excellent conceptual alignment with {len(aligned_concepts)} shared concepts: {', '.join(aligned_concepts[:3])}")
        elif conceptual_align > 0.4:
            reasoning_parts.append(f"Good conceptual foundation with aligned concepts: {', '.join(aligned_concepts[:3])}")
        else:
            reasoning_parts.append(f"Limited conceptual alignment - only {len(aligned_concepts)} concepts match")
        
        # Cognitive coherence
        if cognitive_coh > 0.8:
            reasoning_parts.append(f"Perfect cognitive alignment: both at {plo_bloom.name} level")
        elif cognitive_coh > 0.6:
            reasoning_parts.append(f"Good cognitive coherence: PLO {plo_bloom.name} ↔ MLO {mlo_bloom.name}")
        else:
            reasoning_parts.append(f"Cognitive mismatch: PLO expects {plo_bloom.name} but MLO delivers {mlo_bloom.name}")
        
        # Missing concepts impact
        if missing_concepts:
            high_priority_missing = [c for c in missing_concepts 
                                   if self.educational_concepts.get(c, 
                                      EducationalConcept("", ConceptType.KNOWLEDGE, BloomLevel.UNDERSTAND, 0.5, [], [])).weight > 0.8]
            if high_priority_missing:
                reasoning_parts.append(f"Critical gaps: MLO missing {', '.join(high_priority_missing[:2])}")
        
        return ". ".join(reasoning_parts) + "."


class SemanticAnalysisAPI:
    """Main API for semantic analysis"""
    
    def __init__(self):
        self.analyzer = AdvancedSemanticAnalyzer()
        self.logger = logging.getLogger(__name__)
        
    async def analyze_alignment(self, plo_text: str, mlo_text: str, 
                              original_score: float = 0.0) -> Dict:
        """Main API method for alignment analysis"""
        try:
            result = self.analyzer.analyze_plo_mlo_alignment(plo_text, mlo_text, original_score)
            
            return {
                'success': True,
                'enhanced_score': round(result.enhanced_score, 1),
                'confidence': round(result.confidence, 2),
                'reasoning': result.reasoning,
                'suggestions': result.suggestions,
                'analysis_details': {
                    'semantic_similarity': round(result.semantic_similarity, 3),
                    'conceptual_alignment': round(result.conceptual_alignment, 3),
                    'cognitive_coherence': round(result.cognitive_coherence, 3),
                    'key_concepts': result.key_concepts,
                    'missing_concepts': result.missing_concepts
                },
                'original_score': original_score
            }
            
        except Exception as e:
            self.logger.error(f"Analysis failed: {e}")
            return {
                'success': False,
                'error': f'Semantic analysis failed: {str(e)}',
                'enhanced_score': original_score or 1.0,
                'confidence': 0.0
            }


# Test the analyzer
if __name__ == "__main__":
    # Test with sample educational content
    analyzer = SemanticAnalysisAPI()
    
    plo_sample = "Students will analyze environmental sustainability frameworks and evaluate lifecycle assessment methodologies"
    mlo_sample = "Apply lifecycle assessment tools to evaluate environmental impact of products and processes"
    
    import asyncio
    
    async def test():
        result = await analyzer.analyze_alignment(plo_sample, mlo_sample, 3.0)
        print(json.dumps(result, indent=2))
    
    asyncio.run(test())
