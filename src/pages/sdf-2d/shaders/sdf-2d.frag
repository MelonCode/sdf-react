const vec3 colorA = vec3(0.912, 0.191, 0.652);
const vec3 colorB = vec3(1.000, 0.777, 0.052);
const vec3 colorC = vec3(0.000, 1.0, 0.052);

out vec4 fragColor;
uniform float iTime;
uniform vec2 iResolution;

struct Circle {
  vec2 center;
  float radius;
  vec3 color;
};

uniform Circle[20] circles;

float singedDistanceToCircle(vec2 point, Circle circle) {
  return length(circle.center - point) - circle.radius;
}

vec3 singedDistanceClr(vec2 point) {
  vec3 clr = vec3(1.0, 1.0, 1.0);

  for (int i = 0; i < circles.length(); i++) {
    Circle circle = circles[i];
    float distance = singedDistanceToCircle(point, circle);
    if (distance < 0.0) {
      clr = circle.color;
    }
  }

  return clr;
}

void main() {
  // "Normalizing" with an arbitrary value
  // We'll see a cleaner technique later :)
  // vec2 normalizedPixel = gl_FragCoord.xy / iResolution;
  // float f = sin(iTime * 2.0);
  // vec3 mixColor = mix(colorA, colorB, f);

  vec3 color = singedDistanceClr(gl_FragCoord.xy);
  fragColor = vec4(color, 1.0f);
}
