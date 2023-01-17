const vec3 colorA = vec3(0.91f, 0.19f, 0.65f);
const vec3 colorB = vec3(1.000, 0.777, 0.052);
const vec3 colorC = vec3(0.000, 1.0, 0.052);
const vec3 white = vec3(1.0, 1.0, 1.0);
const vec3 bg = vec3(0.58, 0.9, 0.8);
const vec3 black = vec3(0.0, 0.0, 0.0);

out vec4 fragColor;
uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMousePosition;

struct Circle {
  vec2 center;
  float radius;
  vec3 color;
};

uniform Circle[20] circles;

float singedDistanceToCircle(vec2 point, Circle circle) {
  float f = sin(iTime);

  return length(circle.center - point) - (circle.radius * 0.5 + (circle.radius * 0.5 * f));
}

float smoothMax(float a, float b, float k) {
  return log(exp(k * a) + exp(k * b)) / k;
}

float smoothMin(float a, float b, float k) {
  return -smoothMax(-a, -b, k);
}

float maxDistance = 2000.0;

float singedDistance(vec2 point) {
  float dst = maxDistance;

  for (int i = 0; i < circles.length(); i++) {
    Circle circle = circles[i];
    float distance = singedDistanceToCircle(point, circle);
    dst = min(distance, dst);
  }

  return dst;
}

vec3 singedDistanceColor(vec2 point) {
  float dst = maxDistance;
  vec3 clr = vec3(1, 1, 1);

  for (int i = 0; i < circles.length(); i++) {
    Circle circle = circles[i];
    float distance = singedDistanceToCircle(point, circle);
    if (distance <= 0.0) {
      clr = circle.color; // mix(circle.color, clr, max(0.0, distance / maxDistance));
    }
  }

  return clr;
}

const float DISTANCE_FIELD_STEP = 25.0;
const float DISTANCE_FIELD_THICKNESS = 5.0;
const float CIRCLE_SMOOTH_DISTANCE = 5.0;

vec3 mix3(vec3 color1, vec3 color2, vec3 color3, float value) {
  if (value < 0.5)
    return mix(color1, color2, mod(value, 0.5) * 2.0);
  else {
    return mix(color2, color3, (value - 0.5) * 2.0);
  }
}

float proximity(float value, float target, float size) {
  float diff = abs(value - target);
  return clamp(diff / size, 0.0, 1.0);
}

void main() {
  // vec2 normalizedPixel = gl_FragCoord.xy / iResolution;

  float distance = singedDistance(gl_FragCoord.xy);
  // vec3 finalColor = mix(clr, white, distance / maxDistance);
  vec3 finalColor = bg;
  vec3 circleColor = singedDistanceColor(gl_FragCoord.xy);

    // Circle color
  if (distance <= 0.0) {
    finalColor = circleColor;
  }

  if (distance < 0.0 && distance > -CIRCLE_SMOOTH_DISTANCE) {
    float f = distance / CIRCLE_SMOOTH_DISTANCE;
    finalColor = mix3(bg, white, circleColor, abs(f));
  }

  // Distance field visualization 
  if (distance >= DISTANCE_FIELD_STEP) {
    float dMod = mod(distance, DISTANCE_FIELD_STEP);

    if (dMod < 5.0) {
      float ff = proximity(dMod, 2.5, 2.5);
      finalColor = mix(white, bg, ff);
    }
  }

  fragColor = vec4(finalColor, 1.0f);
  // fragColor = vec4(mix3(colorA, colorB, colorC, normalizedPixel.x), 1.0f);

}
