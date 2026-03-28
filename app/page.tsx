// 'use client'

// import { useState, useEffect } from 'react'
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { AlertCircle, Activity, Loader2 } from 'lucide-react'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import dynamic from 'next/dynamic'
// import SolarChatbot from '@/components/SolarChatbot'
// // Sample historical data
// const historicalXrayData = [
//   { time: '2024-12-20 08:00', flux: 1.2e-6 },
//   { time: '2024-12-20 09:00', flux: 1.5e-6 },
//   { time: '2024-12-20 10:00', flux: 2.1e-6 },
//   { time: '2024-12-20 11:00', flux: 3.4e-6 },
//   { time: '2024-12-20 12:00', flux: 5.8e-6 },
//   { time: '2024-12-20 13:00', flux: 8.2e-6 },
//   { time: '2024-12-20 14:00', flux: 6.5e-6 },
//   { time: '2024-12-20 15:00', flux: 4.2e-6 },
//   { time: '2024-12-20 16:00', flux: 2.8e-6 },
//   { time: '2024-12-20 17:00', flux: 1.9e-6 },
// ]

// // Solar heatmap simulation data
// // Heatmap points will be provided by the backend response

// // Use dynamic import to avoid SSR issues with Three.js
// const SolarCanvas = dynamic(() => import('@/components/SolarSystem'), {
//   ssr: false,
//   loading: () => <div className="h-full w-full flex items-center justify-center bg-slate-900">Loading Solar Model...</div>
// })

// export default function Dashboard() {
//   const [observations, setObservations] = useState<{ ar: string, timestamp: string }[]>([])
//   const [selectedAR, setSelectedAR] = useState<string>('')
//   const [selectedTimestamp, setSelectedTimestamp] = useState<string>('')
//   const [analysisResult, setAnalysisResult] = useState<any>(null)
//   const [loading, setLoading] = useState(false)

//   useEffect(() => {
//     let isMounted = true; // Prevents updating state if component unmounts
//     fetch('http://localhost:8000/observations')
//       .then(res => {
//         if (!res.ok) throw new Error('Server offline');
//         return res.json();
//       })
//       .then(data => {
//         if (isMounted && data.length > 0) {
//           setObservations(data);
//           setSelectedAR(data[0].ar);
//           setSelectedTimestamp(data[0].timestamp);
//         }
//       })
//       .catch(err => {
//         console.warn("Backend offline: Dashboard running in simulation mode.")
//       });
//     return () => { isMounted = false; };
//   }, []);

//   useEffect(() => {
//     if (selectedAR && selectedTimestamp) {
//       handleAnalyze()
//     }
//   }, [selectedAR, selectedTimestamp])

//   const handleAnalyze = async () => {
//     setLoading(true)
//     try {
//       const response = await fetch('http://localhost:8000/analyze', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ ar: selectedAR, timestamp: selectedTimestamp })
//       })
//       const data = await response.json()
//       setAnalysisResult(data)
//     } catch (err) {
//       console.error("Analysis failed:", err)
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Get timestamps for selected AR
//   const availableTimestamps = Array.from(new Set(observations.filter(o => o.ar === selectedAR).map(o => o.timestamp)))
//   // Get unique ARs
//   const availableARs = Array.from(new Set(observations.map(o => o.ar)))

//   return (
//     <div className="min-h-screen bg-background text-foreground">
//       {/* Header */}
//       <header className="border-b border-border bg-secondary/20 backdrop-blur">
//         <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
//                 <Activity className="h-6 w-6" />
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold tracking-tight">SunFlux AI</h1>
//                 <p className="text-sm text-muted-foreground">Space Weather Analysis System</p>
//               </div>
//             </div>

