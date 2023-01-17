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

// vec3 singedDistanceClr(vec2 point) {
//   vec3 clr = vec3(1.0, 1.0, 1.0);

//   for (int i = 0; i < circles.length(); i++) {
//     Circle circle = circles[i];
//     float distance = singedDistanceToCircle(point, circle);
//     if (distance < 0.0) {
//       clr = circle.color;
//     }
//   }

//   return clr;
// }

float maxDistance = 100.0;

float singedDistance(vec2 point) {
  float dst = maxDistance;

  for (int i = 0; i < circles.length(); i++) {
    Circle circle = circles[i];
    float distance = singedDistanceToCircle(point, circle);
    if (distance < dst) {
      dst = distance;
    }
  }

  return dst;
}

void main() {
  // vec2 normalizedPixel = gl_FragCoord.xy / iResolution;

  float distance = singedDistance(gl_FragCoord.xy);
  fragColor = vec4(mix(vec3(0, 0, 0), vec3(1, 1, 1), distance / maxDistance), 1.0f);

}
