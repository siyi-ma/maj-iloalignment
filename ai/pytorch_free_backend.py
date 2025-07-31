"""
Enhanced PLO-MLO Analysis Backend (PyTorch-Free Version)
Provides AI-powered curriculum analysis without PyTorch dependencies
"""

import asyncio
import json
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass
from enum import Enum
import re
import math

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

# Basic text processing (no PyTorch dependency)
import re
from collections import Counter
import urllib.request
import urllib.parse

# spaCy for NLP (optional)
try:
    import spacy
    SPACY_AVAILABLE = True
    # Try to load English model
    try:
        nlp = spacy.load("en_core_web_sm")
    except OSError:
        print("spaCy English model not found. Run: python -m spacy download en_core_web_sm")
        nlp = None
except ImportError:
    SPACY_AVAILABLE = False
    nlp = None
    print("spaCy not installed. Run: pip install spacy")

@dataclass
class AnalysisResult:
    """Result of enhanced PLO-MLO analysis"""
    plo_id: str
    mlo_id: str
    original_score: float
    enhanced_score: float
    confidence: float
    method: str
    reasoning: str
    suggestions: List[str]
    keywords: List[str]
    concepts: List[str]

class BloomLevel(Enum):
    """Bloom's Taxonomy levels"""
    REMEMBER = 1
    UNDERSTAND = 2
    APPLY = 3
    ANALYZE = 4
    EVALUATE = 5
    CREATE = 6

class BasicSemanticAnalyzer:
    """Basic semantic analysis without PyTorch"""
    
    def __init__(self):
        # Common educational keywords and their weights
        self.educational_keywords = {
            # Cognitive skills
            'analyze': 0.9, 'evaluate': 0.9, 'create': 0.9, 'synthesize': 0.9,
            'understand': 0.8, 'apply': 0.8, 'demonstrate': 0.8, 'implement': 0.8,
            'remember': 0.6, 'recall': 0.6, 'identify': 0.6, 'describe': 0.6,
            
            # Action verbs
            'develop': 0.8, 'design': 0.8, 'build': 0.8, 'construct': 0.8,
            'solve': 0.8, 'calculate': 0.7, 'compute': 0.7, 'measure': 0.7,
            'explain': 0.7, 'discuss': 0.7, 'compare': 0.7, 'contrast': 0.7,
            
            # Subject areas
            'engineering': 0.8, 'technology': 0.8, 'science': 0.8, 'mathematics': 0.8,
            'programming': 0.8, 'software': 0.8, 'system': 0.7, 'algorithm': 0.8,
            
            # Skills
            'communication': 0.7, 'teamwork': 0.7, 'leadership': 0.7, 'ethics': 0.7,
            'professional': 0.7, 'critical': 0.8, 'thinking': 0.8, 'problem': 0.9,
            'solving': 0.9, 'learning': 0.8, 'research': 0.8
        }
        
        # Bloom's taxonomy keywords
        self.bloom_keywords = {
            BloomLevel.REMEMBER: ['remember', 'recall', 'recognize', 'identify', 'define', 'list'],
            BloomLevel.UNDERSTAND: ['understand', 'explain', 'describe', 'interpret', 'summarize'],
            BloomLevel.APPLY: ['apply', 'use', 'demonstrate', 'implement', 'execute', 'solve'],
            BloomLevel.ANALYZE: ['analyze', 'examine', 'compare', 'contrast', 'categorize'],
            BloomLevel.EVALUATE: ['evaluate', 'assess', 'critique', 'judge', 'justify'],
            BloomLevel.CREATE: ['create', 'design', 'develop', 'generate', 'produce', 'construct']
        }
    
    def calculate_similarity(self, text1: str, text2: str) -> float:
        """Calculate basic semantic similarity using keyword overlap"""
        # Normalize texts
        text1_clean = self._normalize_text(text1)
        text2_clean = self._normalize_text(text2)
        
        # Extract keywords
        keywords1 = self._extract_keywords(text1_clean)
        keywords2 = self._extract_keywords(text2_clean)
        
        if not keywords1 or not keywords2:
            return 0.0
        
        # Calculate weighted overlap
        overlap_score = 0.0
        total_weight = 0.0
        
        for word in set(keywords1 + keywords2):
            weight = self.educational_keywords.get(word.lower(), 0.5)
            if word in keywords1 and word in keywords2:
                overlap_score += weight
            total_weight += weight
        
        # Normalize by total possible weight
        if total_weight > 0:
            similarity = overlap_score / total_weight
        else:
            similarity = 0.0
        
        # Bonus for exact phrase matches
        similarity += self._phrase_similarity(text1_clean, text2_clean) * 0.3
        
        return min(similarity, 1.0)
    
    def _normalize_text(self, text: str) -> str:
        """Normalize text for comparison"""
        # Convert to lowercase and remove extra whitespace
        text = re.sub(r'\s+', ' ', text.lower().strip())
        # Remove punctuation except for important cases
        text = re.sub(r'[^\w\s.-]', ' ', text)
        return text
    
    def _extract_keywords(self, text: str) -> List[str]:
        """Extract meaningful keywords from text"""
        words = text.split()
        
        # Filter out common stop words
        stop_words = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those'}
        
        keywords = []
        for word in words:
            word = word.strip('.-')
            if len(word) > 2 and word.lower() not in stop_words:
                keywords.append(word)
        
        return keywords
    
    def _phrase_similarity(self, text1: str, text2: str) -> float:
        """Calculate similarity based on common phrases"""
        # Find common 2-3 word phrases
        words1 = text1.split()
        words2 = text2.split()
        
        phrases1 = set()
        phrases2 = set()
        
        # Generate 2-word phrases
        for i in range(len(words1) - 1):
            phrases1.add(f"{words1[i]} {words1[i+1]}")
        for i in range(len(words2) - 1):
            phrases2.add(f"{words2[i]} {words2[i+1]}")
        
        # Calculate phrase overlap
        common_phrases = phrases1.intersection(phrases2)
        total_phrases = len(phrases1.union(phrases2))
        
        if total_phrases > 0:
            return len(common_phrases) / total_phrases
        return 0.0
    
    def get_bloom_level(self, text: str) -> Tuple[BloomLevel, float]:
        """Determine Bloom's taxonomy level from text"""
        text_lower = text.lower()
        level_scores = {level: 0 for level in BloomLevel}
        
        for level, keywords in self.bloom_keywords.items():
            for keyword in keywords:
                if keyword in text_lower:
                    level_scores[level] += 1
        
        # Find the level with highest score
        if any(level_scores.values()):
            best_level = max(level_scores.items(), key=lambda x: x[1])
            confidence = best_level[1] / max(sum(level_scores.values()), 1)
            return best_level[0], confidence
        
        # Default to UNDERSTAND if no clear indicators
        return BloomLevel.UNDERSTAND, 0.3

