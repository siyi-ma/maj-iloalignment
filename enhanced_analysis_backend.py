"""
Enhanced PLO-MLO Analysis Backend
Integrates LangExtract and other AI tools for intelligent curriculum analysis
"""

import asyncio
import json
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass
from enum import Enum

# Import secure configuration
try:
    from secure_config import get_api_key, config
    SECURE_CONFIG_AVAILABLE = True
except ImportError:
    SECURE_CONFIG_AVAILABLE = False
    print("Secure config not available. API key management will be limited.")

# LangExtract for structured information extraction
try:
    import langextract as lx
    LANGEXTRACT_AVAILABLE = True
except ImportError:
    LANGEXTRACT_AVAILABLE = False
    print("LangExtract not installed. Run: pip install langextract")

# Sentence Transformers for semantic similarity
try:
    from sentence_transformers import SentenceTransformer, util
    import torch
    TRANSFORMERS_AVAILABLE = True
except ImportError:
    TRANSFORMERS_AVAILABLE = False
    print("Sentence Transformers not installed. Run: pip install sentence-transformers")

# spaCy for advanced NLP
try:
    import spacy
    SPACY_AVAILABLE = True
except ImportError:
    SPACY_AVAILABLE = False
    print("spaCy not installed. Run: pip install spacy && python -m spacy download en_core_web_sm")


class BloomLevel(Enum):
    REMEMBER = "remember"
    UNDERSTAND = "understand"
    APPLY = "apply"
    ANALYZE = "analyze"
    EVALUATE = "evaluate"
    CREATE = "create"


@dataclass
class CompetencyExtraction:
    text: str
    competency_type: str
    bloom_level: Optional[BloomLevel]
    domain: str
    confidence: float
    start_pos: int
    end_pos: int


@dataclass
class EnhancedAlignmentResult:
    traditional_score: float
    semantic_score: float
    concept_score: float
    final_score: float
    extracted_competencies: List[CompetencyExtraction]
    bloom_alignment: Dict[str, str]
    improvement_suggestions: List[str]
    evidence_text: List[str]


