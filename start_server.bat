@echo off
echo 🚀 Starting Enhanced PLO-MLO Analysis (PyTorch-Free Version)
echo ================================================================

echo.
echo ✅ Checking configuration...
python secure_config.py

echo.
echo 🔧 Testing PyTorch-free backend...
python -c "import pytorch_free_backend; print('✅ Backend ready!')"

echo.
echo 🌐 Starting web server...
echo Server will be available at: http://localhost:5000
echo Press Ctrl+C to stop the server
echo.

python pytorch_free_server.py

pause