class EnhancedPLOMLOAnalyzer:
    """Enhanced analyzer without PyTorch dependencies"""
    
    def __init__(self):
        self.semantic_analyzer = BasicSemanticAnalyzer()
        
    async def analyze_alignment(self, plo_text: str, mlo_text: str, 
                              original_score: float) -> AnalysisResult:
        """Perform enhanced analysis of PLO-MLO alignment"""
        
        # Basic semantic similarity
        semantic_score = self.semantic_analyzer.calculate_similarity(plo_text, mlo_text)
        
        # Bloom's taxonomy analysis
        plo_bloom, plo_bloom_conf = self.semantic_analyzer.get_bloom_level(plo_text)
        mlo_bloom, mlo_bloom_conf = self.semantic_analyzer.get_bloom_level(mlo_text)
        
        # Calculate bloom alignment bonus
        bloom_alignment = self._calculate_bloom_alignment(plo_bloom, mlo_bloom)
        
        # Combine scores
        enhanced_score = self._combine_scores(
            original_score, semantic_score, bloom_alignment
        )
        
        # Generate insights
        keywords = self._extract_alignment_keywords(plo_text, mlo_text)
        concepts = self._extract_concepts(plo_text, mlo_text)
        reasoning = self._generate_reasoning(
            original_score, semantic_score, bloom_alignment, 
            plo_bloom, mlo_bloom
        )
        suggestions = self._generate_suggestions(
            enhanced_score, plo_text, mlo_text, plo_bloom, mlo_bloom
        )
        
        # Calculate confidence
        confidence = self._calculate_confidence(
            semantic_score, plo_bloom_conf, mlo_bloom_conf
        )
        
        return AnalysisResult(
            plo_id="", mlo_id="", 
            original_score=original_score,
            enhanced_score=enhanced_score,
            confidence=confidence,
            method="basic_semantic_bloom",
            reasoning=reasoning,
            suggestions=suggestions,
            keywords=keywords,
            concepts=concepts
        )
    
    def _calculate_bloom_alignment(self, plo_bloom: BloomLevel, mlo_bloom: BloomLevel) -> float:
        """Calculate alignment bonus based on Bloom's taxonomy levels"""
        plo_level = plo_bloom.value
        mlo_level = mlo_bloom.value
        
        # Perfect match gets full bonus
        if plo_level == mlo_level:
            return 1.0
        
        # Adjacent levels get partial bonus
        diff = abs(plo_level - mlo_level)
        if diff == 1:
            return 0.7
        elif diff == 2:
            return 0.4
        else:
            return 0.1
    
    def _combine_scores(self, original: float, semantic: float, bloom: float) -> float:
        """Combine different scoring methods"""
        # Weighted combination
        weights = [0.4, 0.4, 0.2]  # original, semantic, bloom
        combined = (original * weights[0] + 
                   semantic * weights[1] + 
                   bloom * weights[2])
        
        # Ensure score is in valid range
        return max(0.0, min(5.0, combined))
    
    def _extract_alignment_keywords(self, plo_text: str, mlo_text: str) -> List[str]:
        """Extract keywords that show alignment"""
        plo_keywords = set(self.semantic_analyzer._extract_keywords(plo_text))
        mlo_keywords = set(self.semantic_analyzer._extract_keywords(mlo_text))
        
        common_keywords = plo_keywords.intersection(mlo_keywords)
        return list(common_keywords)[:10]  # Limit to top 10
    
    def _extract_concepts(self, plo_text: str, mlo_text: str) -> List[str]:
        """Extract educational concepts from texts"""
        all_text = f"{plo_text} {mlo_text}".lower()
        
        # Common educational concepts
        concept_patterns = [
            r'(\w+ing)\s+skills?',  # e.g., "programming skills"
            r'(\w+)\s+principles?',  # e.g., "engineering principles"
            r'(\w+)\s+methods?',     # e.g., "research methods"
            r'(\w+)\s+techniques?',  # e.g., "analysis techniques"
            r'(\w+)\s+knowledge',    # e.g., "domain knowledge"
            r'(\w+)\s+understanding' # e.g., "conceptual understanding"
        ]
        
        concepts = []
        for pattern in concept_patterns:
            matches = re.findall(pattern, all_text)
            concepts.extend(matches)
        
        return list(set(concepts))[:8]  # Limit and deduplicate
    
    def _generate_reasoning(self, original: float, semantic: float, bloom: float,
                          plo_bloom: BloomLevel, mlo_bloom: BloomLevel) -> str:
        """Generate human-readable reasoning for the score"""
        reasons = []
        
        if semantic > 0.7:
            reasons.append("Strong semantic similarity between PLO and MLO")
        elif semantic > 0.4:
            reasons.append("Moderate semantic similarity detected")
        else:
            reasons.append("Limited semantic overlap")
        
        if abs(plo_bloom.value - mlo_bloom.value) <= 1:
            reasons.append(f"Good Bloom's taxonomy alignment ({plo_bloom.name} ↔ {mlo_bloom.name})")
        else:
            reasons.append(f"Bloom's taxonomy mismatch ({plo_bloom.name} vs {mlo_bloom.name})")
        
        if original > 3.0:
            reasons.append("Original manual alignment score is strong")
        elif original < 2.0:
            reasons.append("Original manual alignment score suggests weak connection")
        
        return "; ".join(reasons)
    
    def _generate_suggestions(self, enhanced_score: float, plo_text: str, mlo_text: str,
                            plo_bloom: BloomLevel, mlo_bloom: BloomLevel) -> List[str]:
        """Generate improvement suggestions"""
        suggestions = []
        
        if enhanced_score < 3.0:
            suggestions.append("Consider reviewing the alignment - scores suggest weak connection")
            
            if abs(plo_bloom.value - mlo_bloom.value) > 2:
                suggestions.append(f"Bloom's taxonomy levels differ significantly ({plo_bloom.name} vs {mlo_bloom.name})")
            
            # Check for missing keywords
            plo_keywords = set(self.semantic_analyzer._extract_keywords(plo_text))
            mlo_keywords = set(self.semantic_analyzer._extract_keywords(mlo_text))
            
            if len(plo_keywords.intersection(mlo_keywords)) < 2:
                suggestions.append("Consider adding more specific keywords to show clearer connection")
        
        elif enhanced_score > 4.0:
            suggestions.append("Strong alignment detected - good connection between PLO and MLO")
        
        return suggestions
    
    def _calculate_confidence(self, semantic_score: float, plo_bloom_conf: float, mlo_bloom_conf: float) -> float:
        """Calculate confidence in the analysis"""
        # Confidence based on multiple factors
        factors = [
            semantic_score,  # Higher semantic score = higher confidence
            plo_bloom_conf,  # Confidence in PLO Bloom classification
            mlo_bloom_conf   # Confidence in MLO Bloom classification
        ]
        
        # Weighted average
        confidence = sum(factors) / len(factors)
        
        # Apply penalty for very low scores (might indicate poor text quality)
        if semantic_score < 0.2:
            confidence *= 0.7
        
        return confidence