class EnhancedPLOMLOAnalyzer:
    """
    Advanced PLO-MLO analyzer using multiple AI/ML approaches
    """
    
    def __init__(self):
        self.setup_models()
        self.setup_educational_prompts()
    
    def setup_models(self):
        """Initialize AI models based on availability"""
        self.models = {}
        
        # Semantic similarity model
        if TRANSFORMERS_AVAILABLE:
            try:
                self.models['semantic'] = SentenceTransformer('all-MiniLM-L6-v2')
                print("✅ Semantic similarity model loaded")
            except Exception as e:
                print(f"❌ Failed to load semantic model: {e}")
        
        # spaCy for NLP
        if SPACY_AVAILABLE:
            try:
                self.models['nlp'] = spacy.load("en_core_web_sm")
                print("✅ spaCy NLP model loaded")
            except Exception as e:
                print(f"❌ Failed to load spaCy model: {e}")
    
    def setup_educational_prompts(self):
        """Setup LangExtract prompts for educational content"""
        if not LANGEXTRACT_AVAILABLE:
            return
            
        self.educational_prompt = """
        Extract educational competencies, skills, and learning concepts from academic text.
        Focus on identifying:
        1. Cognitive processes (analyze, evaluate, create, etc.)
        2. Knowledge domains (sustainability, technology, management, etc.)
        3. Skill types (research, communication, critical thinking, etc.)
        4. Assessment approaches (projects, exams, presentations, etc.)
        
        Map cognitive processes to Bloom's Taxonomy levels where possible.
        Provide specific, actionable insights for curriculum alignment.
        """
        
        self.examples = [
            lx.data.ExampleData(
                text="Students will be able to analyze sustainable business models and evaluate their environmental impact using ESG frameworks, demonstrating critical thinking skills through case study analysis.",
                extractions=[
                    lx.data.Extraction(
                        extraction_class="cognitive_process",
                        extraction_text="analyze sustainable business models",
                        attributes={
                            "bloom_level": "analyze",
                            "domain": "sustainability",
                            "skill_type": "analytical_thinking"
                        }
                    ),
                    lx.data.Extraction(
                        extraction_class="cognitive_process", 
                        extraction_text="evaluate their environmental impact",
                        attributes={
                            "bloom_level": "evaluate",
                            "domain": "environmental_science",
                            "skill_type": "critical_evaluation"
                        }
                    ),
                    lx.data.Extraction(
                        extraction_class="assessment_method",
                        extraction_text="case study analysis",
                        attributes={
                            "method_type": "applied_analysis",
                            "skill_development": "practical_application"
                        }
                    ),
                    lx.data.Extraction(
                        extraction_class="framework",
                        extraction_text="ESG frameworks",
                        attributes={
                            "framework_type": "sustainability_assessment",
                            "application_domain": "business_analysis"
                        }
                    )
                ]
            )
        ]
    
    async def enhanced_analysis(self, plo_text: str, mlo_text: str) -> EnhancedAlignmentResult:
        """
        Perform comprehensive PLO-MLO alignment analysis using multiple AI approaches
        """
        # Run analyses in parallel for efficiency
        tasks = [
            self.traditional_keyword_analysis(plo_text, mlo_text),
            self.semantic_similarity_analysis(plo_text, mlo_text),
            self.concept_extraction_analysis(plo_text, mlo_text)
        ]
        
        traditional_score, semantic_score, concept_analysis = await asyncio.gather(*tasks)
        
        # Combine scores with intelligent weighting
        final_score = self.calculate_weighted_score(
            traditional_score, 
            semantic_score, 
            concept_analysis['alignment_score']
        )
        
        # Generate AI-powered improvement suggestions
        suggestions = await self.generate_improvement_suggestions(
            plo_text, mlo_text, concept_analysis['extracted_concepts']
        )
        
        return EnhancedAlignmentResult(
            traditional_score=traditional_score,
            semantic_score=semantic_score,
            concept_score=concept_analysis['alignment_score'],
            final_score=final_score,
            extracted_competencies=concept_analysis['extracted_concepts'],
            bloom_alignment=concept_analysis['bloom_mapping'],
            improvement_suggestions=suggestions,
            evidence_text=concept_analysis['evidence']
        )
    
    async def traditional_keyword_analysis(self, plo_text: str, mlo_text: str) -> float:
        """Traditional keyword-based analysis (current implementation)"""
        # This would be your existing keyword overlap logic
        plo_words = set(plo_text.lower().split())
        mlo_words = set(mlo_text.lower().split())
        
        overlap = len(plo_words.intersection(mlo_words))
        total_unique = len(plo_words.union(mlo_words))
        
        return (overlap / total_unique) * 5 if total_unique > 0 else 0
    
    async def semantic_similarity_analysis(self, plo_text: str, mlo_text: str) -> float:
        """Advanced semantic similarity using transformer models"""
        if 'semantic' not in self.models:
            return 0.0
        
        try:
            # Generate embeddings
            embeddings = self.models['semantic'].encode([plo_text, mlo_text])
            
            # Calculate cosine similarity
            similarity = util.pytorch_cos_sim(embeddings[0], embeddings[1]).item()
            
            # Convert to 1-5 scale
            return similarity * 5
        except Exception as e:
            print(f"Semantic analysis error: {e}")
            return 0.0
    
    async def concept_extraction_analysis(self, plo_text: str, mlo_text: str) -> Dict:
        """Extract and analyze educational concepts using LangExtract"""
        if not LANGEXTRACT_AVAILABLE:
            return {
                'alignment_score': 0.0,
                'extracted_concepts': [],
                'bloom_mapping': {},
                'evidence': []
            }
        
        try:
            # Extract concepts from both texts
            plo_result = lx.extract(
                text_or_documents=plo_text,
                prompt_description=self.educational_prompt,
                examples=self.examples,
                model_id="gemini-2.5-flash"
            )
            
            mlo_result = lx.extract(
                text_or_documents=mlo_text,
                prompt_description=self.educational_prompt,
                examples=self.examples,
                model_id="gemini-2.5-flash"
            )
            
            # Analyze concept overlap and alignment
            alignment_analysis = self.analyze_concept_alignment(
                plo_result.extractions, 
                mlo_result.extractions
            )
            
            return alignment_analysis
            
        except Exception as e:
            print(f"Concept extraction error: {e}")
            return {
                'alignment_score': 0.0,
                'extracted_concepts': [],
                'bloom_mapping': {},
                'evidence': []
            }
    
    def analyze_concept_alignment(self, plo_concepts, mlo_concepts) -> Dict:
        """Analyze alignment between extracted concepts"""
        # Count concept overlaps by type
        concept_overlap = 0
        bloom_alignment = {}
        evidence = []
        
        for plo_concept in plo_concepts:
            for mlo_concept in mlo_concepts:
                # Check for concept type matches
                if plo_concept.extraction_class == mlo_concept.extraction_class:
                    concept_overlap += 1
                    evidence.append(f"Shared {plo_concept.extraction_class}: {plo_concept.extraction_text}")
                
                # Check Bloom's level alignment
                plo_bloom = plo_concept.attributes.get('bloom_level')
                mlo_bloom = mlo_concept.attributes.get('bloom_level')
                if plo_bloom and mlo_bloom:
                    bloom_alignment[plo_bloom] = mlo_bloom
        
        # Calculate alignment score based on concept overlap
        total_concepts = len(plo_concepts) + len(mlo_concepts)
        alignment_score = (concept_overlap * 2 / total_concepts * 5) if total_concepts > 0 else 0
        
        return {
            'alignment_score': min(alignment_score, 5.0),
            'extracted_concepts': plo_concepts + mlo_concepts,
            'bloom_mapping': bloom_alignment,
            'evidence': evidence
        }
    
    def calculate_weighted_score(self, traditional: float, semantic: float, concept: float) -> float:
        """Calculate final weighted score combining all approaches"""
        # Adaptive weighting based on confidence in each method
        weights = {
            'traditional': 0.3,  # Reliable but limited
            'semantic': 0.4,     # Good for overall meaning
            'concept': 0.3       # Best for educational alignment
        }
        
        return (
            traditional * weights['traditional'] +
            semantic * weights['semantic'] + 
            concept * weights['concept']
        )
    
    async def generate_improvement_suggestions(self, plo_text: str, mlo_text: str, concepts: List) -> List[str]:
        """Generate AI-powered improvement suggestions"""
        suggestions = []
        
        # Analyze Bloom's taxonomy gaps
        plo_bloom_levels = set()
        mlo_bloom_levels = set()
        
        for concept in concepts:
            bloom_level = concept.attributes.get('bloom_level')
            if bloom_level:
                if plo_text in concept.extraction_text:
                    plo_bloom_levels.add(bloom_level)
                else:
                    mlo_bloom_levels.add(bloom_level)
        
        # Suggest Bloom's level alignment improvements
        missing_in_mlo = plo_bloom_levels - mlo_bloom_levels
        if missing_in_mlo:
            suggestions.append(f"Consider adding activities that develop {', '.join(missing_in_mlo)} skills to better align with PLO expectations.")
        
        # Suggest domain-specific improvements
        domains_mentioned = set()
        for concept in concepts:
            domain = concept.attributes.get('domain')
            if domain:
                domains_mentioned.add(domain)
        
        if len(domains_mentioned) < 2:
            suggestions.append("Consider integrating cross-disciplinary elements to strengthen competency development.")
        
        return suggestions


