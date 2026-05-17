# AI Anomaly Alert System - Beginner's Guide

## What Does This Do?

The alert system continuously monitors your satellite telemetry data and shows animated warning cards when certain conditions are triggered. Think of it like a smoke detector for your satellite!

---

## 🚨 How Alerts Work

### Alert Thresholds (When to Show Warnings)

The system checks 3 critical metrics every time new data arrives:

1. **Failure Risk > 20%**
   - **Warning** (Yellow): Risk is between 20-50%
   - **Critical** (Red): Risk is above 50%
   - This means the satellite might break soon!

2. **Temperature > 75°C**
   - **Warning** (Yellow): Temp between 75-85°C
   - **Critical** (Red): Temp above 85°C
   - The satellite is overheating!

3. **Signal Strength < 60%**
   - **Warning** (Yellow): Signal between 30-60%
   - **Critical** (Red): Signal below 30%
   - Communication with satellite is weak!

---

## 📁 File Structure

```
frontend/src/app/
├── page.tsx                    ← Main dashboard (updated with alerts)
└── components/
    └── AnomalyAlerts.tsx       ← New alert component
```

---

## 💻 Code Explanation

### 1. **AnomalyAlerts Component** (`AnomalyAlerts.tsx`)

This file contains all the alert logic:

```typescript
// This component receives telemetry data as a prop
export default function AnomalyAlerts({ telemetry }: { telemetry: TelemetryData | null }) {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  // Every time telemetry data changes, check for problems
  useEffect(() => {
    if (!telemetry) return;

    const newAlerts: Alert[] = [];

    // Check 1: High failure risk?
    if (telemetry.failure_risk > 20) {
      newAlerts.push({
        id: 'failure_risk',
        type: 'warning',
        title: '⚠️ WARNING: Elevated Failure Risk',
        // ... more alert data
      });
    }
    // ... other checks
  }, [telemetry]); // This effect runs whenever telemetry changes!
```

**What's happening:**
- We use `useEffect` to monitor for changes in telemetry data
- When data changes, we check if any metrics are bad
- If they are, we create an alert object and add it to the `alerts` array
- If no alerts, the component returns `null` (shows nothing)

### 2. **AlertCard Component** (Inside AnomalyAlerts.tsx)

This renders a single alert card with styling:

```typescript
function AlertCard({ alert }: { alert: Alert }) {
  // Choose colors based on severity
  const bgColor = alert.color === 'red'
    ? 'bg-gradient-to-r from-red-900/20 to-red-900/10'  // Dark red for critical
    : 'bg-gradient-to-r from-yellow-900/20 to-yellow-900/10'; // Dark yellow for warning

  return (
    <div className={`relative rounded-xl backdrop-blur-md border ${bgColor}`}>
      {/* Icon with bounce animation */}
      <div className={`text-2xl ${alert.type === 'critical' ? 'animate-bounce' : ''}`}>
        {alert.icon}
      </div>

      {/* Alert text content */}
      <div>
        <h4>{alert.title}</h4>
        <p>{alert.message}</p>
        <p>Current: {alert.value}</p>
      </div>

      {/* Status label */}
      <div>{alert.type === 'critical' ? 'Critical' : 'Warning'}</div>
    </div>
  );
}
```

**What's happening:**
- We check if it's a **critical** or **warning** alert
- Apply different background colors (red vs yellow)
- Icons bounce if it's critical
- Display all the alert information

### 3. **Integration in Main Page** (`page.tsx`)

We added the alert component right after the header:

```typescript
// Import the component at top
import AnomalyAlerts from './components/AnomalyAlerts';

// In the JSX, add it right after the header
{mounted && telemetry && (
  <div className="mt-8 max-w-6xl mx-auto mb-8">
    <AnomalyAlerts telemetry={telemetry} />
  </div>
)}
```

This means:
- Only show alerts if the page is mounted (`mounted`)
- Only show alerts if we have telemetry data (`telemetry`)
- Pass the telemetry data to the component

---

## 🎨 Styling Breakdown

### Warning Alert (Yellow)
- Background: Dark yellow with transparency
- Glow: Yellow border with soft shadow
- Icon: Static (no bounce)
- Text: Yellow color

### Critical Alert (Red)
- Background: Dark red with transparency
- Glow: Red border with strong shadow
- Icon: Bounces up and down (draws attention)
- Text: Red color
- Border: Thicker (border-2 instead of border)

### Visual Effects

1. **Glow Effect**: `box-shadow` creates a glowing aura around the alert
2. **Moving Gradient**: A subtle gradient moves from left to right
3. **Pulse Animation**: Alert pulses to grab attention
4. **Glassmorphism**: `backdrop-blur-md` creates the frosted glass effect

---

## 🔄 How Real-Time Updates Work

1. **Telemetry fetches every 5 seconds** (in `page.tsx`)
2. **New telemetry data arrives** → Component updates
3. **`useEffect` in AnomalyAlerts detects the change**
4. **Checks run automatically** → Alerts appear/disappear instantly
5. **UI updates with new data** ✨

---

## 🧪 Testing the Alerts

To see the alerts in action, modify the telemetry simulator to return higher values:

Edit `Backend/app/telemetry/simulator.py` and change values:

```python
# Make risk high to trigger warning
failure_risk = 35.0  # This will trigger a yellow warning

# Make temperature high to trigger critical
temperature = 87.0  # This will trigger a red critical alert

# Make signal weak to trigger warning
signal_strength = 45.0  # This will trigger a yellow warning
```

Then reload the page and you'll see the alerts!

---

## 🎯 Key Concepts for Beginners

1. **State Management** (`useState`): Alerts array stores all active alerts
2. **Effect Hooks** (`useEffect`): Runs checks whenever telemetry changes
3. **Conditional Rendering**: Alerts only show if there are problems
4. **Props**: Telemetry data passed down as a prop
5. **Tailwind CSS**: All styling done with utility classes
6. **Animations**: CSS animations create the visual effects

---

## 📊 Data Flow Diagram

```
Backend (FastAPI)
    ↓
Telemetry Data (every 5 seconds)
    ↓
page.tsx (fetches and stores)
    ↓
AnomalyAlerts Component (checks data)
    ↓
Alert Thresholds (Failure Risk, Temperature, Signal)
    ↓
AlertCard Component (renders visual alert)
    ↓
User Sees Warning 🚨
```

---

## ✅ Summary

- **Component**: `AnomalyAlerts.tsx` - Detects problems
- **Updates**: Live as telemetry arrives
- **Styling**: Cyberpunk glassmorphism with glow effects
- **Severity**: 2 levels (Warning/Critical) with different colors
- **Integration**: Sits at top of dashboard for visibility
- **Performance**: Only renders if there are actual alerts

**The system is now watching your satellite 24/7! 👀**
