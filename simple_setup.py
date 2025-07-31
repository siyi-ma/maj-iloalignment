"""
Simple Setup Script for Enhanced PLO-MLO Analysis
Focuses on core functionality without complex AI dependencies
"""

import os
import sys
import subprocess
from pathlib import Path

def check_python_version():
    """Check if Python version is compatible"""
    if sys.version_info < (3, 8):
        print("Error: Python 3.8 or higher is required")
        return False
    print(f"✅ Python {sys.version_info.major}.{sys.version_info.minor} detected")
    return True

def install_basic_requirements():
    """Install only basic requirements"""
    requirements = [
        "flask",
        "flask-cors", 
        "python-dotenv"
    ]
    
    print("Installing basic requirements...")
    for package in requirements:
        try:
            subprocess.check_call([sys.executable, "-m", "pip", "install", package])
            print(f"✅ Installed {package}")
        except subprocess.CalledProcessError:
            print(f"❌ Failed to install {package}")
            return False
    
    return True

def setup_environment():
    """Setup environment configuration"""
    env_file = Path(".env")
    env_example = Path(".env.example")
    
    if not env_file.exists() and env_example.exists():
        print("\nSetting up environment configuration...")
        
        # Copy example file
        with open(env_example, 'r') as f:
            content = f.read()
        
        # Prompt for API key
        print("\n" + "="*50)
        print("GEMINI API KEY SETUP")
        print("="*50)
        print("You need a Gemini API key to use AI features.")
        print("Get one at: https://aistudio.google.com/app/apikey")
        print("")
        
        api_key = input("Enter your Gemini API key (or press Enter to skip): ").strip()
        
        if api_key:
            content = content.replace("your_gemini_api_key_here", api_key)
            print("✅ API key configured")
        else:
            print("⚠️  API key skipped - you can add it later to .env file")
        
        # Write .env file
        with open(env_file, 'w') as f:
            f.write(content)
        
        print(f"✅ Created {env_file}")
    elif env_file.exists():
        print(f"✅ Environment file already exists: {env_file}")
    else:
        print("⚠️  .env.example not found - creating basic .env file")
        with open(env_file, 'w') as f:
            f.write("# Enhanced PLO-MLO Analysis Configuration\n")
            f.write("GEMINI_API_KEY=your_gemini_api_key_here\n")
            f.write("FLASK_DEBUG=true\n")
            f.write("FLASK_HOST=127.0.0.1\n")
            f.write("FLASK_PORT=5000\n")

def test_basic_configuration():
    """Test if basic configuration is working"""
    try:
        # Test .env file exists
        env_file = Path(".env")
        if not env_file.exists():
            print("❌ .env file not found")
            return False
            
        # Try to load secure config
        try:
            from secure_config import validate_setup, get_api_key
            
            is_valid, message = validate_setup()
            if is_valid:
                print("✅ Configuration test passed - ready for AI features")
                return True
            else:
                print(f"⚠️  Configuration incomplete: {message}")
                print("You can still use basic features - add API key for AI enhancements")
                return True  # Still allow basic functionality
        except ImportError:
            print("⚠️  secure_config not available - basic setup only")
            return True
            
    except Exception as e:
        print(f"⚠️  Configuration test warning: {e}")
        return True  # Don't fail on configuration issues

def main():
    """Main setup function"""
    print("🚀 Enhanced PLO-MLO Analysis - Basic Setup")
    print("="*50)
    
    # Check Python version
    if not check_python_version():
        return False
    
    # Install basic requirements
    if not install_basic_requirements():
        return False
    
    # Setup environment
    setup_environment()
    
    # Test configuration
    test_basic_configuration()
    
    print("\n" + "="*50)
    print("🎉 BASIC SETUP COMPLETE!")
    print("="*50)
    print("\nNext steps:")
    print("1. Edit .env file and add your Gemini API key")
    print("2. For AI features, run: pip install sentence-transformers spacy")
    print("3. Start the server: python enhanced_api_server.py")
    print("4. Open your browser to: http://localhost:5000")
    print("\nNote: AI features require additional packages.")
    print("Run the full setup.py for complete installation.")
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
