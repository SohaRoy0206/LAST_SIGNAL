"""
Telemetry API Endpoints
-----------------------
Defines the API routes for retrieving satellite telemetry data.
"""

from fastapi import APIRouter
from ..telemetry.simulator import simulator

# Create a router instance for telemetry endpoints
router = APIRouter(prefix="/api", tags=["telemetry"])


@router.get("/telemetry")
async def get_telemetry():
    """
    Get current satellite telemetry data.

    Returns:
        dict: Current satellite metrics including health, risk, temperature, and signal strength
    """
    return simulator.generate_telemetry()


@router.get("/telemetry/health")
async def get_satellite_health():
    """Get only satellite health status."""
    data = simulator.generate_telemetry()
    return {
        "satellite_health": data["satellite_health"],
        "status": data["status"],
        "timestamp": data["timestamp"],
    }


@router.get("/telemetry/risk")
async def get_failure_risk():
    """Get only failure risk assessment."""
    data = simulator.generate_telemetry()
    return {
        "failure_risk": data["failure_risk"],
        "timestamp": data["timestamp"],
    }
