out vec4 fragColor;
uniform float iTime;
uniform vec2 iResolution;

const vec3 COLOR_WHITE = vec3(1.0, 1.0, 1.0);
const vec3 COLOR_RED = vec3(1.0, 0.0, 0.0);
const vec3 COLOR_GREEN = vec3(0.0, 1.0, 0.0);
const vec3 COLOR_BLUE = vec3(0.0, 0.0, 1.0);
const vec3 COLOR_YELLOW = vec3(1.0, 1.0, 0.0);
const vec3 COLOR_MAGENTA = vec3(1.0, 0.0, 1.0);
const vec3 COLOR_CYAN = vec3(0.0, 1.0, 1.0);
const vec3 COLOR_ORANGE = vec3(1.0, 0.5, 0.0);
const vec3 BACKGROUND_COLOR = vec3(0.34f, 0.85f, 0.69f);

const int SHAPE_TYPE_RECTANGLE = 0;
const int SHAPE_TYPE_CIRCLE = 1;
const int SHAPE_TYPE_TRIANGLE = 2;

struct Shape {
  vec2 position;
  vec2 size;
  int type;
  vec3 color;
};
const int MAX_SHAPES = 10;
Shape shapes[MAX_SHAPES] = Shape[]( // position, size, type, color
Shape(vec2(-0.6, 0.5), vec2(0.3, 0.3), SHAPE_TYPE_RECTANGLE, COLOR_RED), // 
Shape(vec2(0.6, 0.5), vec2(0.2), SHAPE_TYPE_CIRCLE, COLOR_GREEN), // 
Shape(vec2(-0.3, 0.0), vec2(0.25, 0.15), SHAPE_TYPE_RECTANGLE, COLOR_BLUE), // 
Shape(vec2(0.3, 0.0), vec2(0.2), SHAPE_TYPE_CIRCLE, COLOR_YELLOW), // 
Shape(vec2(-0.5, -0.5), vec2(0.25, 0.1), SHAPE_TYPE_RECTANGLE, COLOR_MAGENTA), // 
Shape(vec2(0.5, -0.5), vec2(0.15), SHAPE_TYPE_CIRCLE, COLOR_CYAN), // 
Shape(vec2(0.0, 0.0), vec2(0.5), SHAPE_TYPE_TRIANGLE, COLOR_ORANGE), // 
Shape(vec2(-0.7, 0.2), vec2(0.4, 0.1), SHAPE_TYPE_RECTANGLE, COLOR_RED), // 
Shape(vec2(0.7, 0.2), vec2(0.2), SHAPE_TYPE_CIRCLE, COLOR_GREEN), // 
Shape(vec2(-0.2, -0.8), vec2(0.3, 0.3), SHAPE_TYPE_TRIANGLE, COLOR_BLUE) // 
);

float distanceToRectangle(vec2 pos, vec2 rectPos, vec2 rectSize) {
  vec2 d = abs(pos - rectPos) - rectSize;
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}

float distanceToCircle(vec2 pos, vec2 center, float radius) {
  return length(pos - center) - radius;
}

float distanceToTriangle(vec2 uv, vec2 p1, float size) {
  vec2 p2 = vec2(p1.x + size, p1.y);
  vec2 p3 = vec2(p1.x, p1.y + size);

  vec2 e0 = p2 - p1, e1 = p3 - p2, e2 = p1 - p3;
  vec2 v0 = uv - p1, v1 = uv - p2, v2 = uv - p3;
  vec2 pq0 = v0 - e0 * clamp(dot(v0, e0) / dot(e0, e0), 0.0, 1.0);
  vec2 pq1 = v1 - e1 * clamp(dot(v1, e1) / dot(e1, e1), 0.0, 1.0);
  vec2 pq2 = v2 - e2 * clamp(dot(v2, e2) / dot(e2, e2), 0.0, 1.0);
  float s = sign(e0.x * e2.y - e0.y * e2.x);
  vec2 d = min(min(vec2(dot(pq0, pq0), s * (v0.x * e0.y - v0.y * e0.x)), vec2(dot(pq1, pq1), s * (v1.x * e1.y - v1.y * e1.x))), vec2(dot(pq2, pq2), s * (v2.x * e2.y - v2.y * e2.x)));
  return -sqrt(d.x) * sign(d.y);
}

float distanceToShape(vec2 uv, Shape shape) {
  if (shape.type == SHAPE_TYPE_RECTANGLE) {
    return distanceToRectangle(uv, shape.position, shape.size);
  } else if (shape.type == SHAPE_TYPE_CIRCLE) {
    return distanceToCircle(uv, shape.position, shape.size.x);
  } else if (shape.type == SHAPE_TYPE_TRIANGLE) {
    return distanceToTriangle(uv, shape.position, shape.size.x);
  }
  return 0.0;
}

float proximity(float value, float target, float size) {
  float diff = abs(value - target);
  return clamp(diff / size, 0.0, 1.0);
}

struct SDFResult {
  float dist;
  int shapeIndex;
};

SDFResult getSignedDistance(vec2 uv) {
  float dist = 100.0;
  int shapeIndex = -1;
  for (int i = MAX_SHAPES - 1; i >= 0; i--) {
    float d = distanceToShape(uv, shapes[i]);
    if (d < dist) {
      dist = d;
      shapeIndex = i;
    }
  }
  return SDFResult(dist, shapeIndex);
}
// Shortcut for 45-degrees rotation
void pR45(inout vec2 p) {
  p = (p + vec2(p.y, -p.x)) * sqrt(0.5);
}

void main() {
  vec2 uv = (gl_FragCoord.xy / iResolution.xy) * 2.0 - 1.0;
  uv.x *= iResolution.x / iResolution.y;

  pR45(uv);
  SDFResult result = getSignedDistance(uv);
  float dist = result.dist;
  int shapeIndex = result.shapeIndex;

  vec3 finalColor = BACKGROUND_COLOR;

  if (dist >= 0.0) {

  } else if (shapeIndex >= 0) {
    Shape shape = shapes[shapeIndex];
    finalColor = mix(finalColor, shape.color, smoothstep(-0.0025, 0.0025, abs(dist)));
  }

  fragColor = vec4(finalColor, 1.0);
}