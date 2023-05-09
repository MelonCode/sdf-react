import { button, useControls } from 'leva'
import { Ref, useRef } from 'react'
import * as THREE from 'three'
import { ShaderMaterial } from 'three'
import { Circle } from './index'

export function useCirclesControl(
  materialRef: React.RefObject<THREE.ShaderMaterial>
) {
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
}
