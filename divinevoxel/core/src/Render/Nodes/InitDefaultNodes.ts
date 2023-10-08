import { NodeShaders } from "./Shaders/NodeShaders.js";
import type { NodeManager } from "./NodeManager.js";

const createVoxelShader = (id: string) => {
 const shader = NodeShaders.createVoxelShader(id);
 shader.setCodeBody("vertex", `@${id}_vertex`);
 shader.setCodeBody("frag", `@${id}_frag`);
 return shader;
};

export function InitDefaultNodes(managere: typeof NodeManager) {
 managere.textures.addTextureType("#dve_node_texture");
 const defaultSubstances = ["#dve_solid", "#dve_flora", "#dve_liquid"];
 //defaultSubstances.forEach((s) => managere.textures.addTextureType(s));

 managere.shaders.create([
  NodeShaders.createSkyBoxShader("#dve_skybox"),
  NodeShaders.createBasicTextureShader("#dve_node_texture"),
  // ...defaultSubstances.map((v) => createVoxelShader(v)),
 ]);

 /*  managere.meshes.add(
  defaultSubstances.map((v) => {
   return {
    boundingBoxMaxSize: [1, 1, 1],
    id: v,
    materialId: v,
   };
  })
 );

 managere.materials.create(
  defaultSubstances.map((v) => {
   return {
    id: v,
    shaderId: v,
    textureTypeId: v,
    alphaBlending: v == "#dve_liquid" ? true : false,
    alphaTesting: true,
    backFaceCulling: v == "#dve_liquid" ? false : true,
   };
  })
 );
 */
 managere.substances.add(
  defaultSubstances.map((id) => {
   return {
    id,
    material: {
     alphaBlending: id == "#dve_liquid" ? true : false,
     alphaTesting: true,
     backFaceCulling: id == "#dve_liquid" ? false : true,
    },
    texture: managere.textures.addTextureType(id),
    shader: createVoxelShader(id),
    mesh: {
     materialId: id,
     boundingBoxMaxSize: [1, 1, 1],
    },
   };
  })
 );

 managere.meshes.add([
  {
   boundingBoxMaxSize: [1, 1, 1],
   id: "#dve_node_texture",
   materialId: "#dve_node_texture",
  },
 ]);

 managere.materials.create([
  {
   id: "#dve_node_texture",
   shaderId: "#dve_node_texture",
   textureTypeId: "#dve_node_texture",
   alphaBlending: false,
   alphaTesting: true,
  },
  {
   id: "#dve_skybox",
   shaderId: "#dve_skybox",
   textureTypeId: "#dve_skybox",
   alphaBlending: false,
   alphaTesting: false,
   backFaceCulling: false,
  },
 ]);
}
