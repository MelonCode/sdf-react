import { OrthographicCamera, Plane } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import styles from 'App.module.css'
import { useRef } from 'react'

import * as THREE from 'three'
import { ShaderMaterial, Vector2, Vector3 } from 'three'
import fragmentShader from './shaders/sdf-2d.frag'
import vertexShader from './shaders/sdf-2d.vert'
import { useCirclesControl } from './useCirclesControl'

const uniforms = {
  iTime: {
    value: 0.0,
  },
  iResolution: {
    value: new THREE.Vector2(800, 600),
  },
  circles: {
    value: new Array(20).fill(0).map(() => ({
      center: new THREE.Vector2(
        Math.random() * window.innerWidth,
        300.0 + Math.random() * 500
      ),
      radius: Math.random() * 200,
      color: new THREE.Vector3(Math.random(), Math.random(), Math.random()),
    })),
  },
}

export interface Circle {
  center: Vector2
  radius: number
  color: Vector3
}

function Shader() {
  const materialRef = useRef<ShaderMaterial>(null)

  const { viewport } = useThree()
  const { width, height } = viewport
  // useCirclesControl(materialRef)

  useFrame((state) => {
    const { clock } = state
    const uniforms = materialRef.current!.uniforms

    uniforms.iTime.value = clock.getElapsedTime()
    uniforms.iResolution.value.set(width, height)
    console.log(uniforms)
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

export default function Page() {
  return (
    <Canvas
      dpr={1}
      className={styles.canvas}
    >
      <OrthographicCamera
        makeDefault
        manual
        left={-1}
        right={1}
        top={1}
        bottom={-1}
        near={-1}
        far={1}
      />
      <Plane args={[2, 2]}>
        <Shader />
      </Plane>
    </Canvas>
  )
}
