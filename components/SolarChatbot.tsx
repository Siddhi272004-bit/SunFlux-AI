'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Send, Loader2 } from 'lucide-react'

// Sun corona SVG icon — pulses like a real star
function SolarIcon({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <defs>
        <radialGradient id="sunCore" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff7aa" />
          <stop offset="40%" stopColor="#ffb300" />
          <stop offset="100%" stopColor="#ff6a00" />
        </radialGradient>
        <radialGradient id="coronaGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff6a00" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#ff6a00" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Outer corona glow */}
      <circle cx="50" cy="50" r="48" fill="url(#coronaGlow)" />
      {/* Corona rays */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
        <line
          key={i}
          x1="50" y1="50"
          x2={50 + 46 * Math.cos((angle * Math.PI) / 180)}
          y2={50 + 46 * Math.sin((angle * Math.PI) / 180)}
          stroke="#ff8c00"
          strokeWidth={i % 3 === 0 ? "2" : "1"}
          strokeOpacity={i % 3 === 0 ? "0.8" : "0.4"}
        />
      ))}
      {/* Sun core */}
      <circle cx="50" cy="50" r="28" fill="url(#sunCore)" />
      {/* Surface texture dots */}
      <circle cx="42" cy="44" r="3" fill="#ff6a00" fillOpacity="0.4" />
      <circle cx="58" cy="52" r="2" fill="#ff4400" fillOpacity="0.5" />
      <circle cx="48" cy="58" r="2.5" fill="#ff6a00" fillOpacity="0.3" />
    </svg>
  )
}

interface Message {
  role: 'user' | 'assistant'
  content: string
  model?: string
}

interface SolarChatbotProps {
  analysisResult?: {
    flare_detected: boolean
    flare_probability: number
  } | null
  selectedAR?: string
  selectedTimestamp?: string
}

