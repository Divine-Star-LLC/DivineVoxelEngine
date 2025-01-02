import { RemoteBinaryStruct } from "@amodx/binary/";

import { WorldSpaces } from "../../../Data/World/WorldSpaces.js";
export interface VoxelDataArrays {
  ids: Uint16Array;
  light: Uint16Array;
  state: Uint16Array;
  secondary: Uint16Array;
  mod: Uint16Array;
}

export interface ChunkData extends VoxelDataArrays {
  buffer: ArrayBufferLike;
}

export interface Chunk extends ChunkData {}

export class Chunk {
  static CreateNew(): ChunkData {
    const voxelSize = WorldSpaces.chunk.getVolume();
    const chunkBuffer = new SharedArrayBuffer(
      Chunk.StateStruct.structSize +
        //ids
        voxelSize * 2 +
        //light
        voxelSize * 2 +
        //state
        voxelSize * 2 +
        //mod
        voxelSize * 2 +
        //secondary
        voxelSize * 2
    );
    let bufferStart = 0;
    Chunk.StateStruct.setBuffer(chunkBuffer);
    bufferStart = Chunk.StateStruct.structSize;

    const ids = new Uint16Array(chunkBuffer, bufferStart, voxelSize);
    bufferStart += voxelSize * 2;
    const light = new Uint16Array(chunkBuffer, bufferStart, voxelSize);
    bufferStart += voxelSize * 2;
    const state = new Uint16Array(chunkBuffer, bufferStart, voxelSize);
    bufferStart += voxelSize * 2;
    const mod = new Uint16Array(chunkBuffer, bufferStart, voxelSize);
    bufferStart += voxelSize * 2;
    const secondary = new Uint16Array(chunkBuffer, bufferStart, voxelSize);
    bufferStart += voxelSize * 2;
    return {
      buffer: chunkBuffer,
      ids,
      light,
      state,
      secondary,
      mod,
    };
  }

  static toObject(data: ChunkData) {
    return new Chunk(data);
  }
  static StateStruct = new RemoteBinaryStruct("chunk-tags");
  chunkState: DataView;

  constructor(data: ChunkData) {
    this.chunkState = new DataView(data.buffer);
    this.buffer = data.buffer;
    this.ids = data.ids;
    this.light = data.light;
    this.secondary = data.secondary;
    this.state = data.state;
    this.mod = data.mod;
  }

  serialize(): ChunkData {
    return {
      buffer: this.buffer,
      ids: this.ids,
      light: this.light,
      secondary: this.secondary,
      state: this.state,
      mod: this.mod,
    };
  }
}
