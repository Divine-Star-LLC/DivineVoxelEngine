import type { ShaderDataTypes, ShaderVaryingData } from "@divinestar/shaders";
import { DivineShader, DivineShaderBuilder } from "@divinestar/shaders";
import { RegisterFragFunctions } from "./Code/Functions/FragmentFunctions.js";
import { RegisterVertexFunctions } from "./Code/Functions/VertexFunctions.js";
import { RegisterVertexSnippets } from "./Code/Snippets/VertexSnippets.js";
import { RegisterFragmentSnippets } from "./Code/Snippets/FragmentSnippets.js";
import { RegisterFogShaders } from "./Code/Functions/FogShaders.js";
import { RegisterNoiseFunctions } from "./Code/Functions/UtilShaders.js";
import { RegisterVoxelSnippets } from "./Code/Snippets/VoxelSnippets.js";
import { DVEShaderRegister } from "./DVEShaderRegister.js";
export const DVEShaders = {
  register: new DVEShaderRegister(),
  builder: DivineShaderBuilder,
  voxelAttributes: <[id: string, type: ShaderDataTypes][]>[
    ["position", "vec3"],
    ["normal", "vec3"],
    ["indices", "float"],
    ["faceData", "float"],
    ["voxelData", "float"],
    ["ocuv3", "vec4"],
    ["cuv3", "vec3"],
    ["colors", "vec4"],
  ],
  voxelSharedUniforms: <[id: string, type: ShaderDataTypes][]>[
    ["time", "float"],
    ["fogOptions", "vec4"],
    ["vFogColor", "vec3"],
    ["sunLightLevel", "float"],
    ["baseLevel", "float"],
    ["doAO", "float"],
    ["doSun", "float"],
    ["doRGB", "float"],
    ["doColor", "float"],
    ["doEffects", "float"],
    ["mipMapLevels", "float", 4],
    ["mipMapBias", "float"],
  ],
  voxelVertexUniforms: <[id: string, type: ShaderDataTypes][]>[
    ["world", "mat4"],
    ["viewProjection", "mat4"],

    ["worldOrigin", "vec3"],
    ["cameraPosition", "vec3"],

    ["lightGradient", "float", 16],
  ],

  voxelVarying: <ShaderVaryingData<any>[]>[
    {
      id: "VOXEL",
      type: "mat4",
      body: {
        GLSL: () => /* glsl */ `
mat4 vData;
uint vUID = uint(voxelData);
uint lightMask = uint(${0xf});
uint aoMask = uint(${0b11});
uint animMask = uint(${0b1111_1111_1111_11});

uint index = uint(0);
float sVL = lightGradient[int(((lightMask << index) & vUID) >> index)];

index = uint(4);
float rVL = lightGradient[int(((lightMask << index) & vUID) >> index)];

index = uint(8);
float gVL = lightGradient[int(((lightMask << index) & vUID) >> index)];

index = uint(12);
float bVL = lightGradient[int(((lightMask << index) & vUID) >> index)];

index = uint(16);
float AOVL = float(((aoMask << index) & vUID) >> index);
if(AOVL > 1.) {
     AOVL = pow( pow(.65, AOVL - 1. ), 2.2);
}

index = uint(18);
float animVL = float(((animMask << index) & vUID) >> index);


vData[0] = vec4(
     ( (
(vec3(rVL,gVL,bVL) * doRGB) 
+  ((sVL * doSun  * sunLightLevel))  ) 
+ baseLevel).rgb,
1.) ;

vData[1] = vec4(AOVL,animVL,0.,0.);     
VOXEL = vData;
`,
      },
    },
    {
      id: "cameraPOS",
      type: "vec3",
      body: {
        GLSL: () => "cameraPOS = cameraPosition;\n",
      },
    },
    {
      id: "worldPOS",
      type: "vec3",
      body: {
        GLSL: () => /* glsl */ `vec4 worldPOSTemp =  world * vec4(position, 1.0);
      worldPOS = vec3(worldPOSTemp.x,worldPOSTemp.y,worldPOSTemp.z);`,
      },
    },
    {
      id: "vDistance",
      type: "float",
      body: {
        GLSL: () => "vDistance = distance(cameraPOS , worldPOS );\n",
      },
    },
    {
      id: "worldPOSNoOrigin",
      type: "vec3",
      body: {
        GLSL: () => /* glsl */ `mat4 a;
a[0] = world[0];
a[1] = world[1];
a[2] = world[2];
a[3] = vec4(world[3].xyz - worldOrigin.xyz, 1.);
vec4 temp =  a * vec4(position , 1.0);
worldPOSNoOrigin =  vec3(temp.x,temp.y,temp.z);`,
      },
    },
    {
      id: "mipMapLevel",
      type: "float",
      body: {
        GLSL: () => /* glsl */ `
    mipMapLevel = 0.;
    if(vDistance <= 30.) {
     mipMapLevel = 0.;
    }
    if(vDistance > 50. &&  vDistance <= 70.) {
     mipMapLevel = 1.;
    }
    if(vDistance > 70. && vDistance < 90.) {
      mipMapLevel = 2.;
    }
    if(vDistance >= 90.) {
     mipMapLevel = 3.;
     }
    `,
      },
    },
    {
      id: "vNormal",
      type: "vec3",
      body: {
        GLSL: () => "vNormal = normal;\n",
      },
    },
    {
      id: "vColors",
      type: "vec4",
      body: {
        GLSL: () => /* glsl */ `if(doColor == 1.0){
     vColors = vec4(1.0,1.0,1.0,1.0); 
} else {
     vColors = vec4(1.0,1.0,1.0,1.0); 
}`,
      },
    },
    {
      id: "vFlow",
      type: "float",
      body: {
        GLSL: () => ``,
      },
    },
  ],
  voxelFragFunctions: <string[]>[],
  voxelVertexFunctions: <string[]>[],

  _defaultShader: <DivineShader>{},

  $INIT() {
    RegisterVoxelSnippets(DivineShaderBuilder);
    RegisterVertexSnippets(DivineShaderBuilder);
    RegisterFragmentSnippets(DivineShaderBuilder);
    RegisterNoiseFunctions(DivineShaderBuilder);
    RegisterFogShaders(DivineShaderBuilder);
    RegisterVertexFunctions(DivineShaderBuilder);
    RegisterFragFunctions(DivineShaderBuilder);
    this.voxelFragFunctions = [
      "#dve_fmb2",
      "#dve_fmb3",
      "#dve_fog",
      "#dve_frag",
    ];
    this.voxelVertexFunctions = ["#dve_fmb2", "#dve_fmb3", "#dve_vertex"];

    const shader = DivineShaderBuilder.shaders.create("default");
    shader.addAttributes(this.voxelAttributes);
    shader.addUniform(this.voxelSharedUniforms, "shared");
    shader.addUniform(this.voxelVertexUniforms, "vertex");
    shader.addVarying(this.voxelVarying);
    shader.loadInFunctions(this.voxelFragFunctions, "frag");
    shader.loadInFunctions(this.voxelVertexFunctions, "vertex");

    shader.setCodeBody("vertex", `@standard_position`);
    shader.setCodeBody("frag", `@standard_color`);

    this._defaultShader = shader;
  },

  _addInstances(shader: DivineShader) {
    shader.data.vertexBeforeMain.GLSL = /* glsl */ `
  #ifdef INSTANCES
  //matricies
  in vec4 world0;
  in vec4 world1;
  in vec4 world2;
  in vec4 world3;
  //custom attributes
  #endif
`;
  },
  createVoxelShader(id: string) {
    const shader = this._defaultShader.clone(id);
    this._addInstances(shader);
    return shader;
  },

  createBasicTextureShader(id: string) {
    const shader = DivineShaderBuilder.shaders.create(id);
    this._addInstances(shader);

    shader.addAttributes([
      ["position", "vec3"],
      ["normal", "vec3"],
      ["indices", "float"],
      ["cuv3", "vec3"],
      ["ocuv3", "vec4"],
    ]);
    shader.loadInFunctions(
      [
        "#dve_fmb2",
        "#dve_fmb3",
        "#dve_fog",
        "doFog",
        "getBase",
        "getMainColor",
      ],
      "frag"
    );
    shader.addUniform([...this.voxelVertexUniforms], "vertex");
    shader.addUniform([...this.voxelSharedUniforms], "shared");
    shader.addVarying([
      {
        id: "cameraPOS",
        type: "vec3",
        body: {
          GLSL: () => "cameraPOS = cameraPosition;\n",
        },
      },
      {
        id: "worldPOS",
        type: "vec3",
        body: {
          GLSL: () => /* glsl */ `vec4 worldPOSTemp =  world * vec4(position, 1.0);
   worldPOS = vec3(worldPOSTemp.x,worldPOSTemp.y,worldPOSTemp.z);`,
        },
      },
      {
        id: "vDistance",
        type: "float",
        body: {
          GLSL: () => " vDistance = distance(cameraPOS , worldPOS );\n",
        },
      },
      {
        id: "mipMapLevel",
        type: "float",
        body: {
          GLSL: () => /* glsl */ `
      mipMapLevel = 0.;
      if(vDistance <= 30.) {
       mipMapLevel = 0.;
      }
      if(vDistance > 50. &&  vDistance <= 70.) {
       mipMapLevel = 1.;
      }
      if(vDistance > 70. && vDistance < 90.) {
        mipMapLevel = 2.;
      }
      if(vDistance >= 90.) {
       mipMapLevel = 3.;
       }
      `,
        },
      },
    ]);

    shader.setCodeBody("vertex", `@standard_position`);
    shader.setCodeBody(
      "frag",
      /* glsl */ `vec4 rgb = getMainColor();
   if (rgb.a < 0.5) { 
    discard;
  }
   vec3 finalColor = doFog(rgb);
   FragColor = vec4(finalColor.rgb,rgb.a);`
    );

    return shader;
  },

  createSkyBoxShader(id: string) {
    const shader = DivineShaderBuilder.shaders.create(id);
    shader.addAttributes([
      ["position", "vec3"],
      ["indices", "float"],
      ["normal", "vec3"],
    ]);
    shader.loadInFunctions(["#dve_fmb2", "#dve_fmb3", "#dve_fog", "doFog"]);
    shader.addUniform(
      [
        ["doEffects", "float"],
        ["fogOptions", "vec4"],
        ["vFogInfos", "vec4"],
        ["vFogColor", "vec3"],
        ["time", "float"],
        ["cameraPosition", "vec3"],
        ["cameraDirection", "vec3"],
      ],
      "shared"
    );
    shader.addVarying([
      {
        id: "cameraPOS",
        type: "vec3",
        body: {
          GLSL: () => "cameraPOS = cameraPosition;\n",
        },
      },
      {
        id: "worldPOS",
        type: "vec3",
        body: {
          GLSL: () => /* glsl */ `vec4 worldPOSTemp =  world * vec4(position, 1.0);
worldPOS = vec3(worldPOSTemp.x,worldPOSTemp.y,worldPOSTemp.z);`,
        },
      },
      {
        id: "vDistance",
        type: "float",
        body: {
          GLSL: () => /* glsl */ `
     vDistance = distance(cameraPOS , worldPOS );
     `,
        },
      },
    ]);
    shader.addUniform(
      [
        ["world", "mat4"],
        ["viewProjection", "mat4"],
      ],
      "vertex"
    );
    shader.setCodeBody("vertex", `@standard_position`);
    shader.setCodeBody("frag", `@skybox_frag`);
    shader.compile();

    return shader;
  },
};

DVEShaders.$INIT();
