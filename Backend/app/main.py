"""
Last Signal Backend - FastAPI Server
-------------------------------------
Main entry point for the Last Signal satellite monitoring backend.

This server provides API endpoints for:
- Telemetry data retrieval
- Satellite health monitoring
- Failure risk assessment
- Real-time signal monitoring
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

# Import the API routes
from app.api.telemetry import router as telemetry_router

# Create FastAPI application instance
app = FastAPI(
    title="Last Signal API",
    description="AI-Powered Predictive Healthcare for Satellites",
    version="1.0.0",
)

# Configure CORS (Cross-Origin Resource Sharing)
# This allows your frontend to communicate with this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow requests from any origin (change this for production)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Include the telemetry routes
app.include_router(telemetry_router)


@app.get("/")
async def root():
    """
    Root endpoint - Welcome message and API information.

    Returns:
        dict: Welcome message and API details
    """
    return {
        "message": "Welcome to Last Signal Backend",
        "project": "Last Signal - AI-Powered Predictive Healthcare for Satellites",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "endpoints": {
            "/docs": "Interactive API documentation (Swagger UI)",
            "/redoc": "Alternative API documentation (ReDoc)",
            "/api/telemetry": "Get all satellite telemetry data",
            "/api/telemetry/health": "Get satellite health status",
            "/api/telemetry/risk": "Get failure risk assessment",
        },
    }


@app.get("/health")
async def health_check():
    """
    Health check endpoint - Used to verify the server is running.

    Returns:
        dict: Server status
    """
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat() + "Z",
    }


if __name__ == "__main__":
    import uvicorn

    # Run the server with: python -m uvicorn app.main:app --reload
    # Or directly: python app/main.py
    uvicorn.run(
        app,
        host="0.0.0.0",  # Listen on all available network interfaces
        port=8000,  # API will be available at http://localhost:8000
        reload=True,  # Auto-reload on code changes (development only)
    )
