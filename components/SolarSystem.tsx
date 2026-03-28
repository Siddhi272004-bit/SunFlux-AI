// 'use client'

// import React, { Suspense, useRef, useMemo } from 'react'
// import { Canvas, useFrame } from '@react-three/fiber'
// import { PresentationControls, Center, Stars, PerspectiveCamera, useTexture } from '@react-three/drei'
// import * as THREE from 'three'

// // Vertex shader — passes UVs and normal to fragment
// const sunVertexShader = `
//   varying vec2 vUv;
//   varying vec3 vNormal;
//   varying vec3 vViewDir;

//   void main() {
//     vUv = uv;
//     vNormal = normalize(normalMatrix * normal);
//     vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
//     vViewDir = normalize(-mvPosition.xyz);
//     gl_Position = projectionMatrix * mvPosition;
//   }
// `

// // Fragment shader — samples texture, hides seam, adds emission + limb darkening
// const sunFragmentShader = `
//   uniform sampler2D uTexture;
//   uniform float uTime;

//   varying vec2 vUv;
//   varying vec3 vNormal;
//   varying vec3 vViewDir;

//   void main() {
//     // --- Seam fix: blend UVs near the seam (u ~ 0 or u ~ 1) ---
//     float seamBlend = smoothstep(0.0, 0.05, vUv.x) * smoothstep(1.0, 0.95, vUv.x);

//     // Sample main texture
//     vec4 texColor = texture2D(uTexture, vUv);

//     // Sample slightly offset UV to blend over the seam
//     vec2 uvOffset = vec2(vUv.x + 0.02, vUv.y);
//     if (uvOffset.x > 1.0) uvOffset.x -= 1.0;
//     vec4 texColorOffset = texture2D(uTexture, uvOffset);

//     // Blend near seam
//     vec4 color = mix(texColorOffset, texColor, seamBlend);

//     // --- Emission: boost brightness so it glows like Blender ---
//     // Multiply color to simulate emission strength ~4.5 (your Blender value)
//     vec3 emissive = color.rgb * 2.2;

//     // --- Limb darkening: edges darker, physically accurate ---
//     float rim = dot(vNormal, vViewDir);
//     rim = clamp(rim, 0.0, 1.0);
//     float limb = 0.3 + 0.7 * pow(rim, 0.5);
//     emissive *= limb;

//     gl_FragColor = vec4(emissive, 1.0);
//   }
// `

// function SunMesh() {
//   const meshRef = useRef<THREE.Mesh>(null!)
//   const texture = useTexture('/sun_baked.png')
//   texture.colorSpace = THREE.SRGBColorSpace
//   texture.wrapS = THREE.RepeatWrapping
//   texture.wrapT = THREE.RepeatWrapping

//   const material = useMemo(() => new THREE.ShaderMaterial({
//     uniforms: {
//       uTexture: { value: texture },
//       uTime: { value: 0 },
//     },
//     vertexShader: sunVertexShader,
//     fragmentShader: sunFragmentShader,
//   }), [texture])

//   useFrame((_state, delta) => {
//     if (meshRef.current) meshRef.current.rotation.y += delta * 0.04
//     material.uniforms.uTime.value += delta
//   })

//   return (
//     <mesh ref={meshRef} material={material}>
//       <sphereGeometry args={[2.2, 128, 128]} />
//     </mesh>
//   )
// }

// function CoronaGlow() {
//   return (
//     <group>
//       {/* Inner soft glow */}
//       <mesh>
//         <sphereGeometry args={[2.5, 64, 64]} />
//         <meshBasicMaterial
//           color="#ff8c00"
//           transparent
//           opacity={0.12}
//           side={THREE.BackSide}
//           blending={THREE.AdditiveBlending}
//           depthWrite={false}
//         />
//       </mesh>
//       {/* Outer corona */}
//       <mesh>
//         <sphereGeometry args={[2.85, 64, 64]} />
//         <meshBasicMaterial
//           color="#ff4500"
//           transparent
//           opacity={0.06}
//           side={THREE.BackSide}
//           blending={THREE.AdditiveBlending}
//           depthWrite={false}
//         />
//       </mesh>
//     </group>
//   )
// }

