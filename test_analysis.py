#!/usr/bin/env python3
"""
Test script to demonstrate PyTorch-free analysis capabilities
"""

import requests
import json
import sys

def test_analysis():
    """Test the PyTorch-free analysis server"""
    
    # Test data - realistic PLO/MLO examples
    test_cases = [
        {
            "name": "Software Engineering PLO-MLO",
            "plo_text": "Students will be able to design and implement object-oriented software systems using modern programming languages and frameworks",
            "mlo_text": "Demonstrate understanding of object-oriented programming principles through practical software development projects",
            "original_score": 3.5
        },
        {
            "name": "Mathematics PLO-MLO", 
            "plo_text": "Students will apply mathematical modeling techniques to solve real-world engineering problems",
            "mlo_text": "Use calculus and linear algebra to analyze engineering systems and optimize solutions",
            "original_score": 4.0
        },
        {
            "name": "Communication PLO-MLO",
            "plo_text": "Students will communicate technical concepts effectively to diverse audiences",
            "mlo_text": "Present project results through written reports and oral presentations",
            "original_score": 2.5
        }
    ]
    
    print("🧪 Testing PyTorch-Free Enhanced Analysis")
    print("=" * 60)
    
    for i, test_case in enumerate(test_cases, 1):
        print(f"\n📝 Test Case {i}: {test_case['name']}")
        print("-" * 40)
        
        try:
            # Make API request
            response = requests.post(
                'http://localhost:5000/analyze',
                json={
                    'plo_text': test_case['plo_text'],
                    'mlo_text': test_case['mlo_text'], 
                    'original_score': test_case['original_score']
                },
                timeout=10
            )
            
            if response.status_code == 200:
                result = response.json()
                
                print(f"PLO: {test_case['plo_text'][:60]}...")
                print(f"MLO: {test_case['mlo_text'][:60]}...")
                print(f"Original Score: {result['original_score']}")
                print(f"Enhanced Score: {result['enhanced_score']:.2f}")
                print(f"Confidence: {result['confidence']:.2f}")
                print(f"Method: {result['method']}")
                print(f"Keywords Found: {', '.join(result['keywords'][:5])}")
                print(f"Reasoning: {result['reasoning'][:80]}...")
                if result['suggestions']:
                    print(f"Suggestions: {result['suggestions'][0][:60]}...")
                
            else:
                print(f"❌ API Error: {response.status_code}")
                print(response.text)
                
        except requests.exceptions.ConnectionError:
            print("❌ Server not running. Start it with: python pytorch_free_server.py")
            return False
        except Exception as e:
            print(f"❌ Test failed: {e}")
            return False
    
    # Test server capabilities
    print(f"\n🔧 Server Capabilities")
    print("-" * 40)
    
    try:
        response = requests.get('http://localhost:5000/status', timeout=5)
        if response.status_code == 200:
            status = response.json()
            caps = status['capabilities']
            
            print(f"Version: {status['version']}")
            print(f"PyTorch Required: {caps['pytorch_required']}")
            print(f"Available Methods: {', '.join(caps['available_methods'])}")
            print(f"LangExtract Available: {caps['langextract_available']}")
            print(f"spaCy Available: {caps['spacy_available']}")
            print(f"API Key Configured: {caps['api_key_configured']}")
        
    except Exception as e:
        print(f"Could not get server status: {e}")
    
    print(f"\n✅ PyTorch-Free Analysis Test Complete!")
    return True

if __name__ == "__main__":
    success = test_analysis()
    sys.exit(0 if success else 1)
