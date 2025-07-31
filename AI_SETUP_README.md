# Enhanced PLO-MLO Analysis with AI

This project enhances the PLO-MLO alignment tool with AI-powered analysis capabilities.

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

```bash
python setup.py
```

This will:
- Install all required packages
- Set up your environment configuration
- Guide you through API key setup
- Test your configuration

### Option 2: Manual Setup

1. **Install Dependencies**
   ```bash
   pip install flask flask-cors python-dotenv
   pip install langextract sentence-transformers spacy torch
   python -m spacy download en_core_web_sm
   ```

2. **Configure API Key**
   ```bash
   # Copy the example environment file
   copy .env.example .env
   
   # Edit .env and add your Gemini API key
   # Get your key at: https://aistudio.google.com/app/apikey
   ```

3. **Test Configuration**
   ```bash
   python secure_config.py
   ```

4. **Start the Server**
   ```bash
   python enhanced_api_server.py
   ```

## 🔐 API Key Security

Your Gemini API key is kept secure using:

- ✅ Environment variables (`.env` file)
- ✅ Excluded from git (`.gitignore`)
- ✅ Validation and error handling
- ✅ Production deployment support

**Never commit your API key to version control!**

See `API_KEY_SECURITY.md` for detailed security information.

## 🤖 AI Features

### Current Capabilities

1. **Structured Information Extraction** (LangExtract)
   - Extract learning objectives and outcomes
   - Identify educational concepts and skills
   - Parse assessment criteria

2. **Semantic Similarity Analysis** (Sentence Transformers)
   - Calculate meaning-based similarity scores
   - Compare learning objectives semantically
   - Cross-language concept matching

3. **Educational NLP** (spaCy)
   - Advanced text processing
   - Educational concept recognition
   - Bloom's taxonomy mapping

### Enhanced Analysis Features

- **Multi-dimensional scoring**: Combines multiple AI approaches
- **Educational context awareness**: Understands PLO/MLO relationships
- **Bilingual support**: Works with Estonian and English content
- **Confidence scoring**: Provides reliability metrics
- **Improvement suggestions**: AI-powered recommendations

## 📊 API Endpoints

- `GET /` - API documentation and status
- `POST /analyze` - Enhanced PLO-MLO analysis
- `GET /status` - Check AI capabilities
- `POST /batch-analyze` - Batch processing

## 🛠️ Development

### Project Structure

```
├── plo-mlo-alignment.html     # Main frontend interface
├── enhanced_api_server.py     # Flask API server
├── enhanced_analysis_backend.py # AI analysis engine
├── secure_config.py          # Secure configuration management
├── setup.py                  # Automated setup script
├── .env.example              # Environment template
├── .gitignore                # Security exclusions
└── API_KEY_SECURITY.md       # Security documentation
```

### Adding New AI Features

1. **Extend the AnalysisAPI class** in `enhanced_analysis_backend.py`
2. **Add new endpoints** in `enhanced_api_server.py`
3. **Update frontend integration** in `enhanced_frontend_integration.js`
4. **Test with secure configuration**

### Testing

```bash
# Test configuration
python secure_config.py

# Test API server
python enhanced_api_server.py

# Test individual components
python -c "from enhanced_analysis_backend import AnalysisAPI; print('Backend OK')"
```

## 🚨 Troubleshooting

### Common Issues

1. **"Import langextract could not be resolved"**
   - This is a linting warning, the code handles missing packages gracefully
   - Install with: `pip install langextract`

2. **"Configuration Error: API key not found"**
   - Check your `.env` file exists and contains `GEMINI_API_KEY=your_key_here`
   - Make sure `.env` is in the project root directory

3. **"Limited functionality" warning**
   - Some AI packages are optional for graceful degradation
   - Install missing packages: `pip install sentence-transformers spacy`

4. **Server won't start**
   - Check if port 5000 is available
   - Try: `set FLASK_PORT=5001` and restart

### Getting Help

1. Check `API_KEY_SECURITY.md` for configuration issues
2. Run `python setup.py` to reset configuration
3. Check the console output for specific error messages
4. Ensure all required packages are installed

## 📈 Performance Notes

- **Initial startup**: First run may be slow due to model downloads
- **Memory usage**: AI models require significant RAM (2-4GB recommended)
- **Processing time**: Complex analysis may take 10-30 seconds
- **Caching**: Results are cached for better performance

## 🔄 Updates and Maintenance

### Updating AI Models

```bash
# Update sentence transformers models
python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('all-MiniLM-L6-v2')"

# Update spaCy models
python -m spacy download en_core_web_sm --upgrade
```

### Configuration Updates

- Monitor API key rotation requirements
- Update model versions as needed
- Check for security updates regularly

---

For technical details and security best practices, see `API_KEY_SECURITY.md`.
