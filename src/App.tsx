import {
  OrbitControls,
  PerspectiveCamera,
  TransformControls,
} from '@react-three/drei'
import { Canvas, ThreeElements, useFrame, useThree } from '@react-three/fiber'
import { useControls } from 'leva'
import { useMemo, useRef } from 'react'
import styles from './App.module.css'

import vertexShader from 'shaders/dummy.vert'
import fragmentShader from 'shaders/dummy.frag'
import * as THREE from 'three'
import { ShaderMaterial } from 'three'

const uniforms = {
  u_time: {
    value: 0.0,
  },
}

function Box(props: ThreeElements['mesh']) {
  const ref = useRef<THREE.Mesh>(null!)

  const materialRef = useRef<ShaderMaterial>(null)

  useFrame((state) => {
    const { clock } = state
    materialRef.current!.uniforms.u_time.value = clock.getElapsedTime()
  })

  return (
    <mesh
      {...props}
      ref={ref}
    >
      <boxGeometry args={[2, 2, 2]} />
      <shaderMaterial
        ref={materialRef}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
        glslVersion={THREE.GLSL3}
      />
    </mesh>
  )
}

function App() {
  const { color } = useControls('Fog', { color: '#000' })
  return (
    <div className={styles.App}>
      {/* <canvas className={styles.canvas} id="mainCanvas" /> */}
      <Canvas className={styles.canvas}>
        <ambientLight />
        {/* <Sky sunPosition={[100, 20, 100]} /> */}
        <pointLight position={[0, 0, 0]} />
        <PerspectiveCamera fov={20}></PerspectiveCamera>
        <Box
          scale={[2, 2, 2]}
          position={[0, 0, 0]}
        />
        <OrbitControls
          makeDefault
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 1.75}
        />
        <fog
          attach={'fog'}
          args={[color, 2, 10]}
        />
      </Canvas>
    </div>
  )
}

export default App
