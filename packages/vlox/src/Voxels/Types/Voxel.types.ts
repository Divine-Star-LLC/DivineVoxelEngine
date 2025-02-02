import { TextureId } from "../../Textures/index";
import { VoxelModelConstructorData } from "../../Models/VoxelModel.types";
import { VoxelTags } from "../Data/VoxelTag.types";

export type VoxelNamedStateData = {
  id: string;
  name?: string;
  state?: string;
  mod?: string;
  properties: {
    [key: string]: any;
  };
  display:
    | {
        type: "texture";
        source: TextureId | string;
      }
    | {
        type: "model";
        state?: string;
        mod?: string;
      };
};

export class PaintVoxelData {
  static Create(data: Partial<PaintVoxelData>) {
    return new PaintVoxelData(
      data.id,
      data.mod,
      data.state,
      data.level,
      data.levelState,
      data.secondaryVoxelId
    );
  }
  private constructor(
    public id: string = "dve_air",
    public mod: number = 0,
    public state: number = 0,
    public level: number = 0,
    public levelState: number = 0,
    public secondaryVoxelId: string = "dve_air"
  ) {}
}

/**
 * An array representing the raw data of a voxel.
 */
export type RawVoxelData = [
  /**The id of the voxel */
  id: number,
  /**The light of the voxel */
  light: number,
  /**The level of the voxel */
  level: number,
  /**The state of the voxel */
  state: number,
  /**The mod of the voxel */
  mod: number,
  /**The secondary id of the voxel */
  secondary: number,
];

interface VoxelProperties extends Partial<VoxelTags> {
  [key: string]: any;

  /** Named states associated with the voxel. */
  dve_named_states?: VoxelNamedStateData[];

  /** Model data used to construct the voxel's appearance. */
  dve_model_data?: VoxelModelConstructorData;
}

/*
 * A register entry for a voxel.
 */
export interface VoxelData {
  /**The id of the voxel. This should not change and must be unique. Can be used durning runtime to refernce voxels. */
  id: string;
  /**The name of the voxel. This can change but must be unique. Can be used durning runtime to refernce voxels. */
  name?: string;
  /**The title of the voxel. This can change and does not have to be unique. Cannot be used to refernce a voxel.  */
  title?: string;
  /**The properties of the voxel. */
  properties: VoxelProperties;
}
