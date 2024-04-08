import type {
  BaseTexture,
  Engine,
  PBRMaterial,
  Scene,
  UniformBuffer,
} from "@babylonjs/core";
import { MaterialPluginBase } from "@babylonjs/core/Materials/materialPluginBase";
import { DVEBRPBRMaterial } from "./DVEBRPBRMaterial";

import { DivineShader } from "@divinestar/shaders";
import { TextureType } from "@divinevoxel/default/Textures/TextureType";
const shaders = new Map<string, DivineShader>();
const textures = new Map<string, TextureType>();
export class DVEPBRMaterialPlugin extends MaterialPluginBase {
  uniformBuffer: UniformBuffer;

  id = crypto.randomUUID();
  constructor(
    material: PBRMaterial,
    name: string,
    public dveMaterial: DVEBRPBRMaterial,
    public onUBSet: (uniformBuffer: UniformBuffer) => void
  ) {
    shaders.set(material.id, dveMaterial.shader);
    textures.set(material.id, dveMaterial.texture);

    super(material, name, 20, {
      [`DVE_${name}`]: false,
    });

    this._enable(true);
  }

  hasTexture(texture: BaseTexture): boolean {
      return true;
  }
  getActiveTextures(activeTextures: BaseTexture[]) {
    const texture = textures.get(this._material.id);
    if (!texture) return [];

    for (const [key, segment] of texture.segments) {
      if (!segment.shaderTexture) continue;
      activeTextures.push(segment.shaderTexture._texture);
    }
    return activeTextures;
  }

  prepareDefines(defines: any) {
    defines[`DVE_${this.name}`] = true;
  }

  getClassName() {
    return "DVEPBRMaterialPlugin";
  }

  getSamplers(samplers: string[]) {
    const shader = this.dveMaterial?.shader || shaders.get(this._material.id)!;
  
    samplers.push(...shader.getTextureList());
  }

  getAttributes(attributes: string[]) {
    const shader = this.dveMaterial?.shader || shaders.get(this._material.id)!;
    attributes.push(...shader.data.mesh.getAttributeList());
  }

  getUniforms() {
    const shader = this.dveMaterial?.shader || shaders.get(this._material.id)!;
    const ubo: {
      name: string;
      size?: number;
      arraySize?: number;
      type: string;
    }[] = [];
    const ignoreUniforms = ["viewProjection", "world", "lightGradient"];
    for (const [key, [name, type, length]] of shader.getUniformDataList()) {
      if (ignoreUniforms.includes(key)) continue;
      if (type == "ignore") continue;
      let isArray = false;
      if (length) isArray = true;
      if (type == "float") {
        if (!isArray) ubo.push({ name, size: 1, type });
        if (isArray) ubo.push({ name, arraySize: length, size: 1, type });
        continue;
      }
      if (type == "vec2") {
        if (!isArray) ubo.push({ name, size: 2, type });
        if (isArray) ubo.push({ name, arraySize: length, size: 2, type });
        continue;
      }
      if (type == "vec3") {
        if (!isArray) ubo.push({ name, size: 3, type });
        if (isArray) ubo.push({ name, arraySize: length, size: 3, type });
        continue;
      }
      if (type == "vec4") {
        if (!isArray) ubo.push({ name, size: 4, type });
        if (isArray) ubo.push({ name, arraySize: length, size: 4, type });
        continue;
      }
      if (type == "mat3") {
        ubo.push({ name, size: 3 * 3, type });
        continue;
      }
      if (type == "mat4") {
        ubo.push({ name, size: 4 * 4, type });
        continue;
      }
    }
    console.log("CREATED UBO", ubo);

    const uniforms = shader.compileUniforms(
      (id) => !ignoreUniforms.includes(id)
    );
    return {
      ubo,
      vertex: uniforms.vertex,
      fragment: uniforms.fragment,
    };
  }

  _textureBound = false;
  bindForSubMesh(uniformBuffer: UniformBuffer, scene: Scene, engine: Engine) {
    if (!this.uniformBuffer) this.uniformBuffer = uniformBuffer;
  }

  //@ts-ignore
  getCustomCode(shaderType: any) {
    const shader = this.dveMaterial?.shader || shaders.get(this._material.id)!;
    console.log("CREATING SHADER", this.id, shader.id, this, shader);
    const textures = shader.compileTextures();
    const varying = shader.compileVarying();

    const ignoreFunctions = ["toGammaSpace", "toLinearSpace"];
    const functions = shader.compileFunctinos(
      (id, data) => !ignoreFunctions.includes(id)
    );
    const ignoreAttributes = ["position", "normal"];
    const attributes = shader.compileAttributes(
      (id) => !ignoreAttributes.includes(id)
    );
    if (shaderType === "vertex") {
      return {
        CUSTOM_VERTEX_DEFINITIONS: /*glsl*/ `
#ifdef  DVE_${this.name}
const float lightGradient[16] = float[16]( 0.06, 0.1, 0.11, 0.14, 0.17, 0.21, 0.26, 0.31, 0.38, 0.45, 0.54, 0.64, 0.74, 0.85, 0.97, 1.);
${attributes.vertex}
${varying.vertexTop}
${functions.vertex}
#endif
`,
        CUSTOM_VERTEX_MAIN_BEGIN: /*glsl*/ `
#ifdef  DVE_${this.name}
${varying.vertexMainTop}
#endif
        `,
      };
    }
    if (shaderType === "fragment") {
      return {
        CUSTOM_FRAGMENT_DEFINITIONS: /*glsl*/ `
#ifdef  DVE_${this.name}
precision highp sampler2DArray;
const float lightGradient[16] = float[16]( 0.06, 0.1, 0.11, 0.14, 0.17, 0.21, 0.26, 0.31, 0.38, 0.45, 0.54, 0.64, 0.74, 0.85, 0.97, 1.);
${textures.fragment}
${varying.fragTop}
${functions.fragment}
#endif
`,

        CUSTOM_FRAGMENT_UPDATE_ALBEDO: /*glsl*/ `
#ifdef  DVE_${this.name}

vec4 voxelBaseColor = getBaseColor(vec2(0.,0.));
voxelBaseColor = getColor(voxelBaseColor);
#ifndef  DVE_dve_liquid
voxelBaseColor = getAO(voxelBaseColor);
#endif
vec4 voxelMixLight = getLight(voxelBaseColor);
vec3 voxelColor = doFog(voxelMixLight);
surfaceAlbedo = toLinearSpace(vec3(voxelMixLight.r,voxelMixLight.g,voxelMixLight.b));
alpha = voxelBaseColor.a;
#endif
`,
CUSTOM_FRAGMENT_MAIN_END: /*glsl*/  `

if (glFragColor.a < 0.05) { 
  discard;
}

`
      };
    }
    return null;
  }
}
