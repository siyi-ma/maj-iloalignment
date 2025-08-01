#!/usr/bin/env python3
"""
Lightweight Semantic Analysis Server
Advanced concept-based analysis without heavy ML dependencies
"""

from flask import Flask, request, jsonify
import os
import logging
import re
from typing import Dict, List, Tuple
from dataclasses import dataclass
from enum import Enum

app = Flask(__name__)

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class BloomLevel(Enum):
    """Bloom's Taxonomy cognitive levels"""
    REMEMBER = 1
    UNDERSTAND = 2
    APPLY = 3
    ANALYZE = 4
    EVALUATE = 5
    CREATE = 6

@dataclass
class ConceptMatch:
    """Represents a matched educational concept"""
    concept: str
    confidence: float
    bloom_level: BloomLevel
    weight: float

class LightweightSemanticAnalyzer:
    """Lightweight semantic analyzer using advanced pattern matching"""
    
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self._init_concept_patterns()
        self._init_bloom_patterns()
        self._init_relationship_patterns()
        
    def _init_concept_patterns(self):
        """Initialize educational concept patterns with weights and relationships"""
        self.concept_patterns = {
            # Analysis & Critical Thinking
            'analysis': {
                'patterns': [r'\banalyz[ei]', r'\bexamin[ei]', r'\binvestigat[ei]', r'\bbreak.*down', r'\bdissect'],
                'weight': 0.95,
                'bloom_level': BloomLevel.ANALYZE,
                'related': ['evaluation', 'critical_thinking', 'investigation'],
                'synonyms': ['examination', 'investigation', 'breakdown', 'dissection']
            },
            
            # Sustainability & Environment
            'sustainability': {
                'patterns': [r'\bsustainabl[ei]', r'\benvironmental', r'\bgreen\b', r'\beco[^n]', r'\brenewable'],
                'weight': 0.9,
                'bloom_level': BloomLevel.APPLY,
                'related': ['lifecycle_assessment', 'environmental_impact', 'resource_management'],
                'synonyms': ['environmental', 'eco-friendly', 'green', 'renewable']
            },
            
            'lifecycle_assessment': {
                'patterns': [r'\blifecycle\s+assessment', r'\blife\s*cycle\s*analysis', r'\blca\b', r'\blifecycle\s+analysis'],
                'weight': 0.95,
                'bloom_level': BloomLevel.ANALYZE,
                'related': ['sustainability', 'environmental_assessment', 'impact_analysis'],
                'synonyms': ['LCA', 'life cycle analysis', 'lifecycle analysis']
            },
            
            'environmental_impact': {
                'patterns': [r'\benvironmental\s+impact', r'\beco.*impact', r'\benvironmental\s+effect', r'\bcarbon\s+footprint'],
                'weight': 0.85,
                'bloom_level': BloomLevel.ANALYZE,
                'related': ['sustainability', 'lifecycle_assessment', 'assessment'],
                'synonyms': ['eco impact', 'environmental effect', 'carbon footprint']
            },
            
            # Management & Strategy
            'management': {
                'patterns': [r'\bmanag[ei]', r'\borganiz[ei]', r'\bcoordinat[ei]', r'\blead', r'\bdirect', r'\bsupervis[ei]'],
                'weight': 0.8,
                'bloom_level': BloomLevel.APPLY,
                'related': ['leadership', 'planning', 'strategy', 'coordination'],
                'synonyms': ['organize', 'coordinate', 'lead', 'direct', 'supervise']
            },
            
            'strategy': {
                'patterns': [r'\bstrateg[yi]', r'\bplanning', r'\bmethodolog[yi]', r'\bapproach', r'\bframework'],
                'weight': 0.85,
                'bloom_level': BloomLevel.CREATE,
                'related': ['management', 'planning', 'methodology', 'framework'],
                'synonyms': ['planning', 'methodology', 'approach', 'framework']
            },
            
            # Assessment & Evaluation
            'evaluation': {
                'patterns': [r'\bevaluat[ei]', r'\bassess', r'\bapprais[ei]', r'\bcritiqu[ei]', r'\bjudg[ei]'],
                'weight': 0.9,
                'bloom_level': BloomLevel.EVALUATE,
                'related': ['analysis', 'assessment', 'critical_thinking'],
                'synonyms': ['assess', 'appraise', 'critique', 'judge']
            },
            
            'assessment': {
                'patterns': [r'\bassessment', r'\bmeasur[ei]', r'\btest', r'\bevaluation', r'\bmetrics'],
                'weight': 0.85,
                'bloom_level': BloomLevel.EVALUATE,
                'related': ['evaluation', 'measurement', 'testing'],
                'synonyms': ['measure', 'test', 'evaluation', 'metrics']
            },
            
            # Design & Creation
            'design': {
                'patterns': [r'\bdesign', r'\bcreat[ei]', r'\bdevelop', r'\bconstruct', r'\bbuild', r'\bformulat[ei]'],
                'weight': 0.85,
                'bloom_level': BloomLevel.CREATE,
                'related': ['innovation', 'creativity', 'development', 'construction'],
                'synonyms': ['create', 'develop', 'construct', 'build', 'formulate']
            },
            
            'innovation': {
                'patterns': [r'\binnovation', r'\binnovativ[ei]', r'\bcreativity', r'\bnovel', r'\bbreakthrough'],
                'weight': 0.9,
                'bloom_level': BloomLevel.CREATE,
                'related': ['design', 'creativity', 'development'],
                'synonyms': ['creative', 'novel', 'breakthrough', 'original']
            },
            
            # Communication & Collaboration
            'communication': {
                'patterns': [r'\bcommunicat[ei]', r'\bpresent', r'\bexpress', r'\barticul[ei]', r'\bconvey'],
                'weight': 0.8,
                'bloom_level': BloomLevel.APPLY,
                'related': ['presentation', 'expression', 'collaboration'],
                'synonyms': ['present', 'express', 'articulate', 'convey']
            },
            
            'collaboration': {
                'patterns': [r'\bcollaborat[ei]', r'\bteamwork', r'\bcooperat[ei]', r'\bwork.*together', r'\bpartnership'],
                'weight': 0.75,
                'bloom_level': BloomLevel.APPLY,
                'related': ['communication', 'teamwork', 'cooperation'],
                'synonyms': ['teamwork', 'cooperate', 'partnership', 'joint work']
            },
            
            # Research & Investigation
            'research': {
                'patterns': [r'\bresearch', r'\binvestigat[ei]', r'\bstud[yi]', r'\bexplor[ei]', r'\binquir[yi]'],
                'weight': 0.85,
                'bloom_level': BloomLevel.ANALYZE,
                'related': ['investigation', 'analysis', 'exploration'],
                'synonyms': ['investigate', 'study', 'explore', 'inquiry']
            },
            
            'methodology': {
                'patterns': [r'\bmethodolog[yi]', r'\bmethod', r'\btechnique', r'\bprocedur[ei]', r'\bprocess'],
                'weight': 0.8,
                'bloom_level': BloomLevel.UNDERSTAND,
                'related': ['method', 'technique', 'procedure', 'approach'],
                'synonyms': ['method', 'technique', 'procedure', 'process']
            },
            
            # Application & Implementation
            'application': {
                'patterns': [r'\bappl[yi]', r'\bimplement', r'\bexecut[ei]', r'\bcarry.*out', r'\bperform'],
                'weight': 0.8,
                'bloom_level': BloomLevel.APPLY,
                'related': ['implementation', 'execution', 'practice'],
                'synonyms': ['implement', 'execute', 'carry out', 'perform']
            },
            
            'practical': {
                'patterns': [r'\bpractical', r'\bhands.on', r'\breal.world', r'\bapplied', r'\bfield'],
                'weight': 0.75,
                'bloom_level': BloomLevel.APPLY,
                'related': ['application', 'implementation', 'real_world'],
                'synonyms': ['hands-on', 'real-world', 'applied', 'field-based']
            }
        }
        
    def _init_bloom_patterns(self):
        """Initialize Bloom's taxonomy detection patterns"""
        self.bloom_patterns = {
            BloomLevel.REMEMBER: {
                'patterns': [r'\bremember', r'\brecall', r'\brecogniz[ei]', r'\bidentify', r'\bdefine', r'\blist', r'\bname', r'\bstate'],
                'indicators': ['basic', 'fundamental', 'elementary', 'simple', 'knowledge', 'facts', 'information']
            },
            BloomLevel.UNDERSTAND: {
                'patterns': [r'\bunderstand', r'\bcomprehend', r'\bexplain', r'\binterpret', r'\bsummariz[ei]', r'\bparaphrase'],
                'indicators': ['meaning', 'concept', 'idea', 'principle', 'illustrate', 'demonstrate', 'show']
            },
            BloomLevel.APPLY: {
                'patterns': [r'\bappl[yi]', r'\buse', r'\bimplement', r'\bexecut[ei]', r'\bcarry.*out', r'\bperform'],
                'indicators': ['practical', 'practice', 'hands-on', 'real-world', 'solve', 'calculate', 'operate']
            },
            BloomLevel.ANALYZE: {
                'patterns': [r'\banalyz[ei]', r'\bexamin[ei]', r'\binvestigat[ei]', r'\bcompar[ei]', r'\bcontrast'],
                'indicators': ['breakdown', 'deconstruct', 'dissect', 'separate', 'relationships', 'patterns', 'structure']
            },
            BloomLevel.EVALUATE: {
                'patterns': [r'\bevaluat[ei]', r'\bassess', r'\bcritiqu[ei]', r'\bjudg[ei]', r'\bjustify', r'\bdefend'],
                'indicators': ['quality', 'value', 'worth', 'effectiveness', 'validity', 'criteria', 'standards']
            },
            BloomLevel.CREATE: {
                'patterns': [r'\bcreat[ei]', r'\bdesign', r'\bdevelop', r'\bgenerat[ei]', r'\bproduc[ei]', r'\bconstruct'],
                'indicators': ['original', 'new', 'innovative', 'novel', 'synthesize', 'combine', 'integrate']
            }
        }
        
    def _init_relationship_patterns(self):
        """Initialize patterns for detecting conceptual relationships"""
        self.relationship_patterns = {
            'causation': [r'\bcaus[ei]', r'\blead.*to', r'\bresult.*in', r'\bdue.*to'],
            'comparison': [r'\bcompar[ei]', r'\bcontrast', r'\bsimilar', r'\bdifferent', r'\balternative'],
            'process': [r'\bprocess', r'\bstep', r'\bstage', r'\bphase', r'\bsequence'],
            'measurement': [r'\bmeasur[ei]', r'\bquantify', r'\bmetric', r'\bindicator', r'\bassess'],
            'optimization': [r'\boptimiz[ei]', r'\bimprov[ei]', r'\benhance', r'\bmaximiz[ei]', r'\bminimiz[ei]']
        }

    def extract_concepts(self, text: str) -> List[ConceptMatch]:
        """Extract educational concepts from text with confidence scores"""
        text_lower = text.lower()
        found_concepts = []
        
        for concept_name, concept_data in self.concept_patterns.items():
            confidence = 0.0
            
            # Check main patterns
            for pattern in concept_data['patterns']:
                matches = len(re.findall(pattern, text_lower))
                if matches > 0:
                    confidence = max(confidence, min(1.0, matches * 0.3))
            
            # Check synonyms for additional confidence
            for synonym in concept_data.get('synonyms', []):
                if synonym.lower() in text_lower:
                    confidence = max(confidence, 0.7)
            
            # Context boost for related terms
            for related in concept_data.get('related', []):
                if any(re.search(pattern, text_lower) for pattern in self.concept_patterns.get(related, {}).get('patterns', [])):
                    confidence = min(1.0, confidence + 0.2)
            
            if confidence > 0:
                found_concepts.append(ConceptMatch(
                    concept=concept_name,
                    confidence=confidence,
                    bloom_level=concept_data['bloom_level'],
                    weight=concept_data['weight']
                ))
        
        return sorted(found_concepts, key=lambda x: x.confidence * x.weight, reverse=True)

    def detect_bloom_level(self, text: str) -> Tuple[BloomLevel, float]:
        """Detect Bloom's taxonomy level with confidence"""
        text_lower = text.lower()
        level_scores = {}
        
        for level, data in self.bloom_patterns.items():
            score = 0.0
            
            # Check main patterns
            for pattern in data['patterns']:
                matches = len(re.findall(pattern, text_lower))
                score += matches * 2
            
            # Check indicators
            for indicator in data['indicators']:
                if indicator in text_lower:
                    score += 1
            
            level_scores[level] = score
        
        if not any(level_scores.values()):
            return BloomLevel.UNDERSTAND, 0.3
        
        best_level = max(level_scores.items(), key=lambda x: x[1])
        confidence = min(1.0, best_level[1] / max(sum(level_scores.values()), 1))
        
        return best_level[0], confidence

    def calculate_semantic_similarity(self, text1: str, text2: str) -> float:
        """Calculate semantic similarity using concept overlap"""
        concepts1 = self.extract_concepts(text1)
        concepts2 = self.extract_concepts(text2)
        
        if not concepts1 or not concepts2:
            return 0.0
        
        # Direct concept matches
        concept_names1 = {c.concept for c in concepts1}
        concept_names2 = {c.concept for c in concepts2}
        direct_matches = concept_names1.intersection(concept_names2)
        
        # Calculate weighted similarity
        similarity_score = 0.0
        total_weight = 0.0
        
        # Direct matches
        for concept in direct_matches:
            c1 = next(c for c in concepts1 if c.concept == concept)
            c2 = next(c for c in concepts2 if c.concept == concept)
            weight = (c1.weight + c2.weight) / 2
            confidence = min(c1.confidence, c2.confidence)
            similarity_score += weight * confidence
            total_weight += weight
        
        # Related concept matches
        for c1 in concepts1:
            for c2 in concepts2:
                if c1.concept != c2.concept:
                    c1_data = self.concept_patterns.get(c1.concept, {})
                    if c2.concept in c1_data.get('related', []):
                        weight = (c1.weight + c2.weight) / 4  # Reduced weight for related
                        confidence = min(c1.confidence, c2.confidence)
                        similarity_score += weight * confidence * 0.6
                        total_weight += weight * 0.6
        
        if total_weight > 0:
            return min(1.0, similarity_score / total_weight)
        
        return 0.0

    def analyze_alignment(self, plo_text: str, mlo_text: str, original_score: float = 0.0) -> Dict:
        """Comprehensive semantic alignment analysis"""
        try:
            # Extract concepts
            plo_concepts = self.extract_concepts(plo_text)
            mlo_concepts = self.extract_concepts(mlo_text)
            
            # Detect Bloom levels
            plo_bloom, plo_bloom_conf = self.detect_bloom_level(plo_text)
            mlo_bloom, mlo_bloom_conf = self.detect_bloom_level(mlo_text)
            
            # Calculate semantic similarity
            semantic_similarity = self.calculate_semantic_similarity(plo_text, mlo_text)
            
            # Calculate concept alignment
            plo_concept_names = {c.concept for c in plo_concepts}
            mlo_concept_names = {c.concept for c in mlo_concepts}
            aligned_concepts = list(plo_concept_names.intersection(mlo_concept_names))
            missing_concepts = list(plo_concept_names - mlo_concept_names)
            
            # Calculate cognitive coherence
            bloom_diff = abs(plo_bloom.value - mlo_bloom.value)
            if bloom_diff == 0:
                cognitive_coherence = 1.0
            elif bloom_diff == 1:
                cognitive_coherence = 0.8
            elif bloom_diff == 2:
                cognitive_coherence = 0.6
            else:
                cognitive_coherence = 0.3
            
            # Bonus if MLO meets or exceeds PLO level
            if mlo_bloom.value >= plo_bloom.value:
                cognitive_coherence = min(1.0, cognitive_coherence + 0.1)
            
            # Calculate conceptual alignment score
            if plo_concepts:
                concept_alignment = len(aligned_concepts) / len(plo_concept_names)
            else:
                concept_alignment = 0.0
            
            # Calculate enhanced score
            enhanced_score = (
                semantic_similarity * 0.4 +
                concept_alignment * 0.4 +
                cognitive_coherence * 0.2
            ) * 5.0
            
            # Blend with original score if provided
            if original_score > 0:
                enhanced_score = enhanced_score * 0.7 + original_score * 0.3
            
            enhanced_score = max(1.0, min(5.0, enhanced_score))
            
            # Calculate confidence
            confidence = (semantic_similarity + concept_alignment + cognitive_coherence) / 3.0
            
            # Generate reasoning
            reasoning = self._generate_reasoning(
                semantic_similarity, concept_alignment, cognitive_coherence,
                aligned_concepts, missing_concepts, plo_bloom, mlo_bloom
            )
            
            # Generate suggestions
            suggestions = self._generate_suggestions(
                plo_text, mlo_text, aligned_concepts, missing_concepts,
                plo_bloom, mlo_bloom, enhanced_score
            )
            
            return {
                'success': True,
                'enhanced_score': round(enhanced_score, 1),
                'confidence': round(confidence, 2),
                'reasoning': reasoning,
                'suggestions': suggestions,
                'analysis_details': {
                    'semantic_similarity': round(semantic_similarity, 3),
                    'concept_alignment': round(concept_alignment, 3),
                    'cognitive_coherence': round(cognitive_coherence, 3),
                    'plo_concepts': [c.concept for c in plo_concepts[:5]],
                    'mlo_concepts': [c.concept for c in mlo_concepts[:5]],
                    'aligned_concepts': aligned_concepts,
                    'missing_concepts': missing_concepts[:3],
                    'plo_bloom_level': plo_bloom.name,
                    'mlo_bloom_level': mlo_bloom.name
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

    def _generate_reasoning(self, semantic_sim: float, concept_align: float, 
                          cognitive_coh: float, aligned_concepts: List[str],
                          missing_concepts: List[str], plo_bloom: BloomLevel, 
                          mlo_bloom: BloomLevel) -> str:
        """Generate detailed reasoning"""
        parts = []
        
        # Semantic analysis
        if semantic_sim > 0.7:
            parts.append(f"Strong semantic connection ({semantic_sim:.2f}) with substantial conceptual overlap")
        elif semantic_sim > 0.4:
            parts.append(f"Moderate semantic alignment ({semantic_sim:.2f}) showing some conceptual relationship")
        else:
            parts.append(f"Limited semantic similarity ({semantic_sim:.2f}) indicating conceptual gaps")
        
        # Concept alignment
        if concept_align > 0.7:
            parts.append(f"Excellent conceptual match with {len(aligned_concepts)} shared concepts: {', '.join(aligned_concepts[:3])}")
        elif concept_align > 0.3:
            parts.append(f"Good conceptual foundation with aligned concepts: {', '.join(aligned_concepts[:3])}")
        else:
            parts.append(f"Weak conceptual alignment - few shared educational concepts")
        
        # Cognitive coherence
        if cognitive_coh > 0.8:
            parts.append(f"Perfect cognitive alignment: both targeting {plo_bloom.name} level")
        elif cognitive_coh > 0.6:
            parts.append(f"Compatible cognitive levels: PLO {plo_bloom.name} ↔ MLO {mlo_bloom.name}")
        else:
            parts.append(f"Cognitive mismatch: PLO expects {plo_bloom.name} but MLO delivers {mlo_bloom.name}")
        
        return ". ".join(parts) + "."

    def _generate_suggestions(self, plo_text: str, mlo_text: str, aligned_concepts: List[str],
                            missing_concepts: List[str], plo_bloom: BloomLevel, 
                            mlo_bloom: BloomLevel, enhanced_score: float) -> List[str]:
        """Generate improvement suggestions"""
        suggestions = []
        
        # Cognitive level suggestions
        if plo_bloom.value > mlo_bloom.value + 1:
            suggestions.append(f"🎯 Elevate cognitive level: MLO should target {plo_bloom.name} level - add synthesis, evaluation, or analytical activities")
        elif plo_bloom.value < mlo_bloom.value:
            suggestions.append(f"⚠️ MLO cognitive level ({mlo_bloom.name}) exceeds PLO expectation - ensure appropriate scaffolding")
        
        # Missing concept suggestions
        if missing_concepts:
            high_priority = [c for c in missing_concepts if self.concept_patterns.get(c, {}).get('weight', 0) > 0.8]
            if high_priority:
                suggestions.append(f"🔍 Add critical concepts: Explicitly incorporate {', '.join(high_priority[:2])}")
        
        # Score-based suggestions
        if enhanced_score < 2.5:
            suggestions.append("🔴 Major alignment revision needed: Consider restructuring MLO to better match PLO expectations")
            if 'sustainability' in missing_concepts:
                suggestions.append("🌱 Add sustainability focus: Include environmental assessment or lifecycle thinking")
            if 'analysis' in missing_concepts:
                suggestions.append("📊 Strengthen analytical component: Add critical thinking or evaluation methods")
        
        elif enhanced_score < 3.5:
            suggestions.append("🟡 Moderate improvement needed: Strengthen conceptual connections")
            if len(aligned_concepts) < 2:
                suggestions.append("🔗 Increase concept overlap: Add more shared educational concepts")
        
        else:
            suggestions.append("🟢 Strong alignment maintained: Consider adding specific assessment criteria")
        
        # Assessment suggestions
        if 'assessment' not in aligned_concepts and 'evaluation' not in aligned_concepts:
            if any(term in plo_text.lower() for term in ['assess', 'evaluat', 'measur']):
                suggestions.append("📋 Add assessment component: Include evaluation criteria or measurement methods")
        
        return suggestions[:5]


# Initialize analyzer
semantic_analyzer = LightweightSemanticAnalyzer()

# CORS headers
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

@app.route('/status', methods=['GET'])
def status():
    """Health check endpoint"""
    return jsonify({
        'status': 'online',
        'message': 'Lightweight Semantic Analysis Server is running',
        'version': '2.0.0-lightweight',
        'features': [
            'Advanced concept-based semantic analysis',
            'Educational concept knowledge base',
            'Bloom\'s taxonomy cognitive analysis',
            'Context-specific improvement suggestions',
            'No heavy ML dependencies'
        ]
    })

@app.route('/analyze', methods=['POST', 'OPTIONS'])
def analyze():
    """Semantic analysis endpoint"""
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'})
    
    try:
        data = request.get_json()
        if not data:
            return jsonify({
                'success': False,
                'error': 'No JSON data provided'
            }), 400
            
        plo_text = data.get('plo_text', '')
        mlo_text = data.get('mlo_text', '')
        original_score = float(data.get('original_score', 0))
        
        if not plo_text or not mlo_text:
            return jsonify({
                'success': False,
                'error': 'Both plo_text and mlo_text are required'
            }), 400
        
        logger.info(f"Analyzing: PLO='{plo_text[:50]}...' MLO='{mlo_text[:50]}...'")
        
        # Perform semantic analysis
        result = semantic_analyzer.analyze_alignment(plo_text, mlo_text, original_score)
        
        logger.info(f"Analysis complete: score={result.get('enhanced_score')}, confidence={result.get('confidence')}")
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Analysis error: {e}", exc_info=True)
        return jsonify({
            'success': False,
            'error': f'Analysis failed: {str(e)}',
            'enhanced_score': original_score if 'original_score' in locals() else 1.0,
            'confidence': 0.0
        }), 500

@app.route('/concepts', methods=['GET'])
def get_concepts():
    """Get available educational concepts"""
    try:
        concepts = []
        for name, data in semantic_analyzer.concept_patterns.items():
            concepts.append({
                'name': name,
                'weight': data['weight'],
                'bloom_level': data['bloom_level'].name,
                'synonyms': data.get('synonyms', []),
                'related': data.get('related', [])
            })
        
        return jsonify({
            'success': True,
            'concepts': concepts,
            'total_concepts': len(concepts)
        })
        
    except Exception as e:
        logger.error(f"Error retrieving concepts: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/test', methods=['GET'])
def test_analysis():
    """Test endpoint with sample data"""
    try:
        # Sample data showing semantic understanding
        plo_sample = "Students will analyze environmental sustainability frameworks and evaluate lifecycle assessment methodologies to make informed decisions about resource management and environmental impact"
        mlo_sample = "Apply lifecycle assessment tools and environmental evaluation methods to assess the sustainability of products and processes in real-world business scenarios"
        
        result = semantic_analyzer.analyze_alignment(plo_sample, mlo_sample, 3.0)
        
        return jsonify({
            'test_data': {
                'plo_text': plo_sample,
                'mlo_text': mlo_sample,
                'original_score': 3.0
            },
            'analysis_result': result
        })
        
    except Exception as e:
        logger.error(f"Test analysis error: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/', methods=['GET'])
def home():
    """Root endpoint with API documentation"""
    return jsonify({
        'message': 'Lightweight Semantic Analysis Server for Learning Outcomes',
        'version': '2.0.0-lightweight',
        'description': 'Advanced concept-based semantic analysis without heavy ML dependencies',
        'endpoints': {
            '/status': 'Health check',
            '/analyze': 'POST - Semantic analysis of PLO-MLO alignment',
            '/concepts': 'GET - List available educational concepts',
            '/test': 'GET - Test analysis with sample data'
        },
        'improvements_over_keyword_matching': [
            'Educational concept knowledge base with relationships',
            'Bloom\'s taxonomy cognitive level analysis',
            'Context-aware confidence scoring',
            'Domain-specific improvement suggestions',
            'Conceptual relationship detection',
            'Weighted semantic similarity calculation'
        ],
        'example_analysis': {
            'input': {
                'plo_text': 'Students will analyze sustainability frameworks',
                'mlo_text': 'Apply lifecycle assessment methods'
            },
            'semantic_understanding': {
                'concepts_detected': ['analysis', 'sustainability', 'lifecycle_assessment'],
                'conceptual_relationships': ['sustainability ↔ lifecycle_assessment'],
                'bloom_levels': 'PLO: ANALYZE ↔ MLO: APPLY',
                'reasoning': 'Strong conceptual alignment with sustainability focus'
            }
        }
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    logger.info(f"Starting Lightweight Semantic Analysis Server on port {port}")
    app.run(host='0.0.0.0', port=port, debug=False)
