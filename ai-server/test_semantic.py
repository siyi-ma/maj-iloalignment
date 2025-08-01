#!/usr/bin/env python3
"""
Test script for the lightweight semantic analyzer
"""

import sys
import os

# Add the current directory to the path
sys.path.append(os.path.dirname(__file__))

from app_lightweight_semantic import semantic_analyzer

def test_semantic_analysis():
    """Test the semantic analysis functionality"""
    print("Testing Lightweight Semantic Analyzer")
    print("=" * 50)
    
    # Test data
    plo_text = "Students will analyze environmental sustainability frameworks and evaluate lifecycle assessment methodologies to make informed decisions about resource management"
    mlo_text = "Apply lifecycle assessment tools and environmental evaluation methods to assess the sustainability of products and processes in real-world scenarios"
    
    print(f"PLO: {plo_text}")
    print(f"MLO: {mlo_text}")
    print("\nAnalyzing...")
    
    try:
        result = semantic_analyzer.analyze_alignment(plo_text, mlo_text, 3.0)
        
        if result['success']:
            print(f"\n✅ Analysis successful!")
            print(f"Enhanced Score: {result['enhanced_score']}")
            print(f"Confidence: {result['confidence']}")
            print(f"Reasoning: {result['reasoning']}")
            print(f"\nSuggestions:")
            for i, suggestion in enumerate(result['suggestions'], 1):
                print(f"  {i}. {suggestion}")
            
            print(f"\nAnalysis Details:")
            details = result['analysis_details']
            print(f"  Semantic Similarity: {details['semantic_similarity']}")
            print(f"  Concept Alignment: {details['concept_alignment']}")
            print(f"  Cognitive Coherence: {details['cognitive_coherence']}")
            print(f"  PLO Concepts: {details['plo_concepts']}")
            print(f"  MLO Concepts: {details['mlo_concepts']}")
            print(f"  Aligned Concepts: {details['aligned_concepts']}")
            print(f"  Missing Concepts: {details['missing_concepts']}")
            print(f"  Bloom Levels: PLO={details['plo_bloom_level']} → MLO={details['mlo_bloom_level']}")
            
        else:
            print(f"❌ Analysis failed: {result.get('error', 'Unknown error')}")
            
    except Exception as e:
        print(f"❌ Error during analysis: {e}")
        import traceback
        traceback.print_exc()

def test_concept_extraction():
    """Test concept extraction"""
    print("\n" + "=" * 50)
    print("Testing Concept Extraction")
    print("=" * 50)
    
    test_texts = [
        "Analyze sustainability frameworks using lifecycle assessment",
        "Design innovative management strategies for environmental impact",
        "Evaluate and assess communication effectiveness in research"
    ]
    
    for text in test_texts:
        print(f"\nText: {text}")
        concepts = semantic_analyzer.extract_concepts(text)
        print("Concepts found:")
        for concept in concepts[:5]:
            print(f"  - {concept.concept}: {concept.confidence:.2f} ({concept.bloom_level.name})")

def test_bloom_detection():
    """Test Bloom's taxonomy detection"""
    print("\n" + "=" * 50)
    print("Testing Bloom's Taxonomy Detection")
    print("=" * 50)
    
    test_texts = [
        "Remember and recall basic facts",
        "Understand and explain concepts",
        "Apply methods in practical situations",
        "Analyze and examine complex relationships",
        "Evaluate and assess quality criteria",
        "Create and design innovative solutions"
    ]
    
    for text in test_texts:
        bloom_level, confidence = semantic_analyzer.detect_bloom_level(text)
        print(f"Text: {text}")
        print(f"  → Bloom Level: {bloom_level.name} (confidence: {confidence:.2f})")

if __name__ == "__main__":
    test_semantic_analysis()
    test_concept_extraction()
    test_bloom_detection()
    print("\n🎉 Testing complete!")
