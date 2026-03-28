'use client'

import { useEffect, useRef, useState } from 'react'

const API_KEY = 'AIzaSyBSDVLIfz1hjXdG8miLYJw6pmGzy8chwxM'

export default function GEETest() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Loading satellite map...')

  useEffect(() => {
    // Check if already loaded
    if ((window as any).google?.maps) {
      initMap()
      return
    }

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`
    script.async = true

    script.onload = () => initMap()
    script.onerror = () => {
      setStatus('error')
      setMessage('❌ Failed to load Maps API. Check your API key and make sure Maps JavaScript API is enabled in Cloud Console.')
    }

    document.head.appendChild(script)
  }, [])

  const initMap = () => {
    if (!mapRef.current) return

    try {
      const map = new (window as any).google.maps.Map(mapRef.current, {
        center: { lat: 20, lng: 0 },
        zoom: 2,
        mapTypeId: 'satellite',
        disableDefaultUI: true,
        backgroundColor: '#020617',
      })

      // Aurora zone — North pole high latitude band
      new (window as any).google.maps.Circle({
        map,
        center: { lat: 68, lng: 0 },
        radius: 2500000,
        strokeColor: '#ff4400',
        strokeOpacity: 0.9,
        strokeWeight: 2,
        fillColor: '#ff4400',
        fillOpacity: 0.18,
      })

      // Southern aurora zone
      new (window as any).google.maps.Circle({
        map,
        center: { lat: -68, lng: 0 },
        radius: 2500000,
        strokeColor: '#ff4400',
        strokeOpacity: 0.9,
        strokeWeight: 2,
        fillColor: '#ff4400',
        fillOpacity: 0.18,
      })

      setStatus('success')
      setMessage('✅ Satellite map loaded! Aurora zones visible.')
    } catch (e) {
      setStatus('error')
      setMessage('❌ Map init failed: ' + e)
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4 bg-slate-900 rounded-lg border border-slate-700">
      <div className="flex items-center gap-2">
        <div className={`h-3 w-3 rounded-full ${
          status === 'loading' ? 'bg-yellow-400 animate-pulse' :
          status === 'success' ? 'bg-green-400' : 'bg-red-400'
        }`} />
        <p className="text-sm font-mono text-slate-300">{message}</p>
      </div>
      <div ref={mapRef} className="w-full rounded-lg border border-slate-600" style={{ height: '400px' }} />
    </div>
  )
}