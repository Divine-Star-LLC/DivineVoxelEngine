import type { Scene, Vector4 } from "@babylonjs/core";
import { Effect } from "@babylonjs/core/Materials/effect.js";
import { ShaderMaterial } from "@babylonjs/core/Materials/shaderMaterial.js";
import { Vector3 } from "@babylonjs/core/Maths/";
import { TextureManager } from "../../Nodes/Textures/TextureManager.js";

import { RenderManager } from "../../Scene/RenderManager.js";
import { NodeMaterialData } from "../types/RenderNode.types.js";
import { NodeManager } from "../NodeManager.js";
import { DivineShader } from "@divinestar/shaders";

export class DVENodeMaterial {
  material: ShaderMaterial;
  scene: Scene;

  time = 0;
  id: string = "";
  shader: DivineShader;

  afterCreate: ((material: ShaderMaterial) => void)[] = [];
  constructor(public data: NodeMaterialData) {
    this.id = this.data.id;
  }

  getMaterial() {
    return this.material;
  }

  updateFogOptions(data: Vector4) {
    if (!this.material) return;
    this.material.setVector4("fogOptions", data);
  }

  setSunLightLevel(level: number) {
    if (!this.material) return;
    this.material.setFloat("sunLightLevel", level);
  }
  setBaseLevel(level: number) {
    if (!this.material) return;
    this.material.setFloat("baseLevel", level);
  }

  _build(scene: Scene) {
    const type = TextureManager.getTextureType(
      this.data.textureTypeId ? this.data.textureTypeId : this.id
    );

    const shader = NodeManager.shaders.get(this.data.shaderId);

    if (!shader) return false;
    if (type) type.addToShader(shader);

    this.shader = shader;
    shader.compile();

    Effect.ShadersStore[`${this.id}VertexShader`] = shader.compiled.vertex;

    Effect.ShadersStore[`${this.id}FragmentShader`] = shader.compiled.fragment;

    console.log("adding effect to shader store",Effect.ShadersStore)
    const shaderMaterial = new ShaderMaterial(this.id, scene, this.id, {
      attributes: shader.getAttributeList(),
      uniforms: shader.getUniformList(),
      needAlphaBlending: this.data.alphaBlending,
      needAlphaTesting: this.data.alphaTesting,
    });

    this.material = shaderMaterial;

    this.material.fogEnabled = true;

    if (this.data.alphaBlending) {
      shaderMaterial.separateCullingPass = true;
      shaderMaterial.backFaceCulling = false;
      shaderMaterial.forceDepthWrite = true;
      shaderMaterial.needDepthPrePass = true;
    }

    if (type) type.addToMaterial(this);

    shaderMaterial.setVector3("worldOrigin", Vector3.Zero());
    this.material.onBind = (mesh) => {
      if (!this.material) return;
      const effect = this.material.getEffect();
      const scene = mesh.getScene();
      if (!effect) return;

      effect.setFloat4(
        "vFogInfos",
        scene.fogMode,
        scene.fogStart,
        scene.fogEnd,
        scene.fogDensity
      );
      effect.setColor3("vFogColor", scene.fogColor);
    };

    if (this.data.backFaceCulling !== undefined) {
      this.material.backFaceCulling = this.data.backFaceCulling;
    }

    this.afterCreate.forEach((_) => _(this.material));
  }

  reBuild() {
    this._build(this.scene);
  }

  createMaterial(scene: Scene): ShaderMaterial | false {
    this.scene = scene;
    this._build(scene);
    return this.material;
  }

  overrideMaterial(material: any) {
    this.material = material;
  }

  updateUniforms() {
    if (!this.material) return;
    if (RenderManager.fo.activeNode) {
      this.material.setVector3(
        "worldOrigin",
        RenderManager.fo.activeNode.position
      );
    }
  }

  runEffects() {
    if (!this.material) return;
    this.time += 0.005;
    this.material.setFloat("time", this.time);
  }
}