//             {/* Observation Selector */}
//             <div className="flex items-center gap-4">
//               <div className="flex flex-col gap-1">
//                 <span className="text-[10px] uppercase font-bold text-muted-foreground">Active Region</span>
//                 <Select value={selectedAR} onValueChange={(val) => {
//                   setSelectedAR(val)
//                   const firstTs = observations.find(o => o.ar === val)?.timestamp
//                   if (firstTs) setSelectedTimestamp(firstTs)
//                 }}>
//                   <SelectTrigger className="w-[140px] h-9 bg-background/50">
//                     <SelectValue placeholder="Select AR" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {availableARs.map(ar => (
//                       <SelectItem key={ar} value={ar}>{ar}</SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="flex flex-col gap-1">
//                 <span className="text-[10px] uppercase font-bold text-muted-foreground">Timestamp</span>
//                 <Select value={selectedTimestamp} onValueChange={setSelectedTimestamp}>
//                   <SelectTrigger className="w-[220px] h-9 bg-background/50">
//                     <SelectValue placeholder="Select Time" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {availableTimestamps.map(ts => (
//                       <SelectItem key={ts} value={ts}>{ts}</SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               {loading && <Loader2 className="h-5 w-5 animate-spin text-primary mt-4" />}
//             </div>

//             <div className="hidden lg:block text-right text-sm text-muted-foreground">
//               <p>Last Updated: 2024-12-20 17:45 UTC</p>
//             </div>
//           </div>
//         </div>
//       </header>

//       <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
//         {/* Information Cards - Top Section */}
//         <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//           {/* Active Region Card */}
//           <Card className="border-border/50 bg-card/50 backdrop-blur">
//             <CardHeader className="pb-3">
//               <CardTitle className="text-sm font-semibold">Active Region</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-2">
//                 <div className="text-3xl font-bold text-primary">AR{selectedAR || '---'}</div>
//                 <p className="text-xs text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis">
//                   {selectedTimestamp || 'No data selected'}
//                 </p>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Flare Detection Card */}
//           <Card className="border-border/50 bg-card/50 backdrop-blur">
//             <CardHeader className="pb-3">
//               <CardTitle className="text-sm font-semibold">Flare Detection</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-2">
//                 <div className="flex items-center gap-2">
//                   <div className={`h-3 w-3 rounded-full ${analysisResult?.flare_detected ? 'bg-primary animate-pulse' : 'bg-muted'}`} />
//                   <span className="text-2xl font-bold text-primary">
//                     {analysisResult ? (analysisResult.flare_detected ? 'YES' : 'NO') : '---'}
//                   </span>
//                 </div>
//                 <div className="text-3xl font-bold">
//                   {analysisResult ? `${(analysisResult.flare_probability * 100).toFixed(1)}%` : '---'}
//                 </div>
//                 <p className="text-xs text-muted-foreground">
//                   Confidence from CNN model
//                 </p>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Flare Magnitude Card */}
//           <Card className="border-border/50 bg-card/50 backdrop-blur">
//             <CardHeader className="pb-3">
//               <CardTitle className="text-sm font-semibold">Flare Magnitude</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-2">
//                 <div className="space-y-1">
//                   <p className="text-xs font-semibold text-muted-foreground">Peak X-ray Flux</p>
//                   <p className="text-2xl font-bold font-mono">
//                     {analysisResult ? `${analysisResult.peak_flux.toExponential(2)} W/m²` : '---'}
//                   </p>
//                 </div>
//                 <div className="space-y-1">
//                   <p className="text-xs font-semibold text-muted-foreground">Derived Class</p>
//                   <p className="text-3xl font-bold text-primary">
//                     {analysisResult ? `${analysisResult.flare_class}` : '---'}
//                   </p>
//                 </div>
//                 <p className="text-xs text-muted-foreground italic">
//                   Derived from model output
//                 </p>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Geomagnetic Impact Card */}
//           <Card className="border-border/50 bg-card/50 backdrop-blur">
//             <CardHeader className="pb-3">
//               <CardTitle className="text-sm font-semibold">Geomagnetic Disturbance</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-2">
//                 <div className="inline-block rounded-full bg-amber-950/30 px-3 py-1">
//                   <span className="text-sm font-bold text-amber-400">
//                     {analysisResult ? (analysisResult.flare_detected ? 'MODERATE' : 'QUIET') : 'MODERATE'}
//                   </span>
//                 </div>
//                 <p className="text-xs text-muted-foreground">
//                   Estimated impact based on detected flare activity
//                 </p>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Main Visualization Section */}
//         <div className="mb-8 grid gap-8 lg:grid-cols-3">
//           {/* Solar Image with Heatmap */}
//           <div className="lg:col-span-2">
//             <Card className="border-border/50 bg-card/50 backdrop-blur">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   Solar Imagery - Model Attention (Grad-CAM)
//                   <AlertCircle className="h-4 w-4 text-muted-foreground" />
//                 </CardTitle>
//                 <CardDescription>
//                   Highlights regions contributing most to the prediction
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 {/* The container for the 3D Sun. We keep the aspect-square to maintain the layout. */}
//                 <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-border/50 bg-slate-950 shadow-2xl">

