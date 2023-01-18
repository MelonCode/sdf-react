import { OrthographicCamera, Plane } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import styles from 'App.module.css'
import hexRgb from 'hex-rgb'
import { useEffect, useRef } from 'react'

import * as THREE from 'three'
import { ShaderMaterial, Vector2, Vector3 } from 'three'
import fragmentShader from './shaders/sdf-2d.frag'
import vertexShader from './shaders/sdf-2d.vert'

const colors = [
  'E2B8CF',
  'E2C2B8',
  'EEE8B2',
  '8CCDA4',
  '8CCDCD',
  '8CA2CD',
  '8D8CCD',
].map((color) => hexRgb(color))

enum ShapeType {
  NONE,
  CIRCLE,
  RECTANGLE,
}

export interface Shape {
  center: Vector2
  radius: number
  color: Vector3
  shapeType: ShapeType
}

const uniforms = {
  iTime: {
    value: 0.0,
  },
  iResolution: {
    value: new THREE.Vector2(800, 600),
  },
  iMousePosition: {
    value: new THREE.Vector2(400, 600),
  },
  shapes: {
    value: new Array(10).fill(0).map(() => {
      const color = colors[Math.floor(Math.random() * colors.length)]
      return {
        center: new THREE.Vector2(
          Math.random() * window.innerWidth,
          300.0 + Math.random() * 500
        ),
        size: 25 + Math.random() * 50,
        color: new THREE.Vector3(
          color.red / 255,
          color.green / 255,
          color.blue / 255
        ),
        shapeType: ShapeType.CIRCLE,
      }
    }),
  },
}

function Shader() {
  const materialRef = useRef<ShaderMaterial>(null)

  const { viewport } = useThree()
  const { width, height } = viewport

  useFrame((state) => {
    const { clock } = state
    const uniforms = materialRef.current!.uniforms

    uniforms.iTime.value = clock.getElapsedTime()
    uniforms.iResolution.value.set(width, height)
  })

  useEffect(() => {
    function onMouseMove(event: MouseEvent) {
      uniforms.iMousePosition.value.x = event.pageX
      uniforms.iMousePosition.value.y = event.pageY
    }

    document.addEventListener('mousemove', onMouseMove)
    return () => document.removeEventListener('mousemove', onMouseMove)
  }, [])

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
