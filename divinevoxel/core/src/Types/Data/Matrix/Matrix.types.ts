import { Vector3 } from "Math/Classes/Vector3"
export type VoxelMAtrixData = {
    bounds : Vector3,
    data : SharedArrayBuffer[],
}