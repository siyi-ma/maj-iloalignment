"""
Setup Script for Enhanced PLO-MLO Analysis
Handles initial configuration and dependency installation
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

def install_requirements():
    """Install required packages"""
    requirements = [
        "flask",
        "flask-cors",
        "python-dotenv"
    ]
    
    # PyTorch installation (CPU-only for Windows compatibility)
    pytorch_requirements = [
        "torch==2.1.0+cpu",
        "torchvision==0.16.0+cpu", 
        "torchaudio==2.1.0+cpu"
    ]
    
    optional_requirements = [
        "langextract",
        "sentence-transformers",
        "spacy"
    ]
    
    print("Installing basic requirements...")
    for package in requirements:
        try:
            subprocess.check_call([sys.executable, "-m", "pip", "install", package])
            print(f"✅ Installed {package}")
        except subprocess.CalledProcessError:
            print(f"❌ Failed to install {package}")
            return False
    
    print("\nInstalling PyTorch (CPU version for Windows compatibility)...")
    try:
        # Install PyTorch from specific index for CPU version
        cmd = [sys.executable, "-m", "pip", "install"] + pytorch_requirements + ["--index-url", "https://download.pytorch.org/whl/cpu"]
        subprocess.check_call(cmd)
        print("✅ Installed PyTorch CPU version")
    except subprocess.CalledProcessError:
        print("⚠️  Failed to install PyTorch - trying alternative approach...")
        try:
            # Fallback: install regular torch (might work on some systems)
            subprocess.check_call([sys.executable, "-m", "pip", "install", "torch", "torchvision", "torchaudio"])
            print("✅ Installed PyTorch (fallback)")
        except subprocess.CalledProcessError:
            print("⚠️  PyTorch installation failed - some AI features may be limited")
    
    print("\nInstalling optional AI packages (this may take a while)...")
    for package in optional_requirements:
        try:
            subprocess.check_call([sys.executable, "-m", "pip", "install", package])
            print(f"✅ Installed {package}")
        except subprocess.CalledProcessError:
            print(f"⚠️  Failed to install {package} - some features may be limited")
    
    # Install spaCy model
    try:
        subprocess.check_call([sys.executable, "-m", "spacy", "download", "en_core_web_sm"])
        print("✅ Installed spaCy English model")
    except subprocess.CalledProcessError:
        print("⚠️  Failed to install spaCy English model")
    
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
    else:
        print(f"✅ Environment file already exists: {env_file}")

def test_configuration():
    """Test if configuration is working"""
    try:
        from secure_config import validate_setup, get_api_key
        
        is_valid, message = validate_setup()
        if is_valid:
            api_key = get_api_key()
            if api_key and api_key != "your_gemini_api_key_here":
                print("✅ Configuration test passed - API key loaded successfully")
                return True
            else:
                print("⚠️  Configuration incomplete - please set your API key in .env file")
                return False
        else:
            print(f"❌ Configuration test failed: {message}")
            return False
    except ImportError as e:
        print(f"❌ Configuration test failed: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error during configuration test: {e}")
        print("This might be due to missing dependencies - continuing anyway...")
        return False

def main():
    """Main setup function"""
    print("🚀 Enhanced PLO-MLO Analysis Setup")
    print("="*50)
    
    # Check Python version
    if not check_python_version():
        return False
    
    # Install requirements
    if not install_requirements():
        return False
    
    # Setup environment
    setup_environment()
    
    # Test configuration
    test_configuration()
    
    print("\n" + "="*50)
    print("🎉 SETUP COMPLETE!")
    print("="*50)
    print("\nNext steps:")
    print("1. If you haven't added your API key, edit .env file")
    print("2. Run: python enhanced_api_server.py")
    print("3. Open your browser to: http://localhost:5000")
    print("\nFor more help, see: API_KEY_SECURITY.md")
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
