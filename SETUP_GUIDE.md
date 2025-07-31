# 🚀 Enhanced PLO-MLO Analysis Setup Guide

## 📋 **Quick Start Installation**

### **1. Install Core Dependencies**
```bash
# Basic requirements
pip install flask flask-cors

# AI/ML capabilities (choose based on your needs)
pip install langextract                    # Google's structured extraction (Recommended)
pip install sentence-transformers torch   # Semantic similarity
pip install spacy                         # Advanced NLP
python -m spacy download en_core_web_sm   # English language model
```

### **2. Setup API Keys**
```bash
# For LangExtract (uses Google Gemini)
export LANGEXTRACT_API_KEY="your-gemini-api-key"

# Get free API key from: https://aistudio.google.com/app/apikey
```

### **3. Run Enhanced Analysis Server**
```bash
python enhanced_api_server.py
```

Server will start at `http://localhost:5000` with API documentation.

---

## 🎯 **Integration Options**

### **Option 1: Full AI Enhancement (Recommended)**
**Best performance, requires API key**
```bash
pip install langextract sentence-transformers spacy torch
export LANGEXTRACT_API_KEY="your-key"
python enhanced_api_server.py
```

**Features:**
- ✅ Structured concept extraction
- ✅ Semantic similarity analysis  
- ✅ Bloom's taxonomy mapping
- ✅ AI-powered improvement suggestions
- ✅ Educational competency detection

### **Option 2: Privacy-First (Local Models)**
**No external API calls, runs entirely offline**
```bash
pip install sentence-transformers spacy torch
python enhanced_api_server.py
```

**Features:**
- ✅ Local semantic similarity
- ✅ NLP-based concept extraction
- ✅ Privacy-compliant analysis
- ❌ Limited concept recognition
- ❌ No LLM-powered insights

### **Option 3: Minimal Enhancement**
**Basic setup, fallback to traditional analysis**
```bash
pip install flask flask-cors
python enhanced_api_server.py
```

**Features:**
- ✅ API infrastructure ready
- ✅ Graceful fallback to traditional scoring
- ❌ No AI enhancements
- ❌ Limited analysis capabilities

---

## 🔧 **Frontend Integration**

### **Add to your HTML:**
```html
<!-- Add before closing </body> tag -->
<script src="enhanced_frontend_integration.js"></script>
```

### **Update existing JavaScript:**
The enhanced integration automatically overrides your existing `getAlignmentScore` function to use AI analysis when available, with seamless fallback to traditional scoring.

---

## 📊 **What You Get**

### **Enhanced Scoring Algorithm:**
```
Final Score = (Traditional × 30%) + (Semantic × 40%) + (Concept × 30%)
```

### **AI-Powered Features:**
1. **Concept Extraction**: Identifies competencies, skills, knowledge domains
2. **Bloom's Taxonomy Mapping**: Automatically maps cognitive levels
3. **Semantic Similarity**: Beyond keyword matching
4. **Smart Justifications**: Context-aware explanations
5. **Actionable Improvements**: Specific, pedagogically-sound suggestions

### **Visual Enhancements:**
- 🎨 Concept visualization with Bloom's level color coding
- 📊 Multi-dimensional score breakdown
- 🔍 Evidence highlighting and source grounding
- 💡 AI-generated improvement recommendations

---

## 🧪 **Testing the Integration**

### **1. Start the API server:**
```bash
python enhanced_api_server.py
```

### **2. Test API health:**
```bash
curl http://localhost:5000/api/health
```

### **3. Test enhanced analysis:**
```bash
curl -X POST http://localhost:5000/api/enhanced-analysis \
  -H "Content-Type: application/json" \
  -d '{
    "plo_text": "Students will analyze sustainable business models",
    "mlo_text": "Conduct case study analysis of green startups"
  }'
```

### **4. Open your PLO-MLO tool:**
The frontend will automatically detect and use the enhanced API when available.

---

## 🔐 **Privacy & Security Considerations**

### **Data Privacy:**
- **LangExtract**: Sends text to Google Gemini API
- **Local Models**: All processing on your server
- **Caching**: Results cached locally for performance

### **For Sensitive Academic Content:**
1. Use Option 2 (Local Models Only)
2. Deploy on internal network
3. No external API calls required

### **API Key Security:**
```bash
# Use environment variables
export LANGEXTRACT_API_KEY="your-key"

# Or create .env file:
echo "LANGEXTRACT_API_KEY=your-key" > .env
```

---

## 🚀 **Performance Optimization**

### **Production Deployment:**
```bash
# Use production WSGI server
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 enhanced_api_server:app
```

### **Batch Processing:**
```javascript
// Analyze multiple PLO-MLO pairs efficiently
fetch('/api/batch-analysis', {
  method: 'POST',
  body: JSON.stringify({
    analyses: [
      {id: 'plo1-mlo1', plo_text: '...', mlo_text: '...'},
      {id: 'plo1-mlo2', plo_text: '...', mlo_text: '...'},
      // ... more pairs
    ]
  })
})
```

### **Caching Strategy:**
- Results cached in frontend for session
- Server-side caching available
- Reduces API calls and improves responsiveness

---

## 🛠 **Customization Options**

### **Educational Domain Adaptation:**
Modify `enhanced_analysis_backend.py` to customize:
- Competency categories for your institution
- Bloom's taxonomy emphasis
- Domain-specific terminology
- Assessment method recognition

### **Scoring Weight Adjustment:**
```python
# In EnhancedPLOMLOAnalyzer.calculate_weighted_score()
weights = {
    'traditional': 0.2,  # Reduce keyword emphasis
    'semantic': 0.5,     # Increase semantic importance  
    'concept': 0.3       # Educational concept focus
}
```

### **Custom Improvement Suggestions:**
Add institution-specific guidance in `generateEnhancedImprovements()` function.

---

## 📞 **Support & Troubleshooting**

### **Common Issues:**

**1. "LangExtract not available"**
```bash
pip install langextract
export LANGEXTRACT_API_KEY="your-key"
```

**2. "Semantic analysis failed"**
```bash
pip install sentence-transformers torch
# May require restart after installation
```

**3. "API request failed"**
- Check if server is running: `curl http://localhost:5000/api/health`
- Verify API key is set correctly
- Check server logs for detailed errors

**4. "Frontend integration not working"**
- Ensure `enhanced_frontend_integration.js` is loaded
- Check browser console for errors
- Verify API server is accessible from frontend

### **Getting Help:**
- Check server logs for detailed error messages
- Test individual API endpoints
- Verify all dependencies are installed correctly

---

## 🎓 **Educational Benefits**

### **For Curriculum Designers:**
- **Deeper Insights**: Beyond keyword matching to conceptual alignment
- **Evidence-Based**: AI identifies specific textual evidence
- **Actionable Guidance**: Concrete steps for improvement
- **Consistency**: Standardized analysis across all modules

### **For Academic Quality Assurance:**
- **Comprehensive Coverage**: Identifies gaps in competency development
- **Bloom's Alignment**: Ensures appropriate cognitive progression
- **Assessment Matching**: Links outcomes to appropriate evaluation methods
- **Continuous Improvement**: Data-driven curriculum enhancement

This enhancement transforms your PLO-MLO alignment tool from a simple keyword matcher into an intelligent curriculum analysis system! 🎯