//                   {/* 3D Solar Visualization */}
//                   <SolarCanvas heatmapPoints={analysisResult?.attention_regions || []} />

//                   {/* Overlay: Legend - Absolute positioned to stay on top of the Canvas */}
//                   <div className="absolute bottom-4 left-4 rounded-lg bg-background/80 px-3 py-2 backdrop-blur pointer-events-none border border-border/50 z-10">
//                     <div className="text-xs text-muted-foreground">
//                       <p className="font-semibold text-foreground">Model Attention Regions</p>
//                       <p className="flex items-center gap-2 mt-1">
//                         <span className="h-2 w-2 rounded-full bg-[#45ddc0] shadow-[0_0_5px_#45ddc0]" />
//                         Intensity scale: Low → High
//                       </p>
//                     </div>
//                   </div>

//                   {/* Optional: AR Label Overlay */}
//                   <div className="absolute top-4 right-4 pointer-events-none z-10">
//                     <div className="rounded-md bg-black/40 px-2 py-1 border border-white/10 backdrop-blur-sm">
//                       <p className="text-[10px] font-mono text-primary uppercase tracking-tighter">
//                         System: Active-3D-Render
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Risk Assessment Sidebar */}
//           <div className="flex flex-col gap-4">
//             <Card className="border-border/50 bg-card/50 backdrop-blur">
//               <CardHeader>
//                 <CardTitle className="text-base">Risk Assessment</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div>
//                   <div className="mb-2 flex items-center justify-between">
//                     <span className="text-sm font-semibold">Flare Probability</span>
//                     <span className="text-lg font-bold text-primary">
//                       {analysisResult ? `${(analysisResult.flare_probability * 100).toFixed(0)}%` : '85%'}
//                     </span>
//                   </div>
//                   <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
//                     <div
//                       className="h-full bg-primary"
//                       style={{ width: analysisResult ? `${analysisResult.flare_probability * 100}%` : '85%' }}
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <div className="mb-2 flex items-center justify-between">
//                     <span className="text-sm font-semibold">Impact Severity</span>
//                     <span className={`text-lg font-bold ${analysisResult?.flare_detected ? 'text-amber-400' : 'text-green-400'}`}>
//                       {analysisResult ? (analysisResult.flare_detected ? 'MODERATE' : 'LOW') : 'MODERATE'}
//                     </span>
//                   </div>
//                   <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
//                     <div
//                       className={`h-full ${analysisResult?.flare_detected ? 'bg-amber-500' : 'bg-green-500'}`}
//                       style={{ width: analysisResult ? (analysisResult.flare_detected ? '65%' : '20%') : '65%' }}
//                     />
//                   </div>
//                 </div>

