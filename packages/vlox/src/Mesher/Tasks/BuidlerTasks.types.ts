import { LocationData } from "../../Math";
import { CompactMeshData } from "Mesher/Types/Mesher.types";
export type BuildNodeMesh = [location: LocationData, type: string, data: any];

export type SetNodeMesh = [
  location: LocationData,
  attributes: CompactMeshData
];
