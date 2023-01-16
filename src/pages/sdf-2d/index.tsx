import {
  Box,
  OrthographicCamera,
  Plane,
  useCubeTexture,
} from '@react-three/drei'
import { Canvas, ThreeElements, useFrame, useThree } from '@react-three/fiber'
import styles from 'App.module.css'
import { button, folder, useControls } from 'leva'
import { useEffect, useRef, useState } from 'react'

import fragmentShader from './shaders/sdf-2d.frag'
import vertexShader from './shaders/sdf-2d.vert'
import * as THREE from 'three'
import {
  DirectionalLight,
  PlaneGeometry,
  ShaderMaterial,
  Vector2,
  Vector3,
} from 'three'
import { useWindowSize } from 'hooks/useWindowSize'

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
        Math.random() * 800,
        300.0 + Math.random() * 500
      ),
      radius: Math.random() * 200,
      color: new THREE.Vector3(Math.random(), Math.random(), Math.random()),
    })),
  },
}

interface Circle {
  center: Vector2
  radius: number
  color: Vector3
}

function Shader() {
  const materialRef = useRef<ShaderMaterial>(null)

  const { viewport } = useThree()
  const { width, height } = viewport
  const indexRef = useRef(0)

  const [, set] = useControls(
    'Circle',
    () => ({
      color: {
        value: { r: 0, b: 0, g: 255 },
        onChange: ({ r, g, b }, _, { get, initial }) => {
          if (initial) return
          const circles = materialRef.current!.uniforms.circles
            .value as Circle[]
          const circle = circles[indexRef.current]
          console.log({ circle })
          if (circle == null) return
          circle.color.set(r / 255, g / 255, b / 255)
        },
      },
      position: {
        value: { x: 600, y: 600 },
        onChange: ({ x, y }, _, { get, initial }) => {
          if (initial) return
          const circles = materialRef.current!.uniforms.circles
            .value as Circle[]
          const circle = circles[indexRef.current]
          if (circle == null) return
          circle.center.set(x, y)
        },
      },
      radius: {
        min: 10,
        max: 500,
        value: 200,
        onChange: (radius, _, { get, initial }) => {
          if (initial) return
          const circles = materialRef.current!.uniforms.circles
            .value as Circle[]
          const circle = circles[indexRef.current]
          if (circle == null) return
          circle.radius = radius
        },
      },
    }),
    []
  )

  useControls('Select', () => ({
    index: {
      value: 0,
      step: 1,
      min: 0,
      max: 20,
      onChange: (index, _, { initial }) => {
        if (initial) return
        indexRef.current = index
        const circles = materialRef.current!.uniforms.circles.value as Circle[]
        const circle = circles?.[index]
        if (circle != null) {
          set({
            radius: circle.radius,
            color: {
              r: circle.color.x * 255,
              g: circle.color.y * 255,
              b: circle.color.z * 255,
            },
            position: { x: circle.center.x, y: circle.center.y },
          })
        }
      },
    },
    add: button(() => {
      const circles = materialRef.current!.uniforms.circles.value as Circle[]
      const circle = {
        center: new THREE.Vector2(200.0, 600.0),
        radius: Math.random() * 200,
        color: new THREE.Vector3(Math.random(), Math.random(), Math.random()),
      }
      circles.push(circle)
      set({
        radius: circle.radius,
        color: {
          r: circle.color.x * 255,
          g: circle.color.y * 255,
          b: circle.color.z * 255,
        },
        position: { x: circle.center.x, y: circle.center.y },
      })
      indexRef.current = circles.length - 1
    }),
  }))

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
