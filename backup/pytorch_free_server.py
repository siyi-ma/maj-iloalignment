"""
PyTorch-Free Flask API Server for Enhanced PLO-MLO Analysis
Provides REST endpoints for AI-powered curriculum analysis without PyTorch dependencies
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

# Import our PyTorch-free analysis backend
from pytorch_free_backend import AnalysisAPI, EnhancedPLOMLOAnalyzer

# Setup Flask app
app = Flask(__name__)
CORS(app)

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global analysis API instance
analysis_api = None

def setup_event_loop():
    """Setup event loop for async operations"""
    try:
        loop = asyncio.get_event_loop()
        if loop.is_closed():
            asyncio.set_event_loop(asyncio.new_event_loop())
    except RuntimeError:
        asyncio.set_event_loop(asyncio.new_event_loop())

def run_async(coro):
    """Helper to run async functions in sync context"""
    try:
        loop = asyncio.get_event_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
    
    return loop.run_until_complete(coro)

@app.route('/')
def index():
    """API documentation and status"""
    html_template = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Enhanced PLO-MLO Analysis API</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .status { padding: 20px; border-radius: 5px; margin: 20px 0; }
            .success { background-color: #d4edda; border: 1px solid #c3e6cb; }
            .warning { background-color: #fff3cd; border: 1px solid #ffeaa7; }
            .error { background-color: #f8d7da; border: 1px solid #f5c6cb; }
            code { background-color: #f4f4f4; padding: 2px 5px; border-radius: 3px; }
            pre { background-color: #f4f4f4; padding: 15px; border-radius: 5px; overflow-x: auto; }
        </style>
    </head>
    <body>
        <h1>🚀 Enhanced PLO-MLO Analysis API</h1>
        <p><strong>Status:</strong> {{ status_message }}</p>
        
        <div class="status {{ status_class }}">
            <h3>🔧 System Status</h3>
            <ul>
                {% for item in status_items %}
                <li>{{ item }}</li>
                {% endfor %}
            </ul>
        </div>

        <h2>📊 API Endpoints</h2>
        
        <h3>POST /analyze</h3>
        <p>Analyze PLO-MLO alignment with AI enhancement</p>
        <pre><code>{
    "plo_text": "Students will be able to design software systems",
    "mlo_text": "Demonstrate software design skills",
    "original_score": 3.5
}</code></pre>

        <h3>GET /status</h3>
        <p>Get API capabilities and status</p>

        <h3>POST /batch-analyze</h3>
        <p>Batch analyze multiple PLO-MLO pairs</p>
        <pre><code>{
    "pairs": [
        {
            "plo_text": "PLO text 1",
            "mlo_text": "MLO text 1", 
            "original_score": 3.0
        }
    ]
}</code></pre>

        <h2>🧪 Quick Test</h2>
        <p>Test the API with a sample request:</p>
        <pre><code>curl -X POST http://localhost:5000/analyze \\
  -H "Content-Type: application/json" \\
  -d '{
    "plo_text": "Students will design software systems",
    "mlo_text": "Demonstrate software design skills",
    "original_score": 3.5
  }'</code></pre>

        <p><strong>Note:</strong> This is a PyTorch-free version for maximum compatibility!</p>
    </body>
    </html>
    """
    
    # Get system status
    capabilities = analysis_api.get_capabilities() if analysis_api else {}
    
    status_items = []
    status_class = "success"
    
    if capabilities.get('api_key_configured'):
        status_items.append("✅ API Key: Configured")
    else:
        status_items.append("⚠️ API Key: Not configured")
        status_class = "warning"
    
    if capabilities.get('secure_config_available'):
        status_items.append("✅ Secure Config: Available")
    else:
        status_items.append("❌ Secure Config: Not available")
    
    status_items.append(f"✅ PyTorch Required: {capabilities.get('pytorch_required', 'Unknown')}")
    status_items.append(f"📊 Available Methods: {', '.join(capabilities.get('available_methods', []))}")
    
    if capabilities.get('langextract_available'):
        status_items.append("✅ LangExtract: Available")
    else:
        status_items.append("⚠️ LangExtract: Not installed (optional)")
    
    if capabilities.get('spacy_available'):
        status_items.append("✅ spaCy: Available")
    else:
        status_items.append("⚠️ spaCy: Not installed (optional)")
    
    status_message = "Ready for AI-enhanced analysis!" if status_class == "success" else "Limited functionality - some features may be unavailable"
    
    return render_template_string(html_template, 
                                status_message=status_message,
                                status_class=status_class,
                                status_items=status_items)

