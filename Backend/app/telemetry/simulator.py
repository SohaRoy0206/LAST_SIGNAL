"""
Telemetry Simulator
-------------------
Generates simulated satellite telemetry data for testing and development.
This module provides realistic-looking satellite metrics.
"""

import random
from datetime import datetime


class TelemetrySimulator:
    """Simulates satellite telemetry data with realistic variations."""

    def __init__(self):
        """Initialize the simulator with baseline values."""
        self.base_health = 92
        self.base_failure_risk = 8
        self.base_temperature = 65
        self.base_signal_strength = 95

    def generate_telemetry(self):
        """
        Generate simulated telemetry data.

        Returns:
            dict: Telemetry data with satellite metrics
        """
        # Add small random variations to simulate real-world data
        health_variation = random.uniform(-2, 2)
        risk_variation = random.uniform(-1, 1)
        temp_variation = random.uniform(-3, 3)
        signal_variation = random.uniform(-2, 2)

        satellite_health = max(0, min(100, self.base_health + health_variation))
        failure_risk = max(0, min(100, self.base_failure_risk + risk_variation))
        temperature = self.base_temperature + temp_variation
        signal_strength = max(0, min(100, self.base_signal_strength + signal_variation))

        return {
            "satellite_health": round(satellite_health, 2),
            "failure_risk": round(failure_risk, 2),
            "temperature": round(temperature, 2),
            "signal_strength": round(signal_strength, 2),
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "status": "operational" if satellite_health > 50 else "warning",
        }


# Create a global simulator instance
simulator = TelemetrySimulator()
