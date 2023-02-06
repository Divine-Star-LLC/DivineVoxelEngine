/// <reference types="babylonjs" />
import { DVEShader } from "Libs/Shaders/Classes/DVEShader";
import { VoxelSubstanceType } from "Meta/Data/Voxels/Voxel.types";
export declare const AnimationManager: {
    animatedMaterials: Record<VoxelSubstanceType | "Item", BABYLON.ShaderMaterial>;
    animCount: number;
    animationUniforms: Map<string, Float32Array>;
    overlayAnimationUniforms: Map<string, Float32Array>;
    animations: {
        uniformIndex: number;
        overlay?: boolean | undefined;
        keys: number[];
        currentFrame: number;
        currentCount: number;
        keyCounts: number[];
        substance: VoxelSubstanceType | "Item";
    }[];
    /**# Register Animations
     * ---
     * Given the data from the texture creator it will generate
     * the needed shader code for each material.
     * It will also add the all animations into its anim que.
     * @param voxelSubstanceType
     * @param animations
     * @returns
     */
    registerAnimationsN(voxelSubstanceType: VoxelSubstanceType | "Item", shader: DVEShader, animations: number[][], animationTimes: number[][], overlay?: boolean): Float32Array;
    registerMaterial(voxelSubstanceType: VoxelSubstanceType | "Item", material: BABYLON.ShaderMaterial): void;
    startAnimations(): void;
};
