import { VoxelData } from "Meta/index";
import { DirectionNames } from "Meta/Util.types";
import { VoxelShapeInterface } from "Meta/Constructor/VoxelShape.types";
export declare type CullFaceOverride = {
    face: DirectionNames;
    substanceResult: boolean;
    shapeState: number;
    voxel: VoxelData;
    neighborVoxel: VoxelData;
    neighborVoxelShape: VoxelShapeInterface;
    neighborVoxelShapeState: number;
};
export declare type AOAddOVerRide = {
    face: DirectionNames;
    substanceResult: boolean;
    shapeState: number;
    voxel: VoxelData;
    neighborVoxel: VoxelData;
    neighborVoxelShape: VoxelShapeInterface;
    neighborVoxelShapeState: number;
};
