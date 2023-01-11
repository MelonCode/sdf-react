in vec3 pos;
uniform float u_time;

out vec3 v_Normal;

void main() {

  vec3 scale = vec3(1.0, 1.0, 1.0) * u_time;
  v_Normal = normal;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position * scale * 0.01, 1.0);
}