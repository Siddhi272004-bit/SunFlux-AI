'use client'

import { useSearchParams } from 'next/navigation'
import GMDMap from '@/components/GMDMap'
import { Suspense } from 'react'
import Link from 'next/link'
import { ArrowLeft, Zap, ShieldAlert, Radio } from 'lucide-react'

function ImpactContent() {
  const searchParams = useSearchParams()
  const ar = searchParams.get('ar') || '---'
  const prob = parseFloat(searchParams.get('prob') || '0.5')
  const flareClass = searchParams.get('class') || 'C'

  // Derive GMD Scale
  const getGMDScale = (fc: string) => {
    if (fc === 'X') return { level: 'G4-G5', label: 'EXTREME', color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' }
    if (fc === 'M') return { level: 'G2-G3', label: 'STRONG', color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20' }
    if (fc === 'C') return { level: 'G1', label: 'MINOR', color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' }
    return { level: 'G0', label: 'QUIET', color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20' }
  }

  const gmd = getGMDScale(flareClass)

  return (
    <main className="min-h-screen w-full bg-[#020617] text-white p-6 lg:p-10 flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/20 border border-primary/50 flex items-center justify-center">
              <ShieldAlert className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tighter">EARTH IMPACT ADVISORY</h1>
          </div>
          <p className="text-slate-400 text-sm font-medium">Global Geomagnetic Disturbance (GMD) Analysis Model</p>
        </div>
        
        <Link 
          href="/"
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm transition-all backdrop-blur-md"
        >
          <ArrowLeft className="h-4 w-4" />
          Return to Dashboard
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 flex-1">
        {/* Left Column: Metrics & GMD Details */}
        <div className="space-y-6">
          {/* GMD Scale Card */}
          <div className={`p-6 rounded-3xl border ${gmd.border} ${gmd.bg} backdrop-blur-xl space-y-4`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest opacity-60">GMD Scale Level</span>
              <Zap className={`h-5 w-5 ${gmd.color}`} />
            </div>
            <div className="space-y-1">
              <p className={`text-6xl font-black ${gmd.color}`}>{gmd.level}</p>
              <p className="text-xl font-bold tracking-tight">{gmd.label} STORM</p>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed italic">
              Derived from Peak X-ray Flux and Solar Flare classification (AR{ar}).
            </p>
          </div>

          {/* Impact Categories */}
          <div className="grid gap-4">
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-center gap-3">
                <Radio className="h-5 w-5 text-blue-400" />
                <h3 className="font-bold">HF Radio Comms</h3>
              </div>
              <p className="text-sm text-slate-400">
                {flareClass === 'X' ? 'Complete blackout on sunlit side for hours.' : flareClass === 'M' ? 'Frequent fades, degraded navigation signals.' : 'Nominal signal propagation.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-center gap-3">
                <Zap className="h-5 w-5 text-yellow-400" />
                <h3 className="font-bold">Power Grid</h3>
              </div>
              <p className="text-sm text-slate-400">
                {flareClass === 'X' ? 'Voltage control issues and protective system trips likely.' : flareClass === 'M' ? 'Voltage alarms at high latitudes.' : 'No significant impact on power infrastructure.'}
              </p>
            </div>
          </div>
        </div>

        {/* Center/Right Column: GEE Map Visualization */}
        <div className="lg:col-span-2 h-[600px] lg:h-auto overflow-hidden rounded-3xl relative">
          <GMDMap impactScore={prob} flareClass={flareClass} />
          
          {/* HUD Overlay Bottom Right */}
          <div className="absolute bottom-6 right-6 z-10">
            <div className="bg-black/80 backdrop-blur-xl border border-white/10 p-6 rounded-2xl space-y-4 w-64">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Impact Probability</p>
                <div className="flex items-end justify-between">
                  <p className="text-4xl font-bold">{(prob * 100).toFixed(1)}%</p>
                  <div className={`h-2 w-2 rounded-full mb-2 ${prob > 0.7 ? 'bg-red-500 animate-ping' : 'bg-green-500'}`} />
                </div>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r from-blue-500 to-red-500 transition-all duration-1000`}
                  style={{ width: `${prob * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function ImpactPage() {
  return (
    <Suspense fallback={<div className="h-screen w-full bg-[#020617] flex items-center justify-center text-white">Loading Impact Advisory...</div>}>
      <ImpactContent />
    </Suspense>
  )
}
