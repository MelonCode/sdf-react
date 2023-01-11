vec3 colorA = vec3(0.912, 0.191, 0.652);
vec3 colorB = vec3(1.000, 0.777, 0.052);

out vec4 fragColor;
in vec3 v_Normal;

void main() {
  // "Normalizing" with an arbitrary value
  // We'll see a cleaner technique later :)
  vec2 normalizedPixel = gl_FragCoord.xy / 2000.0;
  float x = gl_FragCoord.y / 1000.0;

  vec3 color = mix(colorA, colorB, normalizedPixel.y);

  fragColor = vec4(v_Normal, 1.0);

}