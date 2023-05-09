uniform float u_time;

out vec3 v_Normal;

void main() {

  // vec3 scale = vec3(1.0, 1.0, 1.0) * u_time;
  // v_Normal = normal;
  // vec3 newPos = position + vec3(0, 0, 0);
  // gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

}