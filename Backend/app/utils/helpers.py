"""
Helper Utilities
----------------
Utility functions for the Last Signal backend.
"""


def normalize_metric(value: float, min_val: float = 0, max_val: float = 100) -> float:
    """
    Normalize a metric value to be within min and max bounds.

    Args:
        value: The value to normalize
        min_val: Minimum allowed value (default: 0)
        max_val: Maximum allowed value (default: 100)

    Returns:
        float: Normalized value
    """
    return max(min_val, min(max_val, value))


def calculate_risk_score(health: float, temperature: float) -> float:
    """
    Calculate failure risk based on health and temperature metrics.

    Args:
        health: Satellite health percentage (0-100)
        temperature: Temperature in Celsius

    Returns:
        float: Risk score (0-100)
    """
    # Simple risk calculation: lower health and higher temperature increase risk
    health_risk = 100 - health
    temp_risk = (temperature - 60) * 2  # Assume optimal temp is 60°C

    combined_risk = (health_risk * 0.7) + (temp_risk * 0.3)
    return normalize_metric(combined_risk, 0, 100)


def get_status_message(health: float) -> str:
    """
    Get a status message based on health percentage.

    Args:
        health: Satellite health percentage (0-100)

    Returns:
        str: Status message
    """
    if health >= 90:
        return "Excellent"
    elif health >= 75:
        return "Good"
    elif health >= 50:
        return "Fair"
    else:
        return "Critical"
