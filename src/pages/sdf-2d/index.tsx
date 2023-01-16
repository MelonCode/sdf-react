import {
  Box,
  OrthographicCamera,
  Plane,
  useCubeTexture,
} from '@react-three/drei'
import { Canvas, ThreeElements, useFrame, useThree } from '@react-three/fiber'
import styles from 'App.module.css'
import { useControls } from 'leva'
import { useEffect, useRef } from 'react'

import fragmentShader from './shaders/sdf-2d.frag'
import vertexShader from './shaders/sdf-2d.vert'
import * as THREE from 'three'
import { DirectionalLight, PlaneGeometry, ShaderMaterial } from 'three'
import { useWindowSize } from 'hooks/useWindowSize'

const uniforms = {
  iTime: {
    value: 0.0,
  },
  iResolution: {
    value: new THREE.Vector2(800, 600),
  },
  circle: {
    value: {
      center: new THREE.Vector2(200.0, 200.0),
      radius: 100.0,
      color: new THREE.Vector3(1.0, 0.0, 0.0),
    },
  },
}

function Shader() {
  const materialRef = useRef<ShaderMaterial>(null)

  const { viewport } = useThree()
  const { width, height } = viewport
  const { position, radius, color } = useControls('Circle', {
    color: { r: 0, b: 0, g: 255 },
    position: { x: 1000, y: 300 },
    radius: { min: 10, max: 500, value: 200 },
  })
  useFrame((state) => {
    const { clock } = state
    const uniforms = materialRef.current!.uniforms

    uniforms.iTime.value = clock.getElapsedTime()
    uniforms.iResolution.value.set(width, height)
    uniforms.circle.value.center.set(position.x, height - position.y)
    uniforms.circle.value.radius = radius
    uniforms.circle.value.color.set(color.r / 255, color.g / 255, color.b / 255)
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