//                 <div className="rounded-lg bg-muted/30 p-3">
//                   <p className="text-xs font-semibold text-muted-foreground mb-1">KEY METRICS</p>
//                   <div className="space-y-2 text-xs">
//                     <div className="flex justify-between">
//                       <span className="text-muted-foreground">Confidence Score:</span>
//                       <span className="font-semibold">{analysisResult ? '94%' : '92%'}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-muted-foreground">Model Consensus:</span>
//                       <span className="font-semibold">4/5 Models</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-muted-foreground">Time Window:</span>
//                       <span className="font-semibold">6-48h</span>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card className="border-border/50 bg-card/50 backdrop-blur">
//               <CardHeader>
//                 <CardTitle className="text-sm text-muted-foreground">⚠️ SCIENTIFIC DISCLAIMER</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-xs leading-relaxed text-muted-foreground">
//                   This analysis is for educational and research purposes. Not intended for operational decision-making. Actual impacts depend on CME trajectory and space weather conditions.
//                 </p>
//               </CardContent>
//             </Card>
//           </div>
//         </div>

//         {/* Historical Context Chart */}
//         <Card className="border-border/50 bg-card/50 backdrop-blur">
//           <CardHeader>
//             <CardTitle>Historical GOES X-ray Flux</CardTitle>
//             <CardDescription>
//               Previous observations for context (not a forecast)
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={300}>
//               <LineChart data={historicalXrayData}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
//                 <XAxis
//                   dataKey="time"
//                   tick={{ fontSize: 12 }}
//                   stroke="#cbd5e0"
//                   angle={-45}
//                   textAnchor="end"
//                   height={80}
//                 />
//                 <YAxis
//                   tick={{ fontSize: 12 }}
//                   stroke="#cbd5e0"
//                   label={{ value: 'Flux (W/m²)', angle: -90, position: 'insideLeft' }}
//                   tickFormatter={(value) => `${value.toExponential(1)}`}
//                 />
//                 <Tooltip
//                   contentStyle={{
//                     backgroundColor: '#1a202c',
//                     border: '1px solid #4a5568',
//                     borderRadius: '0.5rem',
//                   }}
//                   formatter={(value) => [
//                     `${(value as number).toExponential(2)} W/m²`,
//                     'Flux',
//                   ]}
//                 />
//                 <Legend wrapperStyle={{ paddingTop: '20px' }} />
//                 <Line
//                   type="monotone"
//                   dataKey="flux"
//                   stroke="#45ddc0"
//                   strokeWidth={2}
//                   dot={{ fill: '#45ddc0', r: 4 }}
//                   activeDot={{ r: 6 }}
//                   name="X-ray Flux"
//                 />
//                 {/* Predicted peak marker line */}
//                 <Line
//                   type="monotone"
//                   dataKey={() => 1.4e-5}
//                   stroke="#fbbf24"
//                   strokeWidth={2}
//                   strokeDasharray="5 5"
//                   dot={false}
//                   name="Predicted Peak"
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//             <p className="mt-4 text-xs text-muted-foreground italic">
//               Dashed line indicates predicted peak X-ray flux. Historical data shown for context and validation.
//             </p>
//           </CardContent>
//         </Card>
//       </main>
//       <SolarChatbot analysisResult={analysisResult} selectedAR={selectedAR} selectedTimestamp={selectedTimestamp} />
//     </div>
//   )
// }


'use client'

import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, Activity, Loader2, Globe } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import dynamic from 'next/dynamic'
import SolarChatbot from '@/components/SolarChatbot'
import Link from 'next/link'

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

const SolarCanvas = dynamic(() => import('@/components/SolarSystem'), {
  ssr: false,
  loading: () => <div className="h-full w-full flex items-center justify-center bg-slate-900">Loading Solar Model...</div>
})