# API endpoints for integration with existing web interface
class AnalysisAPI:
    """REST API endpoints for enhanced analysis"""
    
    def __init__(self):
        self.analyzer = EnhancedPLOMLOAnalyzer()
    
    async def analyze_alignment(self, request_data: Dict) -> Dict:
        """Main API endpoint for enhanced alignment analysis"""
        plo_text = request_data.get('plo_text', '')
        mlo_text = request_data.get('mlo_text', '')
        
        if not plo_text or not mlo_text:
            return {'error': 'Missing PLO or MLO text'}
        
        try:
            result = await self.analyzer.enhanced_analysis(plo_text, mlo_text)
            
            return {
                'success': True,
                'scores': {
                    'traditional': round(result.traditional_score, 2),
                    'semantic': round(result.semantic_score, 2),
                    'concept': round(result.concept_score, 2),
                    'final': round(result.final_score, 2)
                },
                'analysis': {
                    'bloom_alignment': result.bloom_alignment,
                    'extracted_concepts': [
                        {
                            'text': concept.extraction_text,
                            'type': concept.extraction_class,
                            'attributes': concept.attributes
                        } for concept in result.extracted_competencies
                    ],
                    'evidence': result.evidence_text
                },
                'recommendations': result.improvement_suggestions
            }
            
        except Exception as e:
            return {'error': f'Analysis failed: {str(e)}'}


# Example usage and testing
if __name__ == "__main__":
    async def test_enhanced_analysis():
        analyzer = EnhancedPLOMLOAnalyzer()
        
        # Sample PLO and MLO texts
        plo_text = "Students will be able to analyze sustainable business models and evaluate their environmental impact using ESG frameworks."
        mlo_text = "Upon completion, students can conduct case study analysis of green technology startups and assess their sustainability metrics."
        
        result = await analyzer.enhanced_analysis(plo_text, mlo_text)
        
        print("=== Enhanced PLO-MLO Analysis Results ===")
        print(f"Traditional Score: {result.traditional_score:.2f}")
        print(f"Semantic Score: {result.semantic_score:.2f}")
        print(f"Concept Score: {result.concept_score:.2f}")
        print(f"Final Score: {result.final_score:.2f}")
        print(f"\nBloom's Alignment: {result.bloom_alignment}")
        print(f"\nExtracted Concepts: {len(result.extracted_competencies)}")
        print(f"\nImprovement Suggestions:")
        for suggestion in result.improvement_suggestions:
            print(f"  • {suggestion}")
    
    # Run test
    asyncio.run(test_enhanced_analysis())
