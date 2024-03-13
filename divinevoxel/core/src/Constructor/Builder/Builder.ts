import { ConstructorHooks } from "../Hooks/ConstructorHooks.js";
import { LocationData } from "Math/index.js";
import { VoxelConstructors } from "./Constructors/Voxel/VoxelConstructors.js";
import { ChunkProcessor } from "./Processors/ChunkProcessor.js";
import { OverrideManager } from "./Rules/Overrides/OverridesManager.js";
import { RenderedSubstances } from "./Rules/RenderedSubstances.js";
import { TextureManager } from "./Textures/TextureManager.js";
import { NodeBuilderManager } from "./Nodes/NodeBuilderManager.js";


export const Builder = {
 constructors: VoxelConstructors,
 textureManager: TextureManager,
 chunkProcessor: ChunkProcessor,
 nodes : NodeBuilderManager,
 overrides: OverrideManager,
 renderedSubstances: RenderedSubstances,

 $INIT() {
 
  ConstructorHooks.texturesRegistered.addToRun((manager) => {
   this.constructors.constructors._map.forEach((_) => {
    _.onTexturesRegistered(manager);
   });
  });
 },
 buildChunk(location: LocationData, LOD = 1) {
  this.chunkProcessor.build(location);
  return true;
 },
};
