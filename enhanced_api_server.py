"""
Flask API Server for Enhanced PLO-MLO Analysis
Provides REST endpoints for AI-powered curriculum analysis
"""

from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS
import asyncio
import logging
from threading import Thread
import os
from datetime import datetime

# Import secure configuration
from secure_config import get_api_key, validate_setup, config

# Import our enhanced analysis backend
from enhanced_analysis_backend import AnalysisAPI, EnhancedPLOMLOAnalyzer

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend integration

# Initialize analysis API
analysis_api = AnalysisAPI()

# Global event loop for async operations
loop = None

def setup_event_loop():
    """Setup asyncio event loop for the Flask app"""
    global loop
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    Thread(target=loop.run_forever, daemon=True).start()

def run_async(coro):
    """Run async function in the event loop"""
    future = asyncio.run_coroutine_threadsafe(coro, loop)
    return future.result(timeout=30)  # 30 second timeout

@app.route('/')
def index():
    """API documentation and health check"""
    return render_template_string("""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Enhanced PLO-MLO Analysis API</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .endpoint { background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 5px; }
            .method { background: #007bff; color: white; padding: 3px 8px; border-radius: 3px; font-size: 0.8em; }
            .path { font-family: monospace; color: #28a745; }
            .status { color: {{ 'green' if api_status['healthy'] else 'red' }}; }
        </style>
    </head>
    <body>
        <h1>🚀 Enhanced PLO-MLO Analysis API</h1>
        
        <div class="status">
            <h2>API Status: {{ 'Healthy ✅' if api_status['healthy'] else 'Issues ❌' }}</h2>
            <ul>
                <li>LangExtract: {{ '✅ Available' if api_status['langextract'] else '❌ Not Available' }}</li>
                <li>Transformers: {{ '✅ Available' if api_status['transformers'] else '❌ Not Available' }}</li>
                <li>spaCy: {{ '✅ Available' if api_status['spacy'] else '❌ Not Available' }}</li>
            </ul>
        </div>

        <h2>📡 API Endpoints</h2>
        
        <div class="endpoint">
            <span class="method">POST</span> 
            <span class="path">/api/enhanced-analysis</span>
            <p><strong>Enhanced PLO-MLO Alignment Analysis</strong></p>
            <p>Performs comprehensive analysis using multiple AI approaches including semantic similarity, concept extraction, and Bloom's taxonomy mapping.</p>
            <pre>{
  "plo_text": "Programme learning outcome text",
  "mlo_text": "Module learning outcome text",
  "analysis_options": {
    "include_concepts": true,
    "include_bloom_mapping": true,
    "include_recommendations": true
  }
}</pre>
        </div>

        <div class="endpoint">
            <span class="method">POST</span> 
            <span class="path">/api/batch-analysis</span>
            <p><strong>Batch Analysis for Multiple PLO-MLO Pairs</strong></p>
            <p>Analyze multiple PLO-MLO combinations in a single request for efficiency.</p>
        </div>

        <div class="endpoint">
            <span class="method">GET</span> 
            <span class="path">/api/health</span>
            <p><strong>Health Check</strong></p>
            <p>Returns API health status and available capabilities.</p>
        </div>

        <div class="endpoint">
            <span class="method">POST</span> 
            <span class="path">/api/concept-extraction</span>
            <p><strong>Educational Concept Extraction</strong></p>
            <p>Extract educational concepts, competencies, and skills from text using LangExtract.</p>
        </div>

        <h2>🔧 Setup Instructions</h2>
        <ol>
            <li>Install dependencies: <code>pip install langextract sentence-transformers spacy flask flask-cors</code></li>
            <li>Download spaCy model: <code>python -m spacy download en_core_web_sm</code></li>
            <li>Set LangExtract API key: <code>export LANGEXTRACT_API_KEY="your-gemini-api-key"</code></li>
            <li>Run server: <code>python enhanced_api_server.py</code></li>
        </ol>

        <p><em>Generated at {{ timestamp }}</em></p>
    </body>
    </html>
    """, api_status=get_api_status(), timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S"))

@app.route('/api/health')
def health_check():
    """Health check endpoint"""
    status = get_api_status()
    return jsonify({
        'status': 'healthy' if status['healthy'] else 'degraded',
        'capabilities': status,
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/enhanced-analysis', methods=['POST'])
def enhanced_analysis():
    """Main enhanced analysis endpoint"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400
        
        # Validate required fields
        if 'plo_text' not in data or 'mlo_text' not in data:
            return jsonify({'error': 'Missing plo_text or mlo_text'}), 400
        
        # Run async analysis
        result = run_async(analysis_api.analyze_alignment(data))
        
        if 'error' in result:
            return jsonify(result), 500
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Enhanced analysis error: {str(e)}")
        return jsonify({'error': f'Analysis failed: {str(e)}'}), 500

@app.route('/api/batch-analysis', methods=['POST'])
def batch_analysis():
    """Batch analysis for multiple PLO-MLO pairs"""
    try:
        data = request.get_json()
        
        if not data or 'analyses' not in data:
            return jsonify({'error': 'Missing analyses array'}), 400
        
        analyses = data['analyses']
        results = []
        
        for i, analysis_data in enumerate(analyses):
            try:
                # Add identifier for tracking
                analysis_data['id'] = analysis_data.get('id', f'analysis_{i}')
                
                # Run analysis
                result = run_async(analysis_api.analyze_alignment(analysis_data))
                result['id'] = analysis_data['id']
                results.append(result)
                
            except Exception as e:
                logger.error(f"Batch analysis item {i} failed: {str(e)}")
                results.append({
                    'id': analysis_data.get('id', f'analysis_{i}'),
                    'error': str(e)
                })
        
        return jsonify({
            'success': True,
            'results': results,
            'total': len(analyses),
            'successful': len([r for r in results if 'error' not in r])
        })
        
    except Exception as e:
        logger.error(f"Batch analysis error: {str(e)}")
        return jsonify({'error': f'Batch analysis failed: {str(e)}'}), 500

@app.route('/api/concept-extraction', methods=['POST'])
def concept_extraction():
    """Educational concept extraction endpoint"""
    try:
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({'error': 'Missing text field'}), 400
        
        # Initialize analyzer for concept extraction
        analyzer = EnhancedPLOMLOAnalyzer()
        
        # Extract concepts
        concept_result = run_async(
            analyzer.concept_extraction_analysis(data['text'], data.get('context_text', ''))
        )
        
        return jsonify({
            'success': True,
            'extracted_concepts': concept_result['extracted_concepts'],
            'bloom_mapping': concept_result['bloom_mapping'],
            'evidence': concept_result['evidence']
        })
        
    except Exception as e:
        logger.error(f"Concept extraction error: {str(e)}")
        return jsonify({'error': f'Concept extraction failed: {str(e)}'}), 500

@app.route('/api/semantic-similarity', methods=['POST'])
def semantic_similarity():
    """Semantic similarity calculation endpoint"""
    try:
        data = request.get_json()
        
        if not data or 'text1' not in data or 'text2' not in data:
            return jsonify({'error': 'Missing text1 or text2 fields'}), 400
        
        analyzer = EnhancedPLOMLOAnalyzer()
        
        # Calculate semantic similarity
        similarity_score = run_async(
            analyzer.semantic_similarity_analysis(data['text1'], data['text2'])
        )
        
        return jsonify({
            'success': True,
            'similarity_score': similarity_score,
            'similarity_percentage': (similarity_score / 5) * 100
        })
        
    except Exception as e:
        logger.error(f"Semantic similarity error: {str(e)}")
        return jsonify({'error': f'Semantic similarity calculation failed: {str(e)}'}), 500

def get_api_status():
    """Get current API capabilities status"""
    try:
        # Check LangExtract
        langextract_available = False
        try:
            import langextract
            langextract_available = True
        except ImportError:
            pass
        
        # Check Transformers
        transformers_available = False
        try:
            from sentence_transformers import SentenceTransformer
            transformers_available = True
        except ImportError:
            pass
        
        # Check spaCy
        spacy_available = False
        try:
            import spacy
            spacy_available = True
        except ImportError:
            pass
        
        return {
            'healthy': langextract_available or transformers_available,
            'langextract': langextract_available,
            'transformers': transformers_available,
            'spacy': spacy_available
        }
    except Exception:
        return {
            'healthy': False,
            'langextract': False,
            'transformers': False,
            'spacy': False
        }

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    # Validate configuration
    is_valid, message = validate_setup()
    if not is_valid:
        print(f"Configuration Error: {message}")
        print("Please check API_KEY_SECURITY.md for setup instructions")
        exit(1)
    
    # Test API key access
    api_key = get_api_key()
    if not api_key:
        print("Error: Could not load API key")
        print("Please check your .env file or environment variables")
        exit(1)
    
    print(f"Configuration loaded successfully!")
    print(f"Using API endpoint: {config.get('api_endpoint', 'default')}")
    print(f"Model: {config.get('model', 'default')}")
    
    # Setup async event loop
    setup_event_loop()
    
    # Get configuration from environment
    host = os.getenv('FLASK_HOST', '127.0.0.1')
    port = int(os.getenv('FLASK_PORT', 5000))
    debug = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    
    logger.info(f"Starting Enhanced PLO-MLO Analysis API server...")
    logger.info(f"Server will be available at: http://{host}:{port}")
    logger.info(f"API Documentation: http://{host}:{port}/")
    
    # Check API capabilities
    status = get_api_status()
    logger.info(f"API Capabilities: {status}")
    
    if not status['healthy']:
        logger.warning("⚠️  Limited functionality: Install langextract or sentence-transformers for full capabilities")
        logger.info("Install with: pip install langextract sentence-transformers spacy")
    else:
        logger.info("✅ Enhanced analysis capabilities available")
    
    # Start Flask server
    app.run(host=host, port=port, debug=debug, threaded=True)
