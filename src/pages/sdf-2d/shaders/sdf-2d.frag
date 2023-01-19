const vec3 colorA = vec3(0.91f, 0.19f, 0.65f);
const vec3 colorB = vec3(1.000, 0.777, 0.052);
const vec3 colorLavaBg = vec3(1.0f, 0.67f, 0.05f);
const vec3 colorLava = vec3(1.0f, 0.34f, 0.05f);
const vec3 colorC = vec3(0.000, 1.0, 0.052);
const vec3 white = vec3(1.0, 1.0, 1.0);
const vec3 bgColor = vec3(0.58, 0.9, 0.8);
const vec3 black = vec3(0.0, 0.0, 0.0);

out vec4 fragColor;
uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMousePosition;

const int SHAPE_TYPE_CIRCLE = 1;
const int SHAPE_TYPE_CUBE = 2;

struct Shape {
  vec2 center;
  float size;
  vec3 color;
  int shapeType;
};

struct SDResponse {
  float distance;
  Shape shape;
};

uniform Shape[10] shapes;

const float DISTANCE_FIELD_STEP = 15.0;
const float DISTANCE_FIELD_THICKNESS = 3.0;
const float CIRCLE_SMOOTH_DISTANCE = 4.0;
const float MAX_DISTANCE = 2000.0;

float singedDistanceToCircle(vec2 point, vec2 center, float size) {
  return length(center - point) - size;
}

float smoothMax(float a, float b, float k) {
  return log(exp(k * a) + exp(k * b)) / k;
}

float smoothMin(float a, float b, float k) {
  return -smoothMax(-a, -b, k);
}

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

SDResponse singedDistance(vec2 point) {
  float dst = MAX_DISTANCE;
  Shape shape = shapes[0];

  for (int i = 0; i < shapes.length(); i++) {
    Shape circle = shapes[i];
    float distance = singedDistanceToCircle(point, circle.center, circle.size);
    if (distance < dst) {
      dst = distance;
      shape = circle;
    }
  }

  return SDResponse(dst, shape);
}

void main() {
  SDResponse response = singedDistance(gl_FragCoord.xy);
  float distance = response.distance;
  Shape shape = response.shape;
  vec3 finalColor = bgColor;

  // Circle color
  if (distance <= 0.0) {
    finalColor = shape.color;
  }

  // Circle Smooth & Outline
  if (distance < 0.0 && distance > -CIRCLE_SMOOTH_DISTANCE) {
    float f = distance / CIRCLE_SMOOTH_DISTANCE;
    finalColor = mix3(bgColor, white, shape.color, abs(f));
  }

  // Distance field visualization 
  if (distance >= 0.0) {
    float fractValue = fract(gl_FragCoord.x + iTime);
    float dMod = mod(distance - fractValue * DISTANCE_FIELD_STEP, DISTANCE_FIELD_STEP);

    if (dMod < DISTANCE_FIELD_THICKNESS) {
      float factor = proximity(dMod, DISTANCE_FIELD_THICKNESS * 0.5, DISTANCE_FIELD_THICKNESS * 0.8);
      finalColor = mix(mix(white, bgColor, 0.5), bgColor, factor);
    }
  }

  fragColor = vec4(finalColor, 1.0f);

}
