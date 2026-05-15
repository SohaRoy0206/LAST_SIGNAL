# 🚀 Quick Start Guide - Last Signal Backend

## ⚡ Fast Setup (3 steps)

### 1️⃣ Activate Virtual Environment (Windows)
```bash
venv\Scripts\activate
```
You should see `(venv)` at the start of your terminal.

### 2️⃣ Start the Server
```bash
python -m uvicorn app.main:app --reload
```

**Expected output:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Application startup complete
```

### 3️⃣ Test It
Open in your browser:
- **API**: http://localhost:8000/api/telemetry
- **Docs**: http://localhost:8000/docs
- **Root**: http://localhost:8000/

---

## 📊 API Response Example

**GET /api/telemetry**

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

---

## 🛠️ What Each File Does

| File | Purpose |
|------|---------|
| `main.py` | FastAPI server setup |
| `api/telemetry.py` | API endpoints |
| `telemetry/simulator.py` | Fake data generator |
| `utils/helpers.py` | Utility functions |

---

## 🔗 Connect Frontend

In your Next.js code:

```typescript
const fetchData = async () => {
  const response = await fetch('http://localhost:8000/api/telemetry');
  const data = await response.json();
  console.log(data);
};
```

---

## ⚙️ Common Commands

```bash
# Activate environment
venv\Scripts\activate

# Install packages
pip install -r requirements.txt

# Run server with auto-reload
python -m uvicorn app.main:app --reload

# Run on different port
python -m uvicorn app.main:app --port 8001

# Stop server
Press CTRL+C
```

---

**All set! Your API is ready to use!** 🎉