export default function SolarChatbot({ analysisResult, selectedAR, selectedTimestamp }: SolarChatbotProps) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hello! I'm Helios, your solar weather AI. I can explain the current flare predictions, interpret the X-ray flux charts, and analyze geomagnetic impact risks. What would you like to know?`,
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [pulseActive, setPulseActive] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Stop pulse after first open
  useEffect(() => {
    if (open) setPulseActive(false)
  }, [open])

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      const context = {
        active_region: selectedAR || 'Unknown',
        timestamp: selectedTimestamp || 'Unknown',
        flare_detected: analysisResult?.flare_detected ?? null,
        flare_probability: analysisResult?.flare_probability ?? null,
      }

      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          context,
          history: messages.slice(-6), // last 6 messages for context window
        })
      })

      if (!response.ok) throw new Error('Backend offline')

      const data = await response.json()
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response,
        model: data.model_used,
      }])
    } catch {
      // Fallback: client-side response when backend is offline
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: getOfflineResponse(userMessage, analysisResult),
        model: 'offline-fallback',
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating button */}
      <div className="fixed bottom-6 right-6 z-50">
        {/* Pulse ring animation */}
        {pulseActive && (
          <>
            <div className="absolute inset-0 rounded-full bg-orange-500 animate-ping opacity-30" />
            <div className="absolute inset-0 rounded-full bg-orange-400 animate-pulse opacity-20" />
          </>
        )}
        <button
          onClick={() => setOpen(o => !o)}
          className="relative flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-transform hover:scale-110 active:scale-95"
          style={{
            background: 'radial-gradient(circle at 40% 35%, #fff7aa, #ffb300 50%, #ff6a00)',
            boxShadow: '0 0 20px #ff8c0088, 0 0 40px #ff450044',
          }}
          title="Ask Helios AI"
        >
          {open
            ? <X className="h-6 w-6 text-orange-900" />
            : <SolarIcon size={36} />
          }
        </button>
      </div>

      {/* Chat panel */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 flex flex-col rounded-2xl border border-orange-900/40 shadow-2xl overflow-hidden"
          style={{
            width: '360px',
            height: '520px',
            background: 'linear-gradient(160deg, #0a0a1a 0%, #0f0a00 100%)',
            boxShadow: '0 0 40px #ff6a0022, 0 20px 60px #00000088',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-3 px-4 py-3 border-b border-orange-900/30"
            style={{ background: 'linear-gradient(90deg, #1a0800, #0a0a1a)' }}
          >
            <SolarIcon size={32} />
            <div>
              <p className="text-sm font-bold text-orange-200 tracking-wide">HELIOS AI</p>
              <p className="text-[10px] text-orange-500/70 uppercase tracking-widest">Solar Weather Assistant</p>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[10px] text-green-400/80">Online</span>
            </div>
          </div>

          {/* Context pill — shows current AR data */}
          {analysisResult && (
            <div className="mx-3 mt-2 px-3 py-1.5 rounded-lg bg-orange-950/40 border border-orange-900/30 flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${analysisResult.flare_detected ? 'bg-red-400 animate-pulse' : 'bg-green-400'}`} />
              <span className="text-[11px] text-orange-300/80 font-mono">
                AR{selectedAR} · {(analysisResult.flare_probability * 100).toFixed(1)}% flare probability
              </span>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 scrollbar-thin scrollbar-thumb-orange-900/40">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[82%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'rounded-br-sm text-orange-50'
                      : 'rounded-bl-sm text-orange-100/90'
                  }`}
                  style={msg.role === 'user'
                    ? { background: 'linear-gradient(135deg, #ff6a00, #ff8c00)' }
                    : { background: 'rgba(255,140,0,0.08)', border: '1px solid rgba(255,140,0,0.15)' }
                  }
                >
                  {msg.content}
                  {msg.model && (
                    <p className="text-[9px] text-orange-500/50 mt-1 text-right">{msg.model}</p>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-sm px-3 py-2" style={{ background: 'rgba(255,140,0,0.08)', border: '1px solid rgba(255,140,0,0.15)' }}>
                  <Loader2 className="h-4 w-4 text-orange-400 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-3 pb-3 pt-2 border-t border-orange-900/30">
            <div className="flex gap-2 items-center rounded-xl px-3 py-2" style={{ background: 'rgba(255,140,0,0.06)', border: '1px solid rgba(255,140,0,0.2)' }}>
              <input
                className="flex-1 bg-transparent text-sm text-orange-100 placeholder-orange-700/60 outline-none"
                placeholder="Ask about flares, GMD impact..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="flex items-center justify-center h-7 w-7 rounded-lg transition-all hover:scale-110 disabled:opacity-40"
                style={{ background: 'linear-gradient(135deg, #ff6a00, #ffb300)' }}
              >
                <Send className="h-3.5 w-3.5 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// Offline fallback responses when backend is down
function getOfflineResponse(message: string, analysisResult: SolarChatbotProps['analysisResult']): string {
  const msg = message.toLowerCase()
  const prob = analysisResult ? (analysisResult.flare_probability * 100).toFixed(1) : null

  if (msg.includes('flare') || msg.includes('predict')) {
    return prob
      ? `The current model predicts a ${prob}% flare probability for this active region. ${parseFloat(prob) > 70 ? 'This is a high-risk reading — M or X class activity is likely within 6-48 hours.' : 'This indicates moderate activity. Continue monitoring for changes.'}`
      : 'No prediction data is currently loaded. Select an active region from the dropdown to see flare probability.'
  }
  if (msg.includes('gmd') || msg.includes('geomagnetic') || msg.includes('impact')) {
    return 'Geomagnetic disturbances from solar flares typically affect high-latitude regions first. M-class flares can cause minor grid fluctuations and radio blackouts; X-class events risk significant infrastructure disruption within 1-3 days of the CME arrival.'
  }
  if (msg.includes('chart') || msg.includes('flux') || msg.includes('goes')) {
    return 'The GOES X-ray flux chart shows historical 1-8Å band measurements. The dashed yellow line marks the predicted peak flux. Values above 1×10⁻⁵ W/m² indicate M-class territory; above 1×10⁻⁴ is X-class.'
  }
  return 'I\'m currently running in offline mode — the backend is not connected. I can still answer general space weather questions! Try asking about flare classes, geomagnetic impacts, or how to interpret the X-ray flux chart.'
}