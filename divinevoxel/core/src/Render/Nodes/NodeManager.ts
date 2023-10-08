import { Scene } from "@babylonjs/core";
import { RenderManager } from "../Scene/RenderManager.js";
import { InitDefaultNodes } from "./InitDefaultNodes.js";
import { DVENodeMaterialManager } from "./Materials/NodeMaterialManager.js";
import { NodeMeshManager } from "./Meshes/NodeMeshManager.js";
import { NodeShaderManager } from "./Shaders/NodeShaderManager.js";
import { TextureManager } from "./Textures/TextureManager.js";
import { NodeSubstanceManager } from "./Substances/NodeSubstanceManager.js";
import { EngineSettings } from "../../Data/Settings/EngineSettings.js";

export const NodeManager = {
 shaders: NodeShaderManager,
 meshes: NodeMeshManager,
 materials: DVENodeMaterialManager,
 textures: TextureManager,
 substances: NodeSubstanceManager,
 _scene: <Scene>{},

 init() {
  const scene = RenderManager.scene;
  if (!scene) return;
  this.substances.buldAll();
  this.materials.materials._map.forEach((_) => _.createMaterial(scene));
  this._scene = scene;
  this.materials.init();
 },
 syncSettings() {
  for (const [key, mesh] of this.meshes.meshes._map) {
   mesh.syncSettings(EngineSettings.settings);
  }
 },
};
InitDefaultNodes(NodeManager);
