import { ChunkData } from "Meta/Chunks/Chunk.types";
export interface WorldDataInterface {
    chunks: Record<number, Record<number, ChunkData>>;
    setChunk(chunkX: number, chunkY: number, chunkZ: number, chunk: ChunkData): void;
    removeChunk(chunkX: number, chunkY: number, chunkZ: number, chunk: ChunkData): void;
}
