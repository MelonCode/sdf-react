import {
  Box,
  OrbitControls,
  PerspectiveCamera,
  Plane,
  SpotLight,
  SpotLightShadow,
  TorusKnot,
  useCubeTexture,
  useDepthBuffer,
  useHelper,
} from '@react-three/drei'
import { Canvas, ThreeElements, useFrame, useThree } from '@react-three/fiber'
import { useControls } from 'leva'
import { useEffect, useMemo, useRef } from 'react'
import styles from './App.module.css'

import vertexShader from 'shaders/dummy.vert'
import fragmentShader from 'shaders/dummy.frag'
import * as THREE from 'three'
import {
  DirectionalLight,
  DirectionalLightHelper,
  ShaderMaterial,
  TextureLoader,
} from 'three'

const uniforms = {
  u_time: {
    value: 0.0,
  },
}

function MyShaderMaterial() {
  const materialRef = useRef<ShaderMaterial>(null)

  useFrame((state) => {
    const { clock } = state
    materialRef.current!.uniforms.u_time.value = clock.getElapsedTime()
  })

  return (
    <shaderMaterial
      ref={materialRef}
      fragmentShader={fragmentShader}
      vertexShader={vertexShader}
      uniforms={uniforms}
      glslVersion={THREE.GLSL3}
    />
  )
}

function BoxMesh(props: ThreeElements['mesh']) {
  const ref = useRef<THREE.Mesh>(null!)

  return (
    <mesh
      castShadow
      receiveShadow
      {...props}
      ref={ref}
    >
      <boxGeometry />
      <meshStandardMaterial color={0xff0000} />
    </mesh>
  )
}

function SkyBox() {
  const { scene, camera } = useThree()

  const envMap = useCubeTexture(
    ['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png'],
    { path: '/assets/sky/' }
  )

  useEffect(() => {
    scene.background = envMap
    envMap.encoding = THREE.sRGBEncoding
  }, [])

  return null
}

function MainPlane(props: ThreeElements['mesh']) {
  const ref = useRef<THREE.Mesh>(null!)

  useEffect(() => {
    ref.current.rotation.x = -Math.PI / 2
  }, [])

  return (
    <mesh
      {...props}
      castShadow={false}
      receiveShadow={true}
      ref={ref}
    >
      <planeGeometry args={[10000, 10000, 1, 1]} />
      <meshStandardMaterial color={0xffffff} />
    </mesh>
  )
}

function MyLight() {
  const { lightTarget } = useControls({ lightTarget: { x: -5, z: 0 } })
  const dirLightRef = useRef<DirectionalLight>(null!)
  return (
    <directionalLight
      castShadow
      position={[lightTarget.x, 5, lightTarget.z]}
      ref={dirLightRef}
    />
  )
}

function App() {
  const { color } = useControls('Fog', { color: '#000' })

  return (
    <div className={styles.App}>
      <Canvas
        shadows
        className={styles.canvas}
      >
        <SkyBox />
        <MyLight />
        <Box
          position={[0, 0, -10]}
          scale={[15, 15, 15]}
        >
          <MyShaderMaterial />
        </Box>

        {/* <Plane
          receiveShadow
          rotation-x={-Math.PI / 2}
          position-y={-1}
          args={[1000, 1000]}
        >
          <meshStandardMaterial
            attach="material"
            color="white"
          />
        </Plane> */}
      </Canvas>
    </div>
  )
}

export default App
