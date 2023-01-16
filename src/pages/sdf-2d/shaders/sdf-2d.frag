vec3 colorA = vec3(0.912, 0.191, 0.652);
vec3 colorB = vec3(1.000, 0.777, 0.052);

out vec4 fragColor;
uniform float iTime;
uniform vec2 iResolution;

struct Circle {
  vec2 center;
  float radius;
};

float singedDistanceToCircle(vec2 point, Circle circle) {
  return length(circle.center - point) - circle.radius;
}

float maxDistance = 100.0;

const Circle circles[1] = Circle[](Circle(vec2(0.5, 0.5), 0.1));

float singedDistance(vec2 point) {

  // return 100.0 * point.x;
  float dst = maxDistance;

  for (int i = 0; i < circles.length(); i++) {
    float distance = 50.0;

    dst = distance;
  }

  return dst;
}

void main() {
  // "Normalizing" with an arbitrary value
  // We'll see a cleaner technique later :)
  vec2 normalizedPixel = gl_FragCoord.xy / iResolution;

  float f = sin(iTime * 2.0);
  vec3 mixColor = mix(colorA, colorB, f);

  float distance = singedDistance(normalizedPixel);

  fragColor = vec4(mix(colorA, colorB, distance / maxDistance), 1.0f);
}
