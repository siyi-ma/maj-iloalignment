#!/usr/bin/env python3
"""
Simplified AI Enhancement Server for Railway deployment
"""

from flask import Flask, request, jsonify
import os

app = Flask(__name__)

# Simple CORS headers manually added to each response
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
        'message': 'AI Enhancement Server is running',
        'version': '1.0.0'
    })

@app.route('/analyze', methods=['POST', 'OPTIONS'])
def analyze():
    """Simple analysis endpoint"""
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
                'error': 'PLO text and MLO text are required'
            }), 400
        
        # Simple keyword matching
        plo_words = set(plo_text.lower().split())
        mlo_words = set(mlo_text.lower().split())
        common_words = plo_words.intersection(mlo_words)
        
        # Calculate enhanced score
        if len(plo_words) == 0 and len(mlo_words) == 0:
            word_overlap = 0
        else:
            word_overlap = len(common_words) / max(len(plo_words), len(mlo_words), 1)
        
        confidence = min(0.9, 0.5 + word_overlap * 0.4)
        enhanced_score = min(5, max(1, original_score + word_overlap * 2))
        
        return jsonify({
            'success': True,
            'enhanced_score': round(enhanced_score, 1),
            'confidence': round(confidence, 2),
            'reasoning': f'Found {len(common_words)} common keywords: {", ".join(list(common_words)[:3])}. Enhanced alignment analysis.',
            'keywords': list(common_words)[:5],  # Top 5 keywords
            'original_score': original_score,
            'word_overlap': round(word_overlap, 2)
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Analysis failed: {str(e)}'
        }), 500

@app.route('/', methods=['GET'])
def home():
    """Root endpoint"""
    return jsonify({
        'message': 'AI Enhancement Server',
        'endpoints': ['/status', '/analyze']
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
