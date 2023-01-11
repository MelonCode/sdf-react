/// <reference types="vite/client" />
/// <reference types="vite-plugin-glsl/ext" />
//Waiting for the line above to be merged

declare module '*.glsl' {
  const shader: string
  export default shader
}
declare module '*.frag' {
  const shader: string
  export default shader
}
declare module '*.vert' {
  const shader: string
  export default shader
}
