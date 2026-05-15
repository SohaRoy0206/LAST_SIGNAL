# Last Signal Backend 🚀

AI-Powered Predictive Healthcare for Satellites

## Overview

The Last Signal backend is a **FastAPI** application that provides real-time telemetry data for satellite monitoring. It simulates satellite metrics and exposes REST API endpoints for frontend integration.

## What's Inside Each File?

```
Backend/
├── requirements.txt          # All Python packages needed
├── README.md                 # This file
└── app/
    ├── __init__.py           # Makes 'app' a Python package
    ├── main.py               # FastAPI server (START HERE!)
    ├── api/
    │   ├── __init__.py
    │   └── telemetry.py      # API endpoints for telemetry data
    ├── telemetry/
    │   ├── __init__.py
    │   └── simulator.py      # Simulates satellite data
    └── utils/
        ├── __init__.py
        └── helpers.py        # Utility functions
```

### 📄 File Descriptions

| File | Purpose |
|------|---------|
| **main.py** | Sets up FastAPI server, CORS, and root endpoints |
| **telemetry.py** | Defines API routes (/telemetry, /health, /risk) |
| **simulator.py** | Generates fake satellite data for testing |
| **helpers.py** | Helper functions (risk calculation, normalization) |
| **requirements.txt** | Lists all Python packages to install |

## 🚀 Quick Start (Windows + VS Code)

### Step 1: Open Terminal in VS Code

Press **Ctrl + `** or go to **Terminal → New Terminal**

### Step 2: Navigate to Backend Folder

```bash
cd Backend
```

### Step 3: Create Virtual Environment (Recommended)

A virtual environment keeps your project packages isolated.

```bash
python -m venv venv
```

### Step 4: Activate Virtual Environment

**On Windows:**
```bash
venv\Scripts\activate
```

You should see `(venv)` at the start of your terminal prompt.

### Step 5: Install Required Packages

```bash
pip install -r requirements.txt
```

This installs:
- **fastapi** - Web framework for building APIs
- **uvicorn** - Server to run FastAPI
- **pandas, numpy** - Data processing
- **scikit-learn** - Machine learning
- **pydantic** - Data validation

### Step 6: Run the Server

```bash
python -m uvicorn app.main:app --reload
```

**Output (you should see):**
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete
```

### Step 7: Test the API

Open your browser and visit:

- **Root endpoint**: http://localhost:8000/
- **Telemetry data**: http://localhost:8000/api/telemetry
- **Interactive docs**: http://localhost:8000/docs
- **Alternative docs**: http://localhost:8000/redoc

## 📊 API Endpoints

### 1. Root Endpoint
```
GET http://localhost:8000/
```
Returns welcome message and API info.

### 2. Telemetry Data
```
GET http://localhost:8000/api/telemetry
```

**Response Example:**
```json
{
  "satellite_health": 91.85,
  "failure_risk": 8.32,
  "temperature": 67.45,
  "signal_strength": 94.12,
  "timestamp": "2024-05-15T10:30:45.123456Z",
  "status": "operational"
}
```

### 3. Health Status Only
```
GET http://localhost:8000/api/telemetry/health
```

**Response:**
```json
{
  "satellite_health": 91.85,
  "status": "operational",
  "timestamp": "2024-05-15T10:30:45.123456Z"
}
```

### 4. Failure Risk Only
```
GET http://localhost:8000/api/telemetry/risk
```

**Response:**
```json
{
  "failure_risk": 8.32,
  "timestamp": "2024-05-15T10:30:45.123456Z"
}
```

### 5. Health Check
```
GET http://localhost:8000/health
```

Used to verify the server is running.

## 🔌 How CORS Works

CORS stands for **Cross-Origin Resource Sharing**. It allows your frontend (running on port 3000) to talk to your backend (running on port 8000).

In `main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow requests from anywhere
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)
```

⚠️ **For production**, change `allow_origins=["*"]` to specific domains like:
```python
allow_origins=["http://localhost:3000", "https://yourdomain.com"]
```

## 📝 How Telemetry Simulation Works

The `TelemetrySimulator` class generates realistic satellite data:

1. **Base values** are defined (health=92%, risk=8%, etc.)
2. **Random variations** are added each time data is requested
3. **Data is bounded** (health stays between 0-100%)
4. **Timestamp** is added for tracking when data was generated

**Example in simulator.py:**
```python
def generate_telemetry(self):
    # Add variations: ±2% to health
    health_variation = random.uniform(-2, 2)
    satellite_health = max(0, min(100, self.base_health + health_variation))
    return {...}
```

## 🔗 Connecting Frontend to Backend

In your Next.js frontend, fetch data like this:

```javascript
const response = await fetch('http://localhost:8000/api/telemetry');
const data = await response.json();
console.log(data.satellite_health);
```

Or with the built-in `fetch` API:

```typescript
// In your React component
useEffect(() => {
  const fetchTelemetry = async () => {
    const res = await fetch('http://localhost:8000/api/telemetry');
    const data = await res.json();
    setTelemetryData(data);
  };
  
  fetchTelemetry();
  // Fetch every 5 seconds
  const interval = setInterval(fetchTelemetry, 5000);
  return () => clearInterval(interval);
}, []);
```

## 🧪 Testing with Swagger UI

FastAPI automatically generates interactive API documentation!

1. Run the server: `python -m uvicorn app.main:app --reload`
2. Visit: http://localhost:8000/docs
3. Click "Try it out" on any endpoint to test it

## 📦 What's in requirements.txt?

```
fastapi==0.104.1       # Web framework
uvicorn==0.24.0        # Server
pandas==2.1.3          # Data processing
numpy==1.26.2          # Numerical computing
scikit-learn==1.3.2    # Machine learning
python-multipart==0.0.6 # Form data handling
python-dotenv==1.0.0   # Environment variables
pydantic==2.5.0        # Data validation
```

## ⚡ Commands Cheat Sheet

| Command | Purpose |
|---------|---------|
| `python -m venv venv` | Create virtual environment |
| `venv\Scripts\activate` | Activate virtual environment (Windows) |
| `pip install -r requirements.txt` | Install packages |
| `python -m uvicorn app.main:app --reload` | Run server with auto-reload |
| `pip list` | Show installed packages |
| `deactivate` | Deactivate virtual environment |

## 🚨 Troubleshooting

### Error: "No module named 'app'"
- Make sure you're in the `Backend` folder
- Make sure you've created `__init__.py` files
- Run with: `python -m uvicorn app.main:app --reload`

### Error: "Port 8000 already in use"
- Change port: `python -m uvicorn app.main:app --port 8001`
- Or kill the process using port 8000

### Error: "Module not found"
- Activate virtual environment: `venv\Scripts\activate`
- Install packages: `pip install -r requirements.txt`

## 🎯 Next Steps

1. ✅ Backend is running!
2. Run your frontend: `cd ../frontend && npm run dev`
3. Connect frontend to backend (add fetch calls)
4. Test API endpoints with Swagger UI
5. Expand telemetry data as needed

## 📚 Learn More

- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [Uvicorn Docs](https://www.uvicorn.org/)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- [REST API Best Practices](https://restfulapi.net/)

---

**Happy coding! 🚀**
