'use client'

import React, { Suspense, useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PresentationControls, Center, Stars, PerspectiveCamera, Float, Html } from '@react-three/drei'
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'

const earthVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vViewDir;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewDir = normalize(-mvPosition.xyz);
    gl_Position = projectionMatrix * mvPosition;
  }
`

const earthFragmentShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  uniform float uTime;
  uniform float uImpact;

  void main() {
    // Holographic grid
    float grid = sin(vUv.x * 50.0) * sin(vUv.y * 50.0);
    grid = smoothstep(0.9, 1.0, grid);

    // Fresnel effect for atmosphere
    float fresnel = pow(1.0 - dot(vNormal, vViewDir), 3.0);
    
    // Impact glow near poles (aurora effect)
    float aurora = smoothstep(0.4, 1.0, abs(vNormal.y)) * (0.5 + 0.5 * sin(uTime * 2.0 + vNormal.x * 10.0));
    vec3 impactColor = mix(vec3(0.1, 0.4, 1.0), vec3(1.0, 0.2, 0.1), uImpact);
    
    vec3 baseColor = vec3(0.02, 0.05, 0.1);
    vec3 color = mix(baseColor, impactColor * 2.0, grid * 0.5);
    color += impactColor * fresnel * 1.5;
    color += vec3(0.5, 0.8, 1.0) * aurora * uImpact * 2.0;

    gl_FragColor = vec4(color, 0.8);
  }
`

function EarthMesh({ impact = 0.5 }: { impact?: number }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  
  const material = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uImpact: { value: impact },
    },
    vertexShader: earthVertexShader,
    fragmentShader: earthFragmentShader,
    transparent: true,
    side: THREE.DoubleSide,
  }), [impact])

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1
    }
    material.uniforms.uTime.value = state.clock.elapsedTime
  })

  return (
    <mesh ref={meshRef} material={material}>
      <sphereGeometry args={[2.5, 64, 64]} />
    </mesh>
  )
}

function Atmosphere() {
  return (
    <mesh scale={[1.2, 1.2, 1.2]}>
      <sphereGeometry args={[2.5, 64, 64]} />
      <meshBasicMaterial
        color="#0066ff"
        transparent
        opacity={0.05}
        side={THREE.BackSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

export default function EarthImpact({ ar, prob, flareClass }: { ar: string, prob: number, flareClass: string }) {
  const impactLevel = flareClass === 'X' ? 1.0 : flareClass === 'M' ? 0.6 : 0.3

  return (
    <div className="h-full w-full bg-[#020617] relative">
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 8]} />
        <Suspense fallback={null}>
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <ambientLight intensity={0.2} />
          
          <PresentationControls global damping={0.2} snap rotation={[0, 0, 0]}>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
              <Center>
                <EarthMesh impact={impactLevel} />
                <Atmosphere />
              </Center>
            </Float>
          </PresentationControls>

          <EffectComposer>
            <Bloom intensity={1.5} luminanceThreshold={0.2} luminanceSmoothing={0.9} mipmapBlur />
            <Noise opacity={0.05} />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
          </EffectComposer>
        </Suspense>
      </Canvas>

      {/* UI Overlay */}
      <div className="absolute top-10 left-10 z-20 pointer-events-none">
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tighter">EARTH IMPACT MODEL</h1>
        <div className="flex gap-4 items-center">
          <div className="px-3 py-1 bg-primary/20 border border-primary/50 rounded-full">
            <span className="text-xs font-mono text-primary uppercase">Region: AR{ar}</span>
          </div>
          <div className="px-3 py-1 bg-amber-500/20 border border-amber-500/50 rounded-full">
            <span className="text-xs font-mono text-amber-500 uppercase">Class: {flareClass}</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 right-10 z-20 text-right pointer-events-none">
        <p className="text-sm font-mono text-blue-400 mb-1">GEOMAGNETIC RISK</p>
        <p className="text-6xl font-bold text-white">{(prob * 100).toFixed(1)}%</p>
        <div className="w-64 h-1 bg-slate-800 mt-2 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-red-500 transition-all duration-1000"
            style={{ width: `${prob * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}
