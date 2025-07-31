# Windows Setup Guide for Enhanced PLO-MLO Analysis

## 🚨 Windows-Specific Issues and Solutions

### Quick Start (Recommended for Windows)

If you're experiencing PyTorch installation issues, use the simple setup first:

```bash
python simple_setup.py
```

This installs only the core requirements and lets you add AI features manually.

### Manual AI Package Installation (Windows)

Due to PyTorch compatibility issues on Windows, install AI packages manually:

#### Step 1: Install PyTorch (CPU version)
```bash
# Install CPU-only PyTorch (avoids CUDA issues)
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
```

#### Step 2: Install Other AI Packages
```bash
# Install sentence transformers
pip install sentence-transformers

# Install spaCy and language model
pip install spacy
python -m spacy download en_core_web_sm

# Install LangExtract (optional)
pip install langextract
```

### Common Windows Errors and Solutions

#### Error: "caffe2_nvrtc.dll" not found
**Problem**: PyTorch is trying to load CUDA libraries that aren't available.

**Solutions**:
1. **Use CPU-only PyTorch** (recommended):
   ```bash
   pip uninstall torch torchvision torchaudio
   pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
   ```

2. **Install Visual C++ Redistributables**:
   - Download from: https://aka.ms/vs/17/release/vc_redist.x64.exe
   - Install and restart your computer

3. **Use conda instead of pip**:
   ```bash
   conda install pytorch torchvision torchaudio cpuonly -c pytorch
   ```

#### Error: "cannot unpack non-iterable bool object"
**Problem**: Version mismatch in configuration validation.

**Solution**: Already fixed in updated files. Re-run setup.

#### Error: Package installation timeouts
**Problem**: Large AI packages take time to download.

**Solutions**:
1. **Increase pip timeout**:
   ```bash
   pip install --timeout 300 sentence-transformers
   ```

2. **Use conda for large packages**:
   ```bash
   conda install -c conda-forge sentence-transformers
   ```

3. **Install packages one by one**:
   ```bash
   pip install torch --index-url https://download.pytorch.org/whl/cpu
   pip install sentence-transformers
   pip install spacy
   ```

### Alternative Installation Methods

#### Method 1: Conda Environment (Recommended for Windows)
```bash
# Create conda environment
conda create -n plo-mlo python=3.10
conda activate plo-mlo

# Install packages through conda
conda install flask flask-cors python-dotenv
conda install pytorch torchvision torchaudio cpuonly -c pytorch
conda install -c conda-forge sentence-transformers spacy

# Install spaCy model
python -m spacy download en_core_web_sm
```

#### Method 2: Docker (Advanced Users)
```dockerfile
# Create Dockerfile for isolated environment
FROM python:3.10-slim

WORKDIR /app
COPY requirements.txt .

RUN pip install --no-cache-dir torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
EXPOSE 5000
CMD ["python", "enhanced_api_server.py"]
```

### Testing Your Installation

After installation, test each component:

```bash
# Test basic Python imports
python -c "import flask; print('Flask OK')"
python -c "import torch; print('PyTorch OK')"
python -c "from sentence_transformers import SentenceTransformer; print('SentenceTransformers OK')"
python -c "import spacy; print('spaCy OK')"

# Test configuration
python secure_config.py

# Test server
python enhanced_api_server.py
```

### Performance Optimization for Windows

1. **Disable Windows Defender real-time scanning** for your project folder temporarily during installation
2. **Close other applications** to free up memory during large package installations
3. **Use SSD storage** if available for faster package installation
4. **Consider WSL2** for better Linux compatibility if you continue having issues

### Minimum vs Full Installation

#### Minimum Installation (Always Works)
```bash
pip install flask flask-cors python-dotenv
# Basic web server functionality only
```

#### Full Installation (AI Features)
```bash
# Core packages
pip install flask flask-cors python-dotenv

# AI packages (install separately)
pip install torch --index-url https://download.pytorch.org/whl/cpu
pip install sentence-transformers
pip install spacy
python -m spacy download en_core_web_sm

# Optional advanced features
pip install langextract
```

### Getting Help

If you continue to have issues:

1. **Check your Python version**: Must be 3.8+
2. **Try the simple_setup.py**: Installs only core features
3. **Use conda instead of pip**: Often more reliable on Windows
4. **Check available disk space**: AI models are large (1-3GB)
5. **Update pip**: `python -m pip install --upgrade pip`

### Production Deployment on Windows

For production deployment on Windows servers:

```bash
# Use Windows Service or IIS
# Set environment variables in system settings
# Use conda for package management
# Consider Docker for isolation
```

---

**Need immediate help?** Run `python simple_setup.py` for basic functionality, then add AI features manually when convenient.
