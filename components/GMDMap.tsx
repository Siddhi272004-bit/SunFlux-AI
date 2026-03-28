'use client'

import { useEffect, useRef, useState } from 'react'

interface GMDMapProps {
  impactScore: number
  flareClass: string
}

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || 'AIzaSyBSDVLIfz1hjXdG8miLYJw6pmGzy8chwxM'

export default function GMDMap({ impactScore, flareClass }: GMDMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if ((window as any).google?.maps) {
      initMap()
      return
    }

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`
    script.async = true
    script.onload = () => initMap()
    document.head.appendChild(script)
  }, [])

  const initMap = () => {
    if (!mapRef.current) return

    const map = new (window as any).google.maps.Map(mapRef.current, {
      center: { lat: 30, lng: 0 },
      zoom: 2,
      mapTypeId: 'satellite',
      disableDefaultUI: true,
      backgroundColor: '#020617',
      styles: [
        { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
      ]
    })

    // Intensity scale for aurora
    const intensity = Math.max(0.1, impactScore)
    const auroraColor = flareClass === 'X' ? '#ff0000' : flareClass === 'M' ? '#ffaa00' : '#44ff00'

    // Aurora Northern Zone
    new (window as any).google.maps.Circle({
      map,
      center: { lat: 70, lng: 0 },
      radius: 2000000 + (intensity * 1500000),
      strokeColor: auroraColor,
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: auroraColor,
      fillOpacity: 0.15 + (intensity * 0.2),
    })

    // Aurora Southern Zone
    new (window as any).google.maps.Circle({
      map,
      center: { lat: -70, lng: 0 },
      radius: 2000000 + (intensity * 1500000),
      strokeColor: auroraColor,
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: auroraColor,
      fillOpacity: 0.15 + (intensity * 0.2),
    })

    setLoaded(true)
  }

  return (
    <div className="relative w-full h-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-slate-950">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-slate-900/50 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">Initalizing GEE Map...</p>
          </div>
        </div>
      )}
      <div ref={mapRef} className="w-full h-full" />
      
      {/* Map Overlay HUD */}
      <div className="absolute top-6 left-6 z-10 pointer-events-none">
        <div className="bg-black/60 backdrop-blur-md border border-white/10 p-4 rounded-xl space-y-1">
          <p className="text-[10px] font-bold text-blue-400 uppercase tracking-tighter">Satellite Feed: Active</p>
          <p className="text-xl font-bold text-white tracking-tight">Geomagnetic Disturbance View</p>
        </div>
      </div>
    </div>
  )
}
