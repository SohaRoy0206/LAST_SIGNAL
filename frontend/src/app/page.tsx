'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

// Type definition for telemetry data from backend
interface TelemetryData {
  satellite_health: number;
  failure_risk: number;
  temperature: number;
  signal_strength: number;
  status: string;
  timestamp: string;
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);

    // Function to fetch telemetry data from backend
    const fetchTelemetry = async () => {
      try {
        setError(null);
        const response = await axios.get<TelemetryData>('http://localhost:8000/api/telemetry');
        setTelemetry(response.data);
        setLoading(false);
      } catch (err) {
        // Handle different types of errors
        if (axios.isAxiosError(err)) {
          setError(`Failed to connect to backend: ${err.message}`);
        } else {
          setError('An unexpected error occurred');
        }
        setLoading(false);
      }
    };

    // Fetch data immediately when component mounts
    fetchTelemetry();

    // Set up interval to refresh data every 5 seconds
    const interval = setInterval(fetchTelemetry, 5000);

    // Cleanup interval when component unmounts
    return () => clearInterval(interval);
  }, []);

  const CircularProgress = ({ percentage, color }: { percentage: number; color: string }) => {
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative w-24 h-24">
        <svg className="absolute inset-0 -rotate-90" width="96" height="96">
          <circle
            cx="48"
            cy="48"
            r="45"
            stroke="rgba(0, 255, 255, 0.1)"
            strokeWidth="3"
            fill="none"
          />
          <circle
            cx="48"
            cy="48"
            r="45"
            stroke={color}
            strokeWidth="3"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000"
            style={{
              filter: `drop-shadow(0 0 8px ${color})`,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-white">{percentage}%</span>
        </div>
      </div>
    );
  };

  const DashboardCard = ({
    title,
    value,
    subtitle,
    icon,
    metric,
    color,
  }: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ReactNode;
    metric?: number;
    color: string;
  }) => (
    <div
      className={`relative overflow-hidden rounded-2xl backdrop-blur-md border transition-all duration-300 hover:scale-105 cursor-pointer ${
        color === 'cyan'
          ? 'bg-gradient-to-br from-cyan-500/10 to-blue-500/5 border-cyan-500/30 hover:border-cyan-400/60 hover:shadow-lg hover:shadow-cyan-500/20'
          : color === 'green'
            ? 'bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border-emerald-500/30 hover:border-emerald-400/60 hover:shadow-lg hover:shadow-emerald-500/20'
            : 'bg-gradient-to-br from-red-500/10 to-rose-500/5 border-red-500/30 hover:border-red-400/60 hover:shadow-lg hover:shadow-red-500/20'
      }`}
      style={{
        boxShadow:
          color === 'cyan'
            ? `0 0 20px rgba(34, 211, 238, 0.1), inset 0 1px 1px rgba(34, 211, 238, 0.1)`
            : color === 'green'
              ? `0 0 20px rgba(34, 197, 94, 0.1), inset 0 1px 1px rgba(34, 197, 94, 0.1)`
              : `0 0 20px rgba(239, 68, 68, 0.1), inset 0 1px 1px rgba(239, 68, 68, 0.1)`,
      }}
    >
      {/* Animated border glow */}
      <div
        className={`absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl`}
        style={{
          background:
            color === 'cyan'
              ? 'radial-gradient(circle at top-right, rgba(34, 211, 238, 0.2), transparent)'
              : color === 'green'
                ? 'radial-gradient(circle at top-right, rgba(34, 197, 94, 0.2), transparent)'
                : 'radial-gradient(circle at top-right, rgba(239, 68, 68, 0.2), transparent)',
        }}
      />

      <div className="relative p-6 z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">{title}</h3>
          <div className="text-2xl opacity-60">{icon}</div>
        </div>

        {metric !== undefined ? (
          <div className="flex items-center gap-4">
            <CircularProgress percentage={metric} color={color} />
            <div>
              <p className="text-3xl font-bold text-white mb-1">{value}</p>
              {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
            </div>
          </div>
        ) : (
          <>
            <p className="text-4xl font-bold mb-2" style={{ color }}>
              {value}
            </p>
            {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
          </>
        )}
      </div>

      {/* Corner accent */}
      <div
        className={`absolute top-0 right-0 w-20 h-20 opacity-20 pointer-events-none`}
        style={{
          background:
            color === 'cyan'
              ? 'radial-gradient(circle, rgba(34, 211, 238, 0.4), transparent)'
              : color === 'green'
                ? 'radial-gradient(circle, rgba(34, 197, 94, 0.4), transparent)'
                : 'radial-gradient(circle, rgba(239, 68, 68, 0.4), transparent)',
        }}
      />
    </div>
  );

  return (
    <div
      className="min-h-screen w-full relative overflow-hidden"
      style={{
        backgroundColor: '#050816',
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top-left glow */}
        <div
          className="absolute -top-40 -left-40 w-80 h-80 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(34, 211, 238, 0.3), transparent)',
            filter: 'blur(60px)',
          }}
        />

        {/* Bottom-right glow */}
        <div
          className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full opacity-15"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2), transparent)',
            filter: 'blur(60px)',
          }}
        />

        {/* Animated stars */}
        {mounted && (
          <div className="absolute inset-0">
            {[...Array(30)].map((_, i) => {
              // Use seeded random based on index for consistent positioning
              const seed = (i * 12.9898 + 78.233) * 43758.5453;
              const seedLeft = (Math.sin(seed) * 0.5 + 0.5) * 100;
              const seedTop = (Math.sin(seed * 0.7) * 0.5 + 0.5) * 100;
              const seedDuration = 2 + ((seed * 0.3) % 3);
              const seedDelay = (seed * 0.2) % 2;

              return (
                <div
                  key={i}
                  className="absolute w-1 h-1 rounded-full opacity-40"
                  style={{
                    backgroundColor: '#ffffff',
                    left: `${seedLeft}%`,
                    top: `${seedTop}%`,
                    animation: `twinkle ${seedDuration}s infinite`,
                    animationDelay: `${seedDelay}s`,
                  }}
                />
              );
            })}
          </div>
        )}

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              'linear-gradient(rgba(34, 211, 238, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 py-16 md:py-24">
        {/* Header */}
        <div className="text-center mb-16">
          {/* Title with glow */}
          <div className="mb-6">
            <h1
              className="text-5xl md:text-7xl font-black mb-4 tracking-wider"
              style={{
                background: 'linear-gradient(135deg, #00ffff 0%, #00ccff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 0 30px rgba(34, 211, 238, 0.3)',
                filter: 'drop-shadow(0 0 20px rgba(34, 211, 238, 0.3))',
              }}
            >
              LAST SIGNAL
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-gray-300 mb-2 font-light tracking-wide">
            AI-Powered Predictive Healthcare
          </p>
          <p className="text-base md:text-lg text-cyan-400/70 font-light tracking-widest">
            FOR SATELLITES
          </p>

          {/* Divider */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-cyan-500/50" />
            <div className="w-2 h-2 rounded-full bg-cyan-500" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-cyan-500/50" />
          </div>
        </div>

        {/* Dashboard Grid */}
        {mounted ? (
          <>
            {/* Error message display */}
            {error && (
              <div className="mb-6 p-4 rounded-lg border border-red-500/50 bg-red-500/10 text-red-300">
                <p className="text-sm">{error}</p>
                <p className="text-xs text-red-400 mt-1">Retrying connection...</p>
              </div>
            )}

            {/* Loading state */}
            {loading && !error ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="inline-block">
                    <div
                      className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"
                    />
                  </div>
                  <p className="text-cyan-400 mt-4 text-sm">Connecting to backend...</p>
                </div>
              </div>
            ) : telemetry ? (
              /* Display live data from API */
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                <DashboardCard
                  title="Satellite Health"
                  value={`${telemetry.satellite_health.toFixed(1)}%`}
                  subtitle={
                    telemetry.satellite_health > 75
                      ? 'Operating Nominal'
                      : telemetry.satellite_health > 50
                        ? 'Operating with Caution'
                        : 'Critical Alert'
                  }
                  icon="📡"
                  metric={telemetry.satellite_health}
                  color="rgb(34, 197, 94)"
                />

                <DashboardCard
                  title="Failure Risk"
                  value={`${telemetry.failure_risk.toFixed(1)}%`}
                  subtitle={
                    telemetry.failure_risk < 20
                      ? 'Low Risk'
                      : telemetry.failure_risk < 50
                        ? 'Medium Risk'
                        : 'Critical Alert'
                  }
                  icon="⚠️"
                  metric={telemetry.failure_risk}
                  color="rgb(239, 68, 68)"
                />

                <DashboardCard
                  title="Signal Status"
                  value={telemetry.status === 'operational' ? 'Stable' : 'Warning'}
                  subtitle={`Temp: ${telemetry.temperature.toFixed(1)}°C | Signal: ${telemetry.signal_strength.toFixed(1)}%`}
                  icon="🛰️"
                  color="cyan"
                />
              </div>
            ) : null}

            {/* Footer stats */}
            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
              {[
                { label: 'Active Satellites', value: '284' },
                { label: 'Uptime', value: '99.7%' },
                { label: 'Data Points', value: '2.4M' },
                { label: 'Predictions', value: '847' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="text-center p-4 rounded-lg border border-cyan-500/20 bg-cyan-500/5 backdrop-blur-sm hover:border-cyan-500/40 transition-colors"
                >
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">{item.label}</p>
                  <p className="text-xl md:text-2xl font-bold text-cyan-400">{item.value}</p>
                </div>
              ))}
            </div>
          </>
        ) : null}
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
}
