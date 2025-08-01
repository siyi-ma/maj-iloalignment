#!/usr/bin/env python3
"""
Advanced Semantic Analysis Server for Learning Outcomes
Uses sentence transformers and NLP for true semantic understanding
"""

from flask import Flask, request, jsonify
import os
import logging
import asyncio
from semantic_analyzer import SemanticAnalysisAPI

app = Flask(__name__)

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize semantic analyzer
semantic_api = SemanticAnalysisAPI()

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
        'message': 'Semantic Analysis Server is running',
        'version': '2.0.0',
        'features': [
            'Sentence transformer embeddings',
            'Educational concept mapping',
            'Bloom\'s taxonomy analysis',
            'Contextual improvement suggestions'
        ]
    })

@app.route('/analyze', methods=['POST', 'OPTIONS'])
def analyze():
    """Advanced semantic analysis endpoint"""
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
        
        logger.info(f"Analyzing alignment: PLO='{plo_text[:50]}...' MLO='{mlo_text[:50]}...'")
        
        # Run semantic analysis
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        result = loop.run_until_complete(
            semantic_api.analyze_alignment(plo_text, mlo_text, original_score)
        )
        loop.close()
        
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
        concepts = semantic_api.analyzer.educational_concepts
        concept_list = []
        
        for name, concept in concepts.items():
            concept_list.append({
                'name': name,
                'type': concept.type.value,
                'bloom_level': concept.bloom_level.name,
                'weight': concept.weight,
                'synonyms': concept.synonyms,
                'related_concepts': concept.related_concepts
            })
        
        return jsonify({
            'success': True,
            'concepts': concept_list,
            'total_concepts': len(concept_list)
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
        # Sample educational content
        plo_sample = "Students will analyze environmental sustainability frameworks and evaluate lifecycle assessment methodologies to make informed decisions about resource management"
        mlo_sample = "Apply lifecycle assessment tools and methods to evaluate the environmental impact of products and processes in real-world scenarios"
        
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        result = loop.run_until_complete(
            semantic_api.analyze_alignment(plo_sample, mlo_sample, 3.0)
        )
        loop.close()
        
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
        'message': 'Advanced Semantic Analysis Server for Learning Outcomes',
        'version': '2.0.0',
        'description': 'Uses sentence transformers and educational concept mapping for semantic understanding',
        'endpoints': {
            '/status': 'Health check',
            '/analyze': 'POST - Semantic analysis of PLO-MLO alignment',
            '/concepts': 'GET - List available educational concepts',
            '/test': 'GET - Test analysis with sample data'
        },
        'features': [
            'True semantic similarity using sentence transformers',
            'Educational concept knowledge base',
            'Bloom\'s taxonomy cognitive level analysis',
            'Context-specific improvement suggestions',
            'Confidence scoring and detailed reasoning'
        ],
        'usage': {
            'analyze_endpoint': {
                'method': 'POST',
                'url': '/analyze',
                'body': {
                    'plo_text': 'Programme learning outcome text',
                    'mlo_text': 'Module learning outcome text',
                    'original_score': 'Optional: 1-5 original score'
                },
                'response': {
                    'enhanced_score': 'Enhanced 1-5 score',
                    'confidence': 'Analysis confidence 0-1',
                    'reasoning': 'Detailed explanation',
                    'suggestions': 'List of improvement suggestions',
                    'analysis_details': 'Detailed breakdown'
                }
            }
        }
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    logger.info(f"Starting Semantic Analysis Server on port {port}")
    app.run(host='0.0.0.0', port=port, debug=False)