// interface HeatmapPointProps {
//   x: number
//   y: number
//   intensity: number
// }

// function HeatmapPoint({ x, y, intensity }: HeatmapPointProps) {
//   const posX = (x - 20) / 6
//   const posY = -(y - 20) / 6
//   return (
//     <mesh position={[posX, posY, 2.3]}>
//       <sphereGeometry args={[0.07 * intensity, 16, 16]} />
//       <meshBasicMaterial color="#45ddc0" transparent opacity={0.9} />
//     </mesh>
//   )
// }

// export default function SolarCanvas({ heatmapPoints = [] }: { heatmapPoints: HeatmapPointProps[] }) {
//   return (
//     <div className="h-full w-full bg-[#020617]">
//       <Canvas
//         dpr={[1, 2]}
//         gl={{
//           antialias: true,
//           toneMapping: THREE.NoToneMapping,
//           outputColorSpace: THREE.SRGBColorSpace,
//         }}
//       >
//         <PerspectiveCamera makeDefault position={[0, 0, 7]} />
//         <Suspense fallback={null}>
//           <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
//           <PresentationControls global damping={0.2} snap rotation={[0, 0.3, 0]}>
//             <Center>
//               <SunMesh />
//               <CoronaGlow />
//               {heatmapPoints.map((point, i) => (
//                 <HeatmapPoint key={i} {...point} />
//               ))}
//             </Center>
//           </PresentationControls>
//         </Suspense>
//       </Canvas>
//     </div>
//   )
// }

// 'use client'

// import React, { Suspense, useRef, useMemo } from 'react'
// import { Canvas, useFrame } from '@react-three/fiber'
// import { PresentationControls, Center, Stars, PerspectiveCamera, useTexture } from '@react-three/drei'
// import * as THREE from 'three'

// const sunVertexShader = `
//   varying vec2 vUv;
//   varying vec3 vNormal;
//   varying vec3 vViewDir;
//   void main() {
//     vUv = uv;
//     vNormal = normalize(normalMatrix * normal);
//     vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
//     vViewDir = normalize(-mvPosition.xyz);
//     gl_Position = projectionMatrix * mvPosition;
//   }
// `

// const sunFragmentShader = `
//   uniform sampler2D uTexture;
//   varying vec2 vUv;
//   varying vec3 vNormal;
//   varying vec3 vViewDir;

//   void main() {
//     // Seam fix
//     float seamBlend = smoothstep(0.0, 0.05, vUv.x) * smoothstep(1.0, 0.95, vUv.x);
//     vec2 uvOffset = vec2(mod(vUv.x + 0.03, 1.0), vUv.y);
//     vec3 color = mix(
//       texture2D(uTexture, uvOffset).rgb,
//       texture2D(uTexture, vUv).rgb,
//       seamBlend
//     );

//     // Mild emission
//     vec3 emissive = color * 1.4;

//     // Limb darkening
//     float rim = clamp(dot(vNormal, vViewDir), 0.0, 1.0);
//     emissive *= 0.4 + 0.6 * pow(rim, 0.5);

//     gl_FragColor = vec4(emissive, 1.0);
//   }
// `

// function SunMesh() {
//   const meshRef = useRef<THREE.Mesh>(null!)
//   const texture = useTexture('/sun_baked.png')
//   texture.colorSpace = THREE.SRGBColorSpace
//   texture.wrapS = THREE.RepeatWrapping
//   texture.wrapT = THREE.RepeatWrapping

//   const material = useMemo(() => new THREE.ShaderMaterial({
//     uniforms: { uTexture: { value: texture } },
//     vertexShader: sunVertexShader,
//     fragmentShader: sunFragmentShader,
//   }), [texture])

//   useFrame((_s, delta) => {
//     if (meshRef.current) meshRef.current.rotation.y += delta * 0.04
//   })

//   return (
//     <mesh ref={meshRef} material={material}>
//       <sphereGeometry args={[2.2, 128, 128]} />
//     </mesh>
//   )
// }

// interface HeatmapPointProps { x: number; y: number; intensity: number }