@app.route('/analyze', methods=['POST'])
def analyze():
    """Analyze PLO-MLO alignment"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400
        
        plo_text = data.get('plo_text', '')
        mlo_text = data.get('mlo_text', '')
        original_score = float(data.get('original_score', 0.0))
        
        if not plo_text or not mlo_text:
            return jsonify({'error': 'Both plo_text and mlo_text are required'}), 400
        
        # Perform async analysis
        result = run_async(analysis_api.analyze_plo_mlo_alignment(plo_text, mlo_text, original_score))
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Analysis error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/batch-analyze', methods=['POST'])
def batch_analyze():
    """Batch analyze multiple PLO-MLO pairs"""
    try:
        data = request.get_json()
        
        if not data or 'pairs' not in data:
            return jsonify({'error': 'No pairs data provided'}), 400
        
        pairs = data['pairs']
        results = []
        
        for i, pair in enumerate(pairs):
            try:
                plo_text = pair.get('plo_text', '')
                mlo_text = pair.get('mlo_text', '')
                original_score = float(pair.get('original_score', 0.0))
                
                if plo_text and mlo_text:
                    result = run_async(analysis_api.analyze_plo_mlo_alignment(plo_text, mlo_text, original_score))
                    result['pair_index'] = i
                    results.append(result)
                else:
                    results.append({
                        'pair_index': i,
                        'success': False,
                        'error': 'Missing plo_text or mlo_text'
                    })
            except Exception as e:
                results.append({
                    'pair_index': i,
                    'success': False,
                    'error': str(e)
                })
        
        return jsonify({
            'success': True,
            'results': results,
            'total_pairs': len(pairs),
            'successful_analyses': len([r for r in results if r.get('success')])
        })
        
    except Exception as e:
        logger.error(f"Batch analysis error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/status')
def status():
    """Get API status and capabilities"""
    try:
        capabilities = analysis_api.get_capabilities()
        
        return jsonify({
            'status': 'healthy',
            'version': '1.0.0-pytorch-free',
            'timestamp': datetime.now().isoformat(),
            'capabilities': capabilities
        })
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }), 500

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
        print(f"Configuration Warning: {message}")
        print("Some features may be limited without API key")
    
    # Test API key access
    api_key = get_api_key()
    if api_key:
        print(f"✅ Configuration loaded successfully!")
        print(f"API Key: {api_key[:8]}...{api_key[-4:]}")
    else:
        print("⚠️  No API key found - some features will be limited")
    
    # Setup async event loop
    setup_event_loop()
    
    # Create analysis API instance with secure configuration
    analysis_api = AnalysisAPI(api_key=api_key)
    
    # Get configuration from environment
    host = os.getenv('FLASK_HOST', '127.0.0.1')
    port = int(os.getenv('FLASK_PORT', 5000))
    debug = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    
    print(f"🚀 Starting PyTorch-Free Enhanced PLO-MLO Analysis API server...")
    print(f"📊 Server will be available at: http://{host}:{port}")
    print(f"📖 API Documentation: http://{host}:{port}/")
    
    # Check API capabilities
    capabilities = analysis_api.get_capabilities()
    print(f"🔧 Capabilities: {capabilities}")
    
    if not capabilities['pytorch_required']:
        print("✅ PyTorch-free version - maximum compatibility!")
    
    # Start Flask server
    app.run(host=host, port=port, debug=debug, threaded=True)
