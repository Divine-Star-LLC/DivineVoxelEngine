import type { URIShaderBuilder } from "@amodx/uri/Shaders/URIShaderBuilder";
export function RegisterNoiseFunctions(builder: typeof URIShaderBuilder) {
 //VEC2 fbm
 builder.functions.create("hash", {
  setID: "#dve_fmb2",
  inputs: [["p", "vec2"]],
  output: "float",
  arguments: {},
  body: {
   GLSL: () =>
    /* glsl */`return fract(sin(dot(p * 5.5, vec2(14.91, 67.31))) * 4791.9511);`,
  },
 });
 builder.functions.create("noise", {
  setID: "#dve_fmb2",
  inputs: [["x", "vec2"]],
  output: "float",
  arguments: [],
  body: {
   GLSL: () => /* glsl */`
vec2 p = floor(x);
vec2 f = fract(x);
f = f * f * (3.0 - 2.0 * f);
vec2 a = vec2(1.0, 0.0);
return mix(mix(hash(p + a.yy), hash(p + a.xy), f.x),
mix(hash(p + a.yx), hash(p + a.xx), f.x), f.y);`,
  },
 });
 builder.functions.create("fbm", {
  setID: "#dve_fmb2",
  inputs: [["x", "vec2"]],
  output: "float",
  arguments: {},
  body: {
   GLSL: () => `
float height = 0.0;
float amplitude = 3.0;
float frequency = 3.0;
for (int i = 0; i < 1; i++){
    height += noise(x * frequency) * amplitude;
    amplitude *= 3.0;
    frequency *= 2.0;
}
return height;`,
  },
 });
 /*
//
// Description : Array and textureless GLSL 2D/3D/4D simplex
//               noise functions.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : stegu
//     Lastmod : 20201014 (stegu)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
//               https://github.com/stegu/webgl-noise
//
*/

 builder.functions.create("mod289", {
  setID: "#dve_fmb3",
  inputs: [["x", "vec3"]],
  output: "vec3",
  arguments: {},
  body: {
   GLSL: () => /* glsl */`return x - floor(x * (1.0 / 289.0)) * 289.0;`,
  },
  overrides: [
   {
    inputs: [["x", "vec4"]],
    output: "vec4",
    arguments: {},
    body: {
     GLSL: () => /* glsl */`return x - floor(x * (1.0 / 289.0)) * 289.0;`,
    },
   },
  ],
 });
 builder.functions.create("permute", {
  setID: "#dve_fmb3",
  inputs: [["x", "vec4"]],
  output: "vec4",
  arguments: {},
  body: {
   GLSL: () => /* glsl */`return mod289(((x*34.0)+1.0)*x);`,
  },
 });
 builder.functions.create("taylorInvSqrt", {
  setID: "#dve_fmb3",
  inputs: [["r", "vec4"]],
  output: "vec4",
  arguments: {},
  body: {
   GLSL: () => /* glsl */`return 1.79284291400159 - 0.85373472095314 * r;`,
  },
 });
 builder.functions.create("snoise", {
  setID: "#dve_fmb3",
  inputs: [["v", "vec3"]],
  output: "float",
  arguments: {},
  body: {
   GLSL: () => /* glsl */`const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
// First corner
vec3 i  = floor(v + dot(v, C.yyy) );
vec3 x0 =   v - i + dot(i, C.xxx) ;
// Other corners
vec3 g = step(x0.yzx, x0.xyz);
vec3 l = 1.0 - g;
vec3 i1 = min( g.xyz, l.zxy );
vec3 i2 = max( g.xyz, l.zxy );
//   x0 = x0 - 0.0 + 0.0 * C.xxx;
//   x1 = x0 - i1  + 1.0 * C.xxx;
//   x2 = x0 - i2  + 2.0 * C.xxx;
//   x3 = x0 - 1.0 + 3.0 * C.xxx;
vec3 x1 = x0 - i1 + C.xxx;
vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y
// Permutations
i = mod289(i);
vec4 p = permute( permute( permute(
        i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
        + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
        + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
// Gradients: 7x7 points over a square, mapped onto an octahedron.
// The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
float n_ = 0.142857142857; // 1.0/7.0
vec3  ns = n_ * D.wyz - D.xzx;
vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)
vec4 x_ = floor(j * ns.z);
vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)
vec4 x = x_ *ns.x + ns.yyyy;
vec4 y = y_ *ns.x + ns.yyyy;
vec4 h = 1.0 - abs(x) - abs(y);
vec4 b0 = vec4( x.xy, y.xy );
vec4 b1 = vec4( x.zw, y.zw );
//vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
//vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
vec4 s0 = floor(b0)*2.0 + 1.0;
vec4 s1 = floor(b1)*2.0 + 1.0;
vec4 sh = -step(h, vec4(0.0));
vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
vec3 p0 = vec3(a0.xy,h.x);
vec3 p1 = vec3(a0.zw,h.y);
vec3 p2 = vec3(a1.xy,h.z);
vec3 p3 = vec3(a1.zw,h.w);
//Normalise gradients
vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
p0 *= norm.x;
p1 *= norm.y;
p2 *= norm.z;
p3 *= norm.w;
// Mix final noise value
vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
m = m * m;
return 105.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),dot(p2,x2), dot(p3,x3) ) ); `,
  },
 });
 builder.functions.create("fbm3", {
  setID: "#dve_fmb3",
  inputs: [["p", "vec3"]],
  output: "float",
  arguments: {},
  body: {
   GLSL: () => /* glsl */`
   float value = 0.0;
   float amplitude = 0.5;
   float frequency = 0.0;
   for (int i = 0; i < 6; ++i) {
     value += amplitude * snoise(p);
     p *= 2.0;
     amplitude *= 0.5;
   }
   return value;`,
  },
 });
 /*
 @TODO add these functions
vec3 hsv2rgbSmooth( in vec3 c ) {
   vec3 rgb = clamp( abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );
   rgb = rgb*rgb*(3.0-2.0*rgb); 
   return c.z * mix( vec3(1.0), rgb, c.y);
}
vec3 rainbow(float level)
{
	float r = float(level <= 2.0) + float(level > 4.0) * 0.5;
	float g = max(1.0 - abs(level - 2.0) * 0.5, 0.0);
	float b = (1.0 - (level - 4.0) * 0.5) * float(level >= 4.0);
	return vec3(r, g, b);
}

vec3 smoothRainbow (float x)
{
    float level1 = floor(x*6.0);
    float level2 = min(6.0, floor(x*6.0) + 1.0);
    
    vec3 a = rainbow(level1);
    vec3 b = rainbow(level2);
    
    return mix(a, b, fract(x*6.0));
}

vec3 toLinearSpace( in vec4 c ) {
    return vec3(pow(c.r ,2.2), pow(c.g ,2.2) , pow(c.b ,2.2) );
}

*/
}
