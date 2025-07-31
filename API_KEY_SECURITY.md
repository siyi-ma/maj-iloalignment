# 🔐 Secure API Key Management Guide

## 🎯 **Quick Setup (Recommended Method)**

### **Step 1: Create Your .env File**
```bash
# Copy the example file
cp .env.example .env

# Edit with your actual API key
notepad .env  # Windows
nano .env     # Linux/Mac
```

### **Step 2: Add Your Gemini API Key**
Edit `.env` file and replace `your_gemini_api_key_here` with your actual key:
```
LANGEXTRACT_API_KEY=AIzaSyC8UZ6N5Q9hX7vY2nF1wB3kM4pR8sT6nL9
```

### **Step 3: Verify Security**
✅ `.env` file is in `.gitignore` (already done)  
✅ Never commit `.env` to version control  
✅ Share only `.env.example` with your team  

---

## 🛡️ **Security Methods Comparison**

| Method | Security | Ease of Use | Team Sharing | Production Ready |
|--------|----------|-------------|--------------|------------------|
| **.env file** | ✅ High | ✅ Easy | ✅ Good | ✅ Yes |
| **Environment Variables** | ✅ Highest | ⚠️ Medium | ⚠️ Complex | ✅ Yes |
| **Config Files** | ⚠️ Medium | ✅ Easy | ❌ Risky | ❌ No |
| **Hardcoded** | ❌ Dangerous | ✅ Easy | ❌ Very Risky | ❌ Never |

---

## 📋 **Detailed Setup Instructions**

### **Method 1: .env File (Recommended)**

**1. Create .env file:**
```bash
# Create the file (if not exists)
touch .env  # Linux/Mac
type nul > .env  # Windows
```

**2. Add your keys:**
```bash
# Edit the file
LANGEXTRACT_API_KEY=your_actual_gemini_api_key_here
FLASK_DEBUG=false
FLASK_HOST=127.0.0.1
FLASK_PORT=5000
```

**3. Test the configuration:**
```bash
python secure_config.py
```

### **Method 2: Environment Variables**

**Windows:**
```cmd
# Temporary (current session)
set LANGEXTRACT_API_KEY=your_gemini_api_key_here

# Permanent (system-wide)
setx LANGEXTRACT_API_KEY "your_gemini_api_key_here"
```

**Linux/Mac:**
```bash
# Temporary (current session)
export LANGEXTRACT_API_KEY="your_gemini_api_key_here"

# Permanent (add to ~/.bashrc or ~/.zshrc)
echo 'export LANGEXTRACT_API_KEY="your_gemini_api_key_here"' >> ~/.bashrc
source ~/.bashrc
```

**PowerShell:**
```powershell
# Temporary
$env:LANGEXTRACT_API_KEY="your_gemini_api_key_here"

# Permanent (user profile)
[Environment]::SetEnvironmentVariable("LANGEXTRACT_API_KEY", "your_gemini_api_key_here", "User")
```

---

## 🔧 **Integration with Your Code**

### **Update enhanced_api_server.py:**
```python
# Add at the top of the file
from secure_config import get_api_key, validate_setup, config

# Update the LangExtract usage
if LANGEXTRACT_AVAILABLE and validate_setup():
    # API key will be automatically loaded
    result = lx.extract(
        text_or_documents=plo_text,
        prompt_description=self.educational_prompt,
        examples=self.examples,
        model_id="gemini-2.5-flash",
        api_key=get_api_key('gemini')  # Securely loaded
    )
```

### **Test Configuration:**
```python
# Test your setup
python secure_config.py

# Should show:
# ✅ GEMINI API Key: Configured
# ✅ Configuration is ready for AI-enhanced analysis!
```

---

## 🚨 **Security Best Practices**

### **✅ DO:**
- Use `.env` files for development
- Use environment variables for production
- Keep `.env` in `.gitignore`
- Share only `.env.example` with your team
- Use different keys for development/production
- Regularly rotate API keys
- Limit API key permissions when possible

### **❌ DON'T:**
- Commit API keys to version control
- Hardcode keys in source code
- Share keys in chat/email/documents
- Use production keys for development
- Store keys in comments or documentation
- Include keys in screenshots or logs

---

## 🔍 **Troubleshooting**

### **"API key not found" errors:**

**1. Check if .env file exists:**
```bash
ls -la .env  # Should show the file
```

**2. Verify .env content:**
```bash
cat .env  # Should show your configuration
```

**3. Test configuration loading:**
```bash
python secure_config.py
```

**4. Check environment variables:**
```bash
# Windows
echo %LANGEXTRACT_API_KEY%

# Linux/Mac
echo $LANGEXTRACT_API_KEY
```

### **"Permission denied" errors:**
```bash
# Fix file permissions (Linux/Mac)
chmod 600 .env  # Only owner can read/write
```

### **"Configuration not loading" errors:**
```bash
# Ensure you're in the right directory
pwd
ls -la .env

# Check Python path
python -c "import os; print(os.getcwd())"
```

---

## 🌐 **Team Collaboration**

### **For Team Members:**

**1. Clone the repository:**
```bash
git clone your-repo-url
cd maj-iloalignment
```

**2. Copy the example environment:**
```bash
cp .env.example .env
```

**3. Get API key from team lead:**
- Request Gemini API key
- Add to your local `.env` file
- Never commit this file

**4. Verify setup:**
```bash
python secure_config.py
```

### **For Team Leads:**

**1. Share setup instructions:**
- Provide this guide to team members
- Share `.env.example` (safe to commit)
- Distribute API keys securely (not via git)

**2. Production deployment:**
- Use environment variables on server
- Different keys for staging/production
- Implement key rotation policy

---

## 🔄 **Key Rotation**

### **When to rotate:**
- Regularly (every 3-6 months)
- If key might be compromised
- When team members leave
- Before major deployments

### **How to rotate:**
```bash
# 1. Generate new key from Google AI Studio
# 2. Update .env file
LANGEXTRACT_API_KEY=new_key_here

# 3. Test the new key
python secure_config.py

# 4. Update production environment
# 5. Revoke old key
```

---

## 🎯 **Production Deployment**

### **Docker:**
```dockerfile
# In your Dockerfile
ENV LANGEXTRACT_API_KEY=""

# Run with:
docker run -e LANGEXTRACT_API_KEY="your-key" your-app
```

### **Cloud Platforms:**

**Heroku:**
```bash
heroku config:set LANGEXTRACT_API_KEY="your-key"
```

**AWS:**
```bash
# Use AWS Secrets Manager or Parameter Store
aws ssm put-parameter --name "/myapp/langextract-key" --value "your-key" --type "SecureString"
```

**Azure:**
```bash
# Use Azure Key Vault
az keyvault secret set --vault-name "mykeyvault" --name "langextract-key" --value "your-key"
```

This comprehensive security setup ensures your Gemini API key is protected while remaining easy to use for development and scalable for production! 🛡️