// function HeatmapPoint({ x, y, intensity }: HeatmapPointProps) {
//   return (
//     <mesh position={[(x - 20) / 6, -(y - 20) / 6, 2.3]}>
//       <sphereGeometry args={[0.07 * intensity, 16, 16]} />
//       <meshBasicMaterial color="#45ddc0" transparent opacity={0.9} />
//     </mesh>
//   )
// }

// export default function SolarCanvas({ heatmapPoints = [] }: { heatmapPoints: HeatmapPointProps[] }) {
//   return (
//     <div className="h-full w-full bg-[#020617]">
//       <Canvas dpr={[1, 2]} gl={{ antialias: true, toneMapping: THREE.NoToneMapping, outputColorSpace: THREE.SRGBColorSpace }}>
//         <PerspectiveCamera makeDefault position={[0, 0, 7]} />
//         <Suspense fallback={null}>
//           <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
//           <PresentationControls global damping={0.2} snap rotation={[0, 0.3, 0]}>
//             <Center>
//               <SunMesh />
//               {heatmapPoints.map((point, i) => <HeatmapPoint key={i} {...point} />)}
//             </Center>
//           </PresentationControls>
//         </Suspense>
//       </Canvas>
//     </div>
//   )
// }


'use client'

import React, { Suspense, useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PresentationControls, Center, Stars, PerspectiveCamera, useTexture } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'

const sunVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewDir = normalize(-mvPosition.xyz);
    gl_Position = projectionMatrix * mvPosition;
  }
`

const sunFragmentShader = `
  uniform sampler2D uTexture;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    // Seam fix
    float seamBlend = smoothstep(0.0, 0.05, vUv.x) * smoothstep(1.0, 0.95, vUv.x);
    vec2 uvOffset = vec2(mod(vUv.x + 0.03, 1.0), vUv.y);
    vec3 color = mix(
      texture2D(uTexture, uvOffset).rgb,
      texture2D(uTexture, vUv).rgb,
      seamBlend
    );

    // Emission — boost enough to trigger bloom on bright areas
    vec3 emissive = color * 1.6;

    // Limb darkening
    float rim = clamp(dot(vNormal, vViewDir), 0.0, 1.0);
    emissive *= 0.4 + 0.6 * pow(rim, 0.5);

    gl_FragColor = vec4(emissive, 1.0);
  }
`

function SunMesh() {
  const meshRef = useRef<THREE.Mesh>(null!)
  const texture = useTexture('/sun_baked.png')
  texture.colorSpace = THREE.SRGBColorSpace
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping

  const material = useMemo(() => new THREE.ShaderMaterial({
    uniforms: { uTexture: { value: texture } },
    vertexShader: sunVertexShader,
    fragmentShader: sunFragmentShader,
  }), [texture])

  useFrame((_s, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.04
  })

  return (
    <mesh ref={meshRef} material={material}>
      <sphereGeometry args={[2.2, 128, 128]} />
    </mesh>
  )
}

interface HeatmapPointProps { x: number; y: number; intensity: number }

function HeatmapPoint({ x, y, intensity }: HeatmapPointProps) {
  return (
    <mesh position={[(x - 20) / 6, -(y - 20) / 6, 2.3]}>
      <sphereGeometry args={[0.07 * intensity, 16, 16]} />
      <meshBasicMaterial color="#45ddc0" transparent opacity={0.9} />
    </mesh>
  )
}

export default function SolarCanvas({ heatmapPoints = [] }: { heatmapPoints: HeatmapPointProps[] }) {
  return (
    <div className="h-full w-full bg-[#020617]">
      <Canvas
        dpr={[1, 2]}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,  // bloom needs tone mapping enabled
          toneMappingExposure: 1.2,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 7]} />
        <Suspense fallback={null}>
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <PresentationControls global damping={0.2} snap rotation={[0, 0.3, 0]}>
            <Center>
              <SunMesh />
              {heatmapPoints.map((point, i) => <HeatmapPoint key={i} {...point} />)}
            </Center>
          </PresentationControls>

          {/* Bloom post-processing — creates the real soft glow like Blender */}
          <EffectComposer>
            <Bloom
              intensity={1.5}        // glow strength
              luminanceThreshold={0.6} // only pixels brighter than this glow
              luminanceSmoothing={0.4}
              mipmapBlur             // smoother, more natural falloff
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  )
}