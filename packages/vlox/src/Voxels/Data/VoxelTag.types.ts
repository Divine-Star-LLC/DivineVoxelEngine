export enum VoxelTagIds {
  substance = "dve_substance",
  renderedMaterial = "dve_rendered_material",
  voxelMaterial = "dve_voxel_material",
  hardness = "dve_hardness",
  colliderID = "dve_collider_id",
  checkCollisions = "dve_check_collisions",
  isLightSource = "dve_is_light_source",
  noAO = "dve_no_ao",
  isTransparent = "dve_is_transparent",
  lightValue = "dve_light_value",
  canHaveSecondary = "dve_can_have_secondary",
}

export interface VoxelTags {
  /** The material used to render the voxel. Used by the engine to assign meshes to the proper material. */
  [VoxelTagIds.renderedMaterial]: string;

  /** A description of the material used for the voxel. Not used by the engine directly. */
  [VoxelTagIds.voxelMaterial]: string;

  /** Specifies the substance of the voxel.
   * The voxel will inherit properties from the substance and change how it acts in the world.
   * Properties include being solid or liquid.
   * */
  [VoxelTagIds.substance]: string;

  /** Indicates whether the voxel is a light source. */
  [VoxelTagIds.isLightSource]: boolean;

  /** Indicates if the voxel lets light through */
  [VoxelTagIds.isTransparent]: boolean;

  /** Disables ambient occlusion for this voxel if set to true. */
  [VoxelTagIds.noAO]: boolean;

  /** Defines the light value emitted by the voxel (r, g, z). */
  [VoxelTagIds.lightValue]: [r: number, g: number, z: number] | number;

  /** The collider ID for the voxel, used for collision detection. */
  [VoxelTagIds.colliderID]: string;

  /** Specifies if the voxel participates in collision checks. */
  [VoxelTagIds.checkCollisions]: boolean;

  /** Indicates if the voxel can have a secondary voxel. */
  [VoxelTagIds.canHaveSecondary]: boolean;

  /** The hardness level of the voxel, affecting how it is broken or interacted with. */
  [VoxelTagIds.hardness]: number;
}

export enum VoxelSubstanceTagIdds {
  parent = "dve_parent_substance",
  isSolid = "dve_is_solid",
  isTransparent = "dve_is_transparent",
  isLiquid = "dve_is_liquid",
  flowRate = "dve_flow_rate",
  isWindAffected = "dve_is_wind_affected",
}
export interface VoxelSubstanceTags {
  [VoxelSubstanceTagIdds.parent]: string;
  [VoxelSubstanceTagIdds.isTransparent]: boolean;
  [VoxelSubstanceTagIdds.isSolid]: boolean;
  [VoxelSubstanceTagIdds.isLiquid]: boolean;
  [VoxelSubstanceTagIdds.flowRate]: number;
  [VoxelSubstanceTagIdds.isWindAffected]: boolean;
}
