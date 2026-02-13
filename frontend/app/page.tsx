'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, Activity } from 'lucide-react'

// Sample historical data
const historicalXrayData = [
  { time: '2024-12-20 08:00', flux: 1.2e-6 },
  { time: '2024-12-20 09:00', flux: 1.5e-6 },
  { time: '2024-12-20 10:00', flux: 2.1e-6 },
  { time: '2024-12-20 11:00', flux: 3.4e-6 },
  { time: '2024-12-20 12:00', flux: 5.8e-6 },
  { time: '2024-12-20 13:00', flux: 8.2e-6 },
  { time: '2024-12-20 14:00', flux: 6.5e-6 },
  { time: '2024-12-20 15:00', flux: 4.2e-6 },
  { time: '2024-12-20 16:00', flux: 2.8e-6 },
  { time: '2024-12-20 17:00', flux: 1.9e-6 },
]

// Solar heatmap simulation data
const heatmapData = [
  { x: 10, y: 20, intensity: 0.3 },
  { x: 15, y: 25, intensity: 0.6 },
  { x: 20, y: 18, intensity: 0.85 },
  { x: 25, y: 22, intensity: 0.7 },
  { x: 30, y: 16, intensity: 0.4 },
  { x: 35, y: 28, intensity: 0.5 },
  { x: 18, y: 30, intensity: 0.65 },
  { x: 12, y: 12, intensity: 0.2 },
]

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-secondary/20 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Activity className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Helios Predictor</h1>
                <p className="text-sm text-muted-foreground">Space Weather Analysis System</p>
              </div>
            </div>
            <div className="text-right text-sm text-muted-foreground">
              <p>Last Updated: 2024-12-20 17:45 UTC</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Information Cards - Top Section */}
        <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Active Region Card */}
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Active Region</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">AR3664</div>
                <p className="text-xs text-muted-foreground">
                  Observation: 2024-12-20 15:30 UTC
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Flare Detection Card */}
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Flare Detection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-primary animate-pulse" />
                  <span className="text-2xl font-bold text-primary">YES</span>
                </div>
                <div className="text-3xl font-bold">85%</div>
                <p className="text-xs text-muted-foreground">
                  Estimated from EUV imagery
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Flare Magnitude Card */}
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Flare Magnitude</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground">Peak X-ray Flux</p>
                  <p className="text-2xl font-bold font-mono">1.4 × 10⁻⁵ W/m²</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground">Derived Class</p>
                  <p className="text-3xl font-bold text-primary">M1.4</p>
                </div>
                <p className="text-xs text-muted-foreground italic">
                  Derived from model, not direct classification
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Geomagnetic Impact Card */}
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Geomagnetic Disturbance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="inline-block rounded-full bg-amber-950/30 px-3 py-1">
                  <span className="text-sm font-bold text-amber-400">MODERATE</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Actual Earth impact depends on CME direction and external space weather conditions
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Visualization Section */}
        <div className="mb-8 grid gap-8 lg:grid-cols-3">
          {/* Solar Image with Heatmap */}
          <div className="lg:col-span-2">
            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Solar Imagery - Model Attention (Grad-CAM)
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardTitle>
                <CardDescription>
                  Highlights regions contributing most to the prediction
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Solar visualization */}
                <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gradient-to-b from-background via-slate-900 to-slate-950">
                  {/* Sun circle with gradient */}
                  <svg
                    className="h-full w-full"
                    viewBox="0 0 400 400"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <radialGradient id="sunGradient" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.9" />
                        <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#dc2626" stopOpacity="0.3" />
                      </radialGradient>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>

                    {/* Background stars */}
                    <circle cx="50" cy="60" r="1.5" fill="white" opacity="0.3" />
                    <circle cx="380" cy="40" r="1" fill="white" opacity="0.2" />
                    <circle cx="30" cy="350" r="1.2" fill="white" opacity="0.25" />
                    <circle cx="370" cy="380" r="1" fill="white" opacity="0.2" />

                    {/* Sun */}
                    <circle
                      cx="200"
                      cy="200"
                      r="120"
                      fill="url(#sunGradient)"
                      filter="url(#glow)"
                    />

                    {/* Heatmap overlays - showing model attention */}
                    {heatmapData.map((point, idx) => (
                      <circle
                        key={idx}
                        cx={150 + point.x}
                        cy={150 + point.y}
                        r={5 + point.intensity * 4}
                        fill="#45ddc0"
                        opacity={point.intensity * 0.6}
                        className="animate-pulse"
                        style={{
                          animationDelay: `${idx * 0.1}s`,
                        }}
                      />
                    ))}

                    {/* Active region highlight */}
                    <circle
                      cx="220"
                      cy="180"
                      r="25"
                      fill="none"
                      stroke="#45ddc0"
                      strokeWidth="2"
                      opacity="0.8"
                      className="animate-pulse"
                    />
                  </svg>

                  {/* Legend overlay */}
                  <div className="absolute bottom-4 left-4 rounded-lg bg-background/80 px-3 py-2 backdrop-blur">
                    <div className="text-xs text-muted-foreground">
                      <p className="font-semibold text-foreground">Model Attention Regions</p>
                      <p>Intensity scale: Low → High</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Risk Assessment Sidebar */}
          <div className="flex flex-col gap-4">
            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-base">Risk Assessment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-semibold">Flare Probability</span>
                    <span className="text-lg font-bold text-primary">85%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-primary"
                      style={{ width: '85%' }}
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-semibold">Impact Severity</span>
                    <span className="text-lg font-bold text-amber-400">MODERATE</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-amber-500"
                      style={{ width: '65%' }}
                    />
                  </div>
                </div>

                <div className="rounded-lg bg-muted/30 p-3">
                  <p className="text-xs font-semibold text-muted-foreground mb-1">KEY METRICS</p>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Confidence Score:</span>
                      <span className="font-semibold">92%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Model Consensus:</span>
                      <span className="font-semibold">4/5 Models</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time Window:</span>
                      <span className="font-semibold">6-48h</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">⚠️ SCIENTIFIC DISCLAIMER</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  This analysis is for educational and research purposes. Not intended for operational decision-making. Actual impacts depend on CME trajectory and space weather conditions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Historical Context Chart */}
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle>Historical GOES X-ray Flux</CardTitle>
            <CardDescription>
              Previous observations for context (not a forecast)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={historicalXrayData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 12 }}
                  stroke="#cbd5e0"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  stroke="#cbd5e0"
                  label={{ value: 'Flux (W/m²)', angle: -90, position: 'insideLeft' }}
                  tickFormatter={(value) => `${value.toExponential(1)}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a202c',
                    border: '1px solid #4a5568',
                    borderRadius: '0.5rem',
                  }}
                  formatter={(value) => [
                    `${(value as number).toExponential(2)} W/m²`,
                    'Flux',
                  ]}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Line
                  type="monotone"
                  dataKey="flux"
                  stroke="#45ddc0"
                  strokeWidth={2}
                  dot={{ fill: '#45ddc0', r: 4 }}
                  activeDot={{ r: 6 }}
                  name="X-ray Flux"
                />
                {/* Predicted peak marker line */}
                <Line
                  type="monotone"
                  dataKey={() => 1.4e-5}
                  stroke="#fbbf24"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Predicted Peak"
                />
              </LineChart>
            </ResponsiveContainer>
            <p className="mt-4 text-xs text-muted-foreground italic">
              Dashed line indicates predicted peak X-ray flux. Historical data shown for context and validation.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