class AnalysisAPI:
    """Main API class for enhanced analysis"""
    
    def __init__(self, api_key: str = None):
        self.api_key = api_key or (get_api_key() if SECURE_CONFIG_AVAILABLE else None)
        self.analyzer = EnhancedPLOMLOAnalyzer()
        
        # Initialize available methods
        self.available_methods = ['basic_semantic']
        
        if LANGEXTRACT_AVAILABLE and self.api_key:
            self.available_methods.append('langextract')
        
        if SPACY_AVAILABLE and nlp:
            self.available_methods.append('spacy_enhanced')
    
    async def analyze_plo_mlo_alignment(self, plo_text: str, mlo_text: str, 
                                      original_score: float = 0.0) -> Dict:
        """Main analysis method"""
        try:
            # Perform enhanced analysis
            result = await self.analyzer.analyze_alignment(plo_text, mlo_text, original_score)
            
            return {
                'success': True,
                'original_score': result.original_score,
                'enhanced_score': result.enhanced_score,
                'confidence': result.confidence,
                'method': result.method,
                'reasoning': result.reasoning,
                'suggestions': result.suggestions,
                'keywords': result.keywords,
                'concepts': result.concepts,
                'available_methods': self.available_methods
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'original_score': original_score,
                'enhanced_score': original_score,
                'confidence': 0.0,
                'method': 'fallback',
                'reasoning': f'Analysis failed: {str(e)}',
                'suggestions': ['Check input text quality'],
                'keywords': [],
                'concepts': []
            }
    
    def get_capabilities(self) -> Dict:
        """Get current capabilities"""
        return {
            'langextract_available': LANGEXTRACT_AVAILABLE,
            'spacy_available': SPACY_AVAILABLE,
            'secure_config_available': SECURE_CONFIG_AVAILABLE,
            'api_key_configured': bool(self.api_key),
            'available_methods': self.available_methods,
            'pytorch_required': False  # This version doesn't need PyTorch
        }

# Test function
async def test_analysis():
    """Test the analysis system"""
    api = AnalysisAPI()
    
    # Test PLO and MLO
    plo_text = "Students will be able to design and implement software systems using object-oriented programming principles"
    mlo_text = "Demonstrate understanding of object-oriented programming concepts through practical implementation"
    
    result = await api.analyze_plo_mlo_alignment(plo_text, mlo_text, 3.5)
    
    print("🧪 Enhanced Analysis Test Results:")
    print(f"Original Score: {result['original_score']}")
    print(f"Enhanced Score: {result['enhanced_score']:.2f}")
    print(f"Confidence: {result['confidence']:.2f}")
    print(f"Method: {result['method']}")
    print(f"Reasoning: {result['reasoning']}")
    print(f"Keywords: {result['keywords']}")
    print(f"Suggestions: {result['suggestions']}")
    
    return result

if __name__ == "__main__":
    # Run test
    asyncio.run(test_analysis())
