'use client';

import { useEffect, useState } from 'react';

/**
 * WHAT THIS COMPONENT DOES:
 * This component monitors telemetry data and shows warning alerts when 
 * certain conditions are met (high failure risk, high temperature, low signal).
 * 
 * It creates animated alert cards that glow and shake when there are problems.
 */

interface TelemetryData {
  satellite_health: number;
  failure_risk: number;
  temperature: number;
  signal_strength: number;
  status: string;
  timestamp: string;
}

interface Alert {
  id: string;
  type: 'warning' | 'critical';
  title: string;
  message: string;
  value: string;
  icon: string;
  color: string; // 'yellow' for warning, 'red' for critical
}

export default function AnomalyAlerts({ telemetry }: { telemetry: TelemetryData | null }) {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    if (!telemetry) return;

    // This is where we check for anomalies
    // Think of it as a sensor checking if something is wrong
    const newAlerts: Alert[] = [];

    // CHECK 1: Is failure risk too high? (> 20%)
    if (telemetry.failure_risk > 20) {
      // Determine if it's a warning or critical
      const isCritical = telemetry.failure_risk > 50;
      newAlerts.push({
        id: 'failure_risk',
        type: isCritical ? 'critical' : 'warning',
        title: isCritical ? '🚨 CRITICAL: High Failure Risk' : '⚠️ WARNING: Elevated Failure Risk',
        message: isCritical
          ? 'Failure risk is critically high. Immediate attention required!'
          : 'Failure risk is elevated. Monitor closely.',
        value: `${telemetry.failure_risk.toFixed(1)}%`,
        icon: '⚠️',
        color: isCritical ? 'red' : 'yellow',
      });
    }

    // CHECK 2: Is temperature too high? (> 75°C)
    if (telemetry.temperature > 75) {
      // Determine if it's a warning or critical
      const isCritical = telemetry.temperature > 85;
      newAlerts.push({
        id: 'temperature',
        type: isCritical ? 'critical' : 'warning',
        title: isCritical ? '🌡️ CRITICAL: Overheating' : '🌡️ WARNING: High Temperature',
        message: isCritical
          ? 'Temperature critically high. Thermal damage risk!'
          : 'Temperature elevated. Thermal monitoring active.',
        value: `${telemetry.temperature.toFixed(1)}°C`,
        icon: '🌡️',
        color: isCritical ? 'red' : 'yellow',
      });
    }

    // CHECK 3: Is signal strength too low? (< 60%)
    if (telemetry.signal_strength < 60) {
      // Determine if it's a warning or critical
      const isCritical = telemetry.signal_strength < 30;
      newAlerts.push({
        id: 'signal_strength',
        type: isCritical ? 'critical' : 'warning',
        title: isCritical ? '📡 CRITICAL: Signal Loss' : '📡 WARNING: Weak Signal',
        message: isCritical
          ? 'Signal strength critically low. Communication at risk!'
          : 'Signal strength degraded. Monitor connection.',
        value: `${telemetry.signal_strength.toFixed(1)}%`,
        icon: '📡',
        color: isCritical ? 'red' : 'yellow',
      });
    }

    setAlerts(newAlerts);
  }, [telemetry]);

  // If no alerts, show nothing
  if (alerts.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="space-y-3">
        {alerts.map((alert) => (
          <AlertCard key={alert.id} alert={alert} />
        ))}
      </div>
    </div>
  );
}

/**
 * ALERT CARD COMPONENT
 * This is a single alert card that displays with animation and glow effect
 * It looks different based on the alert severity (warning vs critical)
 */
function AlertCard({ alert }: { alert: Alert }) {
  // Animation class - critical alerts shake, warnings pulse
  const animationClass = alert.type === 'critical'
    ? 'animate-pulse' // Pulse animation for critical
    : 'animate-pulse'; // Pulse animation for warning (less intense)

  // Colors for the alert
  const bgColor = alert.color === 'red'
    ? 'bg-gradient-to-r from-red-900/20 to-red-900/10'
    : 'bg-gradient-to-r from-yellow-900/20 to-yellow-900/10';

  const borderColor = alert.color === 'red'
    ? 'border-red-500/50'
    : 'border-yellow-500/50';

  const glowColor = alert.color === 'red'
    ? 'shadow-red-500/30'
    : 'shadow-yellow-500/20';

  const textColor = alert.color === 'red'
    ? 'text-red-400'
    : 'text-yellow-400';

  return (
    <div
      className={`
        relative overflow-hidden rounded-xl backdrop-blur-md border transition-all duration-300
        ${bgColor} ${borderColor} ${glowColor} shadow-lg hover:shadow-2xl
        ${animationClass} ${alert.type === 'critical' ? 'border-2' : 'border'}
      `}
      style={{
        // Glow effect - stronger for critical
        boxShadow: alert.color === 'red'
          ? `0 0 20px rgba(239, 68, 68, 0.4), inset 0 1px 1px rgba(239, 68, 68, 0.1), 0 0 40px rgba(239, 68, 68, 0.2)`
          : `0 0 15px rgba(202, 138, 4, 0.3), inset 0 1px 1px rgba(202, 138, 4, 0.1)`,
      }}
    >
      {/* Moving gradient background for extra visual effect */}
      <div
        className="absolute inset-0 opacity-50"
        style={{
          background: alert.color === 'red'
            ? 'linear-gradient(90deg, rgba(239, 68, 68, 0.1) 0%, transparent 100%)'
            : 'linear-gradient(90deg, rgba(202, 138, 4, 0.1) 0%, transparent 100%)',
          animation: 'moveGradient 3s ease-in-out infinite',
        }}
      />

      {/* Content inside the alert */}
      <div className="relative p-4 z-10 flex items-start gap-4">
        {/* Left side: Icon */}
        <div className={`text-2xl flex-shrink-0 mt-1 ${alert.type === 'critical' ? 'animate-bounce' : ''}`}>
          {alert.icon}
        </div>

        {/* Middle: Text content */}
        <div className="flex-1 min-w-0">
          <h4 className={`font-bold text-sm mb-1 ${textColor}`}>
            {alert.title}
          </h4>
          <p className="text-xs text-gray-300 mb-2">
            {alert.message}
          </p>
          <p className={`text-xs font-mono font-semibold ${textColor}`}>
            Current: {alert.value}
          </p>
        </div>

        {/* Right side: Status indicator */}
        <div className={`flex-shrink-0 text-xs font-bold uppercase ${textColor}`}>
          {alert.type === 'critical' ? 'Critical' : 'Warning'}
        </div>
      </div>

      {/* Top accent line for visual appeal */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5"
        style={{
          background: alert.color === 'red'
            ? 'linear-gradient(90deg, transparent, rgba(239, 68, 68, 0.8), transparent)'
            : 'linear-gradient(90deg, transparent, rgba(202, 138, 4, 0.8), transparent)',
        }}
      />
    </div>
  );
}
