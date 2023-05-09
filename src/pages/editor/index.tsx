import {
  Canvas,
  Object3DNode,
  extend,
  useFrame,
  useThree,
} from '@react-three/fiber'
import * as THREE from 'three'
import { Color, PMREMGenerator, Quaternion, Vector3 } from 'three'
import Raymarcher, { Entity } from 'three-raymarcher'

import {
  GizmoHelper,
  GizmoViewcube,
  GizmoViewport,
  OrbitControls,
  Sphere,
  Stats,
  TransformControls,
} from '@react-three/drei'
import styles from 'App.module.css'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

import { useCallback, useMemo, useRef } from 'react'
import { useControls } from 'leva'

extend({ Raymarcher })

const { operations, shapes } = Raymarcher

// Add types to ThreeElements elements so primitives pick up on it
declare module '@react-three/fiber' {
  interface ThreeElements {
    raymarcher: Object3DNode<Raymarcher, typeof Raymarcher>
  }
}

const position = new Vector3(-5 + 1 * 2.5, ((1 % 2) - 0.25) * 1.5, -1 % 2)
const scale = new Vector3().setScalar(2 + Math.random())

function Scene() {
  const ref = useRef<Raymarcher | null>(null!)
  const entity = useControls({
    entity: 0,
    color: new Color(Math.random() * 0xffffff),
    operation: operations.union,
    position: {
      value: {
        x: -5 + 1 * 2.5,
        y: ((1 % 2) - 0.25) * 1.5,
        z: -1 % 2,
      },
      onChange: (value) => {
        layers.current[0][0].position.set(value.x, value.y, value.z)
      },
    },
    rotation: {
      x: 0,
      y: 0,
      z: 0,
      w: 1,
    },
    scale: {
      x: 2,
      y: 2,
      z: 2,
    },
    shape: shapes.box,
  })

  const layers = useRef([
    [
      {
        color: new Color(0, 0, 0),
        operation: operations.union,
        position,
        rotation: new Quaternion(0, 0, 0, 1),
        scale,
        shape: shapes.box,
      },
      {
        color: new Color(Math.random() * 0xffffff),
        operation: operations.substraction,
        position: position.clone(),
        rotation: new Quaternion(0, 0, 0, 1),
        scale: scale.clone(),
        shape: shapes.sphere,
      },
    ],
  ])
  useFrame(({ clock }) => {
    // layers.current.forEach((layer, l) =>
    //   layer.forEach((entity, e) => {
    //     entity.scale.setScalar(
    //       1.5 +
    //         Math.sin(clock.oldTime / 1000 + l * 1.5) * 0.5 +
    //         e * (0.125 + (l % 2 ? e * 0.5 : 0))
    //     )
    //   })
    // )
  })
  const { gl } = useThree()
  const envMap = useMemo(
    () => new PMREMGenerator(gl).fromScene(new RoomEnvironment()).texture,
    [gl]
  )
  const randomize = useCallback((event: unknown & { entity: Entity }) => {
    event.entity.color.setHex(Math.random() * 0xffffff)
    console.log(event, event.entity)
    console.log(ref.current?.userData)
  }, [])
  return (
    <raymarcher
      ref={ref}
      onClick={(event) => randomize(event as any)}
      userData-layers={layers.current}
      userData-envMap={envMap}
      userData-envMapIntensity={0.6}
      userData-roughness={0.0}
    />
  )
}

export default function Page() {
  return (
    <Canvas
      dpr={2}
      className={styles.canvas}
    >
      <OrbitControls makeDefault />
      <GizmoHelper
        alignment="bottom-right"
        margin={[100, 100]}
      >
        <GizmoViewport
          labelColor="white"
          axisHeadScale={1}
        />
      </GizmoHelper>
      <Scene />
      <Stats />
      <Sphere
        position={[10, 10, 10]}
        getObjectsByProperty={undefined}
        getVertexPosition={undefined}
      />
    </Canvas>
  )
}
