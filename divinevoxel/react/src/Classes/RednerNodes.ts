import { DivineVoxelEngineRender } from "@divinevoxel/core/Render";

import { type Camera } from "@babylonjs/core";
import { Scene } from "@babylonjs/core/scene.js";
import { Engine } from "@babylonjs/core/Engines/engine.js";

import { SceneTool } from "@divinevoxel/core/Render/Tools/SceneTool";

export class RenderNodes {
  scene: Scene;
  camera: Camera;
  engine: Engine;
  canvas: HTMLCanvasElement;
  sceneTool: SceneTool;
  DVER: DivineVoxelEngineRender;
}
