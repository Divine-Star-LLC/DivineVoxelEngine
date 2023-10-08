import type { AddVoxelData, ChunkData } from "../../Types/Data/WorldData.types";
import { WorldRegister } from "./WorldRegister.js";
import { DataHooks } from "../DataHooks.js";
import { DimensionsRegister } from "./Dimensions/DimensionsRegister.js";
import { VoxelPaletteReader } from "../Voxel/VoxelPalette.js";
import { DataTool } from "../../Tools/Data/DataTool.js";
import type { LocationData } from "@divinestar/voxelspaces";

type ID = string | number;
const WP = {
 _currentionDimension: "main",
 paint: {
  _dt: new DataTool(),
  voxel(location: LocationData, data: AddVoxelData, update = true) {
   if (!location[0]) {
    location[0] = WP._currentionDimension;
   }

   let chunk = WorldRegister.chunk.get(location);
   if (!chunk) {
    let buffer = DataHooks.chunk.onGetSync.run(location);
    if (!buffer) return;
    chunk = WorldRegister.chunk.add(location, buffer);
   }
   this.__paint(location, data, update);
  },

  __paint(location: LocationData, data: AddVoxelData, update = true) {
   this._dt.setLocation(location);

   if (!this._dt.setLocation(location).loadIn()) return;
   const id = VoxelPaletteReader.id.getPaletteId(
    data.id,
    data.state ? data.state : 0
   );
   if (id < 0) return false;
   this._dt.setId(id);

   this._dt.setShapeState(data.shapeState ? data.shapeState : 0);

   if (this._dt.getSubstnaceData().isLiquid()) {
    this._dt.setLevel(15);
   }

   if (data.secondaryVoxelId && data.secondaryVoxelId != "dve_air") {
    const vid = VoxelPaletteReader.id.getPaletteId(
     data.secondaryVoxelId,
     data.secondaryState ? data.secondaryState : 0
    );

    if (vid > 0) {
     this._dt.setSecondary(true);
     this._dt.setId(vid);
     this._dt.setSecondary(false);
    }
   }

   if (this._dt.isLightSource() && this._dt.getLightSourceValue()) {
    this._dt.setLight(this._dt.getLightSourceValue());
    if (update) {
     DataHooks.paint.onAddToRGBUpdate.run(location);
    }
   }

   if (this._dt.isRich()) {
    DataHooks.paint.onRichVoxelPaint.run([this._dt.getStringId(), location]);
   }

   this._dt.commit(1);
  },

  erase(location: LocationData) {
   this._dt.setLocation(location);
   if (!this._dt.loadIn()) return;
   if (!this._dt.isRenderable()) return;
   this._dt
    .setLight(0)
    .setLevel(0)
    .setLevelState(0)
    .setShapeState(0)
    .setAir()
    .commit(2);
  },
 },
};

export const WorldPainter = WP;
