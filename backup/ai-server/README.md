# PLO-MLO AI Enhancement Server

A cloud-hosted AI server for analyzing alignment between Programme Learning Outcomes (PLOs) and Module Learning Outcomes (MLOs).

## Features

- 🤖 **AI-powered alignment analysis** using keyword matching and competency frameworks
- 📊 **Enhanced scoring** with confidence levels and detailed reasoning
- 🔍 **Keyword extraction** and competency mapping
- ⚡ **Fast API** with CORS support for web applications
- 🌐 **Cloud-ready** deployment to Railway, Render, Heroku, etc.

## Quick Deploy

### Option 1: Railway (Recommended)

1. Go to [railway.app](https://railway.app)
2. Click "Deploy from GitHub repo"
3. Connect this repository
4. Select the `ai-server` folder
5. Railway will auto-deploy!

### Option 2: Render

1. Go to [render.com](https://render.com)
2. Create new "Web Service"
3. Connect this GitHub repo
4. Set:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
   - **Root Directory**: `ai-server`

### Option 3: Heroku

```bash
cd ai-server
heroku create your-app-name
git add .
git commit -m "Deploy AI server"
git push heroku main
```

## API Endpoints

- `GET /status` - Health check
- `POST /analyze` - Analyze PLO-MLO alignment

## Usage

```javascript
const response = await fetch('https://your-app.railway.app/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        plo_text: "Programme learning outcome text...",
        mlo_text: "Module learning outcome text...",
        original_score: 3
    })
});

const result = await response.json();
console.log(result.enhanced_score);
```

## Local Development

```bash
cd ai-server
pip install -r requirements.txt
python app.py
```

Server runs on `http://localhost:5000`
