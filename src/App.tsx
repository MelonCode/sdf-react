import { Canvas, ThreeElements, useFrame } from "@react-three/fiber"
import { useRef, useState } from "react"
import styles from "./App.module.css"
import {
  OrbitControls,
  PerspectiveCamera,
  Sky,
  TransformControls,
} from "@react-three/drei"
import { useControls } from "leva"

function Box(props: ThreeElements["mesh"]) {
  const ref = useRef<THREE.Mesh>(null!)

  return (
    <mesh {...props} ref={ref}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color={"orange"} />
    </mesh>
  )
}

// function Controls() {
//   // Get notified on changes to state
//   const snap = useSnapshot(state)
//   const scene = useThree((state) => state.scene)
//   return (
//     <>
//       {/* As of drei@7.13 transform-controls can refer to the target by children, or the object prop */}
//       {snap.current && (
//         <TransformControls
//           object={scene.getObjectByName(snap.current)}
//           mode={modes[snap.mode]}
//         />
//       )}
//       {/* makeDefault makes the controls known to r3f, now transform-controls can auto-disable them when active */}

//     </>
//   )
// }

function App() {
  const { color } = useControls("Fog", { color: "#000" })
  return (
    <div className={styles.App}>
      {/* <canvas className={styles.canvas} id="mainCanvas" /> */}
      <Canvas className={styles.canvas}>
        <ambientLight />
        {/* <Sky sunPosition={[100, 20, 100]} /> */}
        <pointLight position={[10, 10, 10]} />
        <PerspectiveCamera fov={20}></PerspectiveCamera>
        <Box position={[0, 0, 0]} />
        <OrbitControls
          makeDefault
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 1.75}
        />
        <fog attach={"fog"} args={[color, 2, 10]}></fog>
      </Canvas>
    </div>
  )
}

export default App
