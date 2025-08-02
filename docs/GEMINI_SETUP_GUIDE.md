# 🤖 Gemini AI Setup Guide

## Quick Setup for AI-Powered CLO Generation

Your Learning Outcomes Alignment System now supports **real Gemini AI integration** for intelligent Course Learning Outcome (CLO) generation! Follow this guide to enable AI features.

## 🚀 **Getting Started**

### **Step 1: Get Your Gemini API Key**

1. **Visit Google AI Studio**: Go to [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
2. **Sign in**: Use your Google account to sign in
3. **Create API Key**: Click "Create API Key" and select your project
4. **Copy the Key**: Copy the generated API key (starts with `AIza...`)

### **Step 2: Configure in Your Application**

1. **Open CLO-MLO Analysis**: Go to `clo-mlo.html` in your application
2. **Click the Settings Icon**: Look for the gear icon (⚙️) in the top-right corner
3. **Enter API Key**: Paste your Gemini API key in the configuration modal
4. **Test Connection**: Click "Test Connection" to verify it works
5. **Save**: Click "Save Configuration" to enable AI features

## ✅ **Verification**

### **Check if Gemini is Working**
- Status should show: **"API key configured"** ✅
- Test connection should return: **"API connection successful"** ✅
- AI CLO generation button should be enabled

### **Troubleshooting**

**❌ "API key test failed"**
- Double-check your API key is correct
- Ensure you have internet connection
- Verify your Google Cloud project has Gemini API enabled

**❌ "Not configured"**
- API key not saved properly
- Try clearing and re-entering the key
- Check browser localStorage is enabled

**❌ "Connection test failed"**
- Network connectivity issue
- API key may have expired or been revoked
- Check Google Cloud Console for API usage limits

## 🔒 **Security & Privacy**

### **Local Storage Only**
- Your API key is stored **only in your browser**
- No data is sent to our servers
- API calls go directly from your browser to Google

### **API Key Safety**
- Never share your API key publicly
- Regenerate if compromised
- Monitor usage in Google Cloud Console

## 🎯 **Using AI-Powered CLO Generation**

### **Smart CLO Creation**
1. **Enter Course Information**: Provide course code, name, and description
2. **Choose AI Generation**: Select "Generate with AI" option
3. **Set CLO Count**: Choose how many CLOs to generate (2-8 recommended)
4. **Generate**: Click "Generate CLOs" and wait for AI processing
5. **Review & Edit**: Review generated CLOs and make adjustments as needed

### **What Makes It Smart**
- **Context Aware**: Uses your programme's MLOs for alignment
- **Bloom's Taxonomy**: Automatically applies appropriate cognitive levels
- **Educational Standards**: Follows academic writing conventions
- **Customizable**: Generate multiple options and pick the best

## 🔄 **Fallback System**

### **No API Key? No Problem!**
- System automatically falls back to **sophisticated local generation**
- Uses advanced algorithms from your original prototype
- Still provides high-quality CLOs based on:
  - Programme MLO analysis
  - Bloom's Taxonomy classification
  - Educational competency mapping
  - Course description analysis

## 💡 **Best Practices**

### **For Optimal AI Results**
1. **Detailed Course Descriptions**: Provide comprehensive course information
2. **Clear Learning Objectives**: Include specific topics and skills
3. **Appropriate CLO Count**: 3-6 CLOs work best for most courses
4. **Review & Customize**: Always review AI-generated content
5. **Iterative Improvement**: Generate multiple times with different descriptions

### **Cost Management**
- Monitor your Google Cloud API usage
- Set billing alerts if needed
- Gemini API has generous free tiers for educational use

## 📊 **Features Comparison**

| Feature | Local Generation | AI-Powered (Gemini) |
|---------|------------------|---------------------|
| Speed | ⚡ 2 seconds | 🤖 5-10 seconds |
| Quality | 📈 High | 🎯 Excellent |
| Customization | 🔧 Template-based | 🎨 Context-aware |
| Cost | 💰 Free | 💳 API usage |
| Offline | ✅ Works offline | ❌ Requires internet |
| Languages | 🇬🇧 English focused | 🌍 Multilingual |

## 🆘 **Support**

### **Need Help?**
- **Documentation**: Check `docs/PROTOTYPE_ANALYSIS.md` for technical details
- **Issues**: Review troubleshooting section above
- **Updates**: Keep your browser updated for best compatibility

### **Advanced Configuration**
For developers wanting to customize the AI integration, see the `generateCLOsWithGemini()` function in `js/mlo-clo.js`.

---

## 🎉 **You're Ready!**

Your system now has **state-of-the-art AI integration** while maintaining all the sophisticated algorithms from your original prototype. Enjoy intelligent CLO generation that understands your educational context!

**Happy Learning Outcome Alignment!** 🎓

---

*Last updated: January 2025 | Built for educational excellence*
