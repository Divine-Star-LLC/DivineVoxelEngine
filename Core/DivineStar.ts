
import { BuilderManager } from "./Build/BuilderManager.js";
import { ChunkMaterial } from "./Build/ChunkMaterial.js";
import { ChunkManager } from "./Chunks/ChunkManager.js";
import { Player } from "./Player/Player.js";
import { World } from "./World/World.js";

export class DivineStar {
  world: World;
  player: Player;
  chunkManager : ChunkManager;
  builderManager : BuilderManager;
  chunkMaterial : ChunkMaterial;

  constructor() {
    this.world = new World(this);
    this.player = new Player(this);
    this.chunkManager = new ChunkManager(this);
    this.builderManager = new BuilderManager(this);
    this.chunkMaterial = new ChunkMaterial();
    

  }
}
