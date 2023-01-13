vec3 colorA = vec3(0.912, 0.191, 0.652);
vec3 colorB = vec3(1.000, 0.777, 0.052);

out vec4 fragColor;
in vec3 v_Normal;
uniform float u_time;

float singedDistanceToCircle(vec2 point, vec2 center, float radius) {
  return length(center - point) - radius;
}

float maxDistance = 100.0;

struct Circle {
  vec2 center;
  float radius;
};

float singedDistance(vec2 point) {
  float dst = maxDistance;
  if (point.x < 0.3 || point.x > 0.7)
    dst = 50.0;

  Circle circle = Circle(vec2(10.0, 22.0), 2.0);
  return dst;
}

void main() {
  // "Normalizing" with an arbitrary value
  // We'll see a cleaner technique later :)
  vec2 normalizedPixel = gl_FragCoord.xy / 2000.0;

  float f = sin(u_time * 2.0);
  vec3 mixColor = mix(colorA, colorB, f);

  float distance = singedDistance(normalizedPixel);

  fragColor = vec4(mix(colorA, colorB, distance / maxDistance), 1.0f);
}