export default function Dashboard() {
  const [observations, setObservations] = useState<{ ar: string, timestamp: string }[]>([])
  const [selectedAR, setSelectedAR] = useState<string>('')
  const [selectedTimestamp, setSelectedTimestamp] = useState<string>('')
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let isMounted = true
    fetch('http://localhost:8000/observations')
      .then(res => {
        if (!res.ok) throw new Error('Server offline')
        return res.json()
      })
      .then(data => {
        if (isMounted && data.length > 0) {
          setObservations(data)
          setSelectedAR(data[0].ar)
          setSelectedTimestamp(data[0].timestamp)
        }
      })
      .catch(() => console.warn("Backend offline: Dashboard running in simulation mode."))
    return () => { isMounted = false }
  }, [])

  useEffect(() => {
    if (selectedAR && selectedTimestamp) handleAnalyze()
  }, [selectedAR, selectedTimestamp])

  const handleAnalyze = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ar: selectedAR, timestamp: selectedTimestamp })
      })
      const data = await response.json()
      setAnalysisResult(data)
    } catch (err) {
      console.error("Analysis failed:", err)
    } finally {
      setLoading(false)
    }
  }

  const availableTimestamps = Array.from(new Set(observations.filter(o => o.ar === selectedAR).map(o => o.timestamp)))
  const availableARs = Array.from(new Set(observations.map(o => o.ar)))

  // Build impact page URL from current analysis
  const impactUrl = `/impact?ar=${selectedAR}&prob=${analysisResult?.flare_probability ?? 0.5}&class=${analysisResult?.flare_class ?? 'C'}`

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
                <h1 className="text-2xl font-bold tracking-tight">SunFlux AI</h1>
                <p className="text-sm text-muted-foreground">Space Weather Analysis System</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Active Region</span>
                <Select value={selectedAR} onValueChange={(val) => {
                  setSelectedAR(val)
                  const firstTs = observations.find(o => o.ar === val)?.timestamp
                  if (firstTs) setSelectedTimestamp(firstTs)
                }}>
                  <SelectTrigger className="w-[140px] h-9 bg-background/50">
                    <SelectValue placeholder="Select AR" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableARs.map(ar => (
                      <SelectItem key={ar} value={ar}>{ar}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Timestamp</span>
                <Select value={selectedTimestamp} onValueChange={setSelectedTimestamp}>
                  <SelectTrigger className="w-[220px] h-9 bg-background/50">
                    <SelectValue placeholder="Select Time" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTimestamps.map(ts => (
                      <SelectItem key={ts} value={ts}>{ts}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {loading && <Loader2 className="h-5 w-5 animate-spin text-primary mt-4" />}
            </div>

            <div className="hidden lg:block text-right text-sm text-muted-foreground">
              <p>Last Updated: 2024-12-20 17:45 UTC</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Information Cards */}
        <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Active Region Card */}
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Active Region</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">AR{selectedAR || '---'}</div>
                <p className="text-xs text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis">
                  {selectedTimestamp || 'No data selected'}
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
                  <div className={`h-3 w-3 rounded-full ${analysisResult?.flare_detected ? 'bg-primary animate-pulse' : 'bg-muted'}`} />
                  <span className="text-2xl font-bold text-primary">
                    {analysisResult ? (analysisResult.flare_detected ? 'YES' : 'NO') : '---'}
                  </span>
                </div>
                <div className="text-3xl font-bold">
                  {analysisResult ? `${(analysisResult.flare_probability * 100).toFixed(1)}%` : '---'}
                </div>
                <p className="text-xs text-muted-foreground">Confidence from CNN model</p>
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
                  <p className="text-2xl font-bold font-mono">
                    {analysisResult ? `${analysisResult.peak_flux.toExponential(2)} W/m²` : '---'}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground">Derived Class</p>
                  <p className="text-3xl font-bold text-primary">
                    {analysisResult ? `${analysisResult.flare_class}` : '---'}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground italic">Derived from model output</p>
              </div>
            </CardContent>
          </Card>

          {/* Geomagnetic Impact Card — with Earth Impact Map button */}
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Geomagnetic Disturbance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="inline-block rounded-full bg-amber-950/30 px-3 py-1">
                  <span className="text-sm font-bold text-amber-400">
                    {analysisResult ? (analysisResult.flare_detected ? 'MODERATE' : 'QUIET') : 'MODERATE'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Estimated impact based on detected flare activity
                </p>
                {/* ← Earth Impact Map button */}
                <Link
                  href={impactUrl}
                  className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors group"
                >
                  <Globe className="h-3.5 w-3.5 group-hover:animate-spin" />
                  View Earth Impact Map →
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Visualization Section */}
        <div className="mb-8 grid gap-8 lg:grid-cols-3">
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
                <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-border/50 bg-slate-950 shadow-2xl">
                  <SolarCanvas heatmapPoints={analysisResult?.attention_regions || []} />
                  <div className="absolute bottom-4 left-4 rounded-lg bg-background/80 px-3 py-2 backdrop-blur pointer-events-none border border-border/50 z-10">
                    <div className="text-xs text-muted-foreground">
                      <p className="font-semibold text-foreground">Model Attention Regions</p>
                      <p className="flex items-center gap-2 mt-1">
                        <span className="h-2 w-2 rounded-full bg-[#45ddc0] shadow-[0_0_5px_#45ddc0]" />
                        Intensity scale: Low → High
                      </p>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 pointer-events-none z-10">
                    <div className="rounded-md bg-black/40 px-2 py-1 border border-white/10 backdrop-blur-sm">
                      <p className="text-[10px] font-mono text-primary uppercase tracking-tighter">
                        System: Active-3D-Render
                      </p>
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
                    <span className="text-lg font-bold text-primary">
                      {analysisResult ? `${(analysisResult.flare_probability * 100).toFixed(0)}%` : '85%'}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-primary"
                      style={{ width: analysisResult ? `${analysisResult.flare_probability * 100}%` : '85%' }}
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-semibold">Impact Severity</span>
                    <span className={`text-lg font-bold ${analysisResult?.flare_detected ? 'text-amber-400' : 'text-green-400'}`}>
                      {analysisResult ? (analysisResult.flare_detected ? 'MODERATE' : 'LOW') : 'MODERATE'}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full ${analysisResult?.flare_detected ? 'bg-amber-500' : 'bg-green-500'}`}
                      style={{ width: analysisResult ? (analysisResult.flare_detected ? '65%' : '20%') : '65%' }}
                    />
                  </div>
                </div>

                <div className="rounded-lg bg-muted/30 p-3">
                  <p className="text-xs font-semibold text-muted-foreground mb-1">KEY METRICS</p>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Confidence Score:</span>
                      <span className="font-semibold">{analysisResult ? '94%' : '92%'}</span>
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
            <CardDescription>Previous observations for context (not a forecast)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={historicalXrayData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                <XAxis dataKey="time" tick={{ fontSize: 12 }} stroke="#cbd5e0" angle={-45} textAnchor="end" height={80} />
                <YAxis tick={{ fontSize: 12 }} stroke="#cbd5e0" label={{ value: 'Flux (W/m²)', angle: -90, position: 'insideLeft' }} tickFormatter={(value) => `${value.toExponential(1)}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a202c', border: '1px solid #4a5568', borderRadius: '0.5rem' }}
                  formatter={(value) => [`${(value as number).toExponential(2)} W/m²`, 'Flux']}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Line type="monotone" dataKey="flux" stroke="#45ddc0" strokeWidth={2} dot={{ fill: '#45ddc0', r: 4 }} activeDot={{ r: 6 }} name="X-ray Flux" />
                <Line type="monotone" dataKey={() => analysisResult?.peak_flux ?? 1.4e-5} stroke="#fbbf24" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Predicted Peak" />
              </LineChart>
            </ResponsiveContainer>
            <p className="mt-4 text-xs text-muted-foreground italic">
              Dashed line indicates predicted peak X-ray flux. Historical data shown for context and validation.
            </p>
          </CardContent>
        </Card>
      </main>

      <SolarChatbot analysisResult={analysisResult} selectedAR={selectedAR} selectedTimestamp={selectedTimestamp} />
    </div>
  )
}