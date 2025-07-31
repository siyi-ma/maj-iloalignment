#!/usr/bin/env python3
"""
Quick Start Script for Enhanced PLO-MLO Analysis
Bypasses PyTorch issues by using the PyTorch-free version
"""

import os
import sys
import subprocess
from pathlib import Path

def check_configuration():
    """Check if configuration is ready"""
    print("🔧 Checking configuration...")
    try:
        result = subprocess.run([sys.executable, "secure_config.py"], 
                              capture_output=True, text=True, timeout=30)
        if result.returncode == 0:
            print("✅ Configuration OK")
            return True
        else:
            print(f"⚠️  Configuration issues: {result.stderr}")
            return False
    except Exception as e:
        print(f"❌ Configuration check failed: {e}")
        return False

def test_backend():
    """Test if PyTorch-free backend works"""
    print("🧪 Testing PyTorch-free backend...")
    try:
        result = subprocess.run([
            sys.executable, "-c", 
            "import pytorch_free_backend; print('Backend ready!')"
        ], capture_output=True, text=True, timeout=30)
        
        if result.returncode == 0:
            print("✅ PyTorch-free backend ready!")
            return True
        else:
            print(f"❌ Backend test failed: {result.stderr}")
            return False
    except Exception as e:
        print(f"❌ Backend test error: {e}")
        return False

def start_server():
    """Start the PyTorch-free server"""
    print("\n🚀 Starting Enhanced PLO-MLO Analysis Server (PyTorch-Free)")
    print("=" * 60)
    print("🌐 Server will be available at: http://localhost:5000")
    print("📖 API documentation at: http://localhost:5000")
    print("⏹️  Press Ctrl+C to stop the server")
    print("=" * 60)
    print()
    
    try:
        subprocess.run([sys.executable, "pytorch_free_server.py"])
    except KeyboardInterrupt:
        print("\n👋 Server stopped by user")
    except Exception as e:
        print(f"\n❌ Server error: {e}")

def main():
    """Main startup function"""
    print("🚀 Enhanced PLO-MLO Analysis - Quick Start")
    print("=" * 50)
    
    # Check if we're in the right directory
    if not Path("pytorch_free_server.py").exists():
        print("❌ Error: Not in the correct directory")
        print("Please run this script from the project root directory")
        return False
    
    # Check configuration
    config_ok = check_configuration()
    
    # Test backend
    backend_ok = test_backend()
    
    if not backend_ok:
        print("\n❌ Backend test failed. Trying to install required packages...")
        try:
            subprocess.run([sys.executable, "-m", "pip", "install", "flask", "flask-cors", "python-dotenv"])
            backend_ok = test_backend()
        except Exception as e:
            print(f"❌ Package installation failed: {e}")
    
    if not config_ok:
        print("\n⚠️  Configuration issues detected, but server will start with limited functionality")
    
    if backend_ok:
        start_server()
    else:
        print("\n❌ Cannot start server - backend test failed")
        print("Try running: pip install flask flask-cors python-dotenv")
        return False
    
    return True

if __name__ == "__main__":
    success = main()
    if not success:
        input("Press Enter to exit...")
    sys.exit(0 if success else 1)
