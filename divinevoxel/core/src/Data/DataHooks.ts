import { Hooks } from "@divinestar/utils/Hooks";
import type { LocationData } from "@divinestar/voxelspaces";
import { DimensionData } from "Types/Data/DimensionData.types.js";
import { EngineSettingsData } from "Types/Data/Settings/EngineSettings.types.js";

export const DataHooks = {
 dimension: {
  onRegisterDimension: Hooks.getSyncHook<DimensionData, void>(),
 },
 chunk: {
  onGetAsync: Hooks.getAsyncHook<LocationData, SharedArrayBuffer>(),
  onGetSync: Hooks.getSyncHook<LocationData, SharedArrayBuffer>(),
  onNew: Hooks.getAsyncHook<LocationData, void>(),
  onRemove: Hooks.getSyncHook<LocationData, void>(),
 },
 column: {
  onGetAsync: Hooks.getAsyncHook<LocationData, SharedArrayBuffer>(),
  onGetSync: Hooks.getSyncHook<LocationData, SharedArrayBuffer>(),
  onNew: Hooks.getAsyncHook<LocationData, void>(),
  onRemove: Hooks.getSyncHook<LocationData, void>(),
 },
 region: {
  onGetAsync: Hooks.getAsyncHook<LocationData, SharedArrayBuffer>(),
  onGetSync: Hooks.getSyncHook<LocationData, SharedArrayBuffer>(),
  onNew: Hooks.getAsyncHook<LocationData, void>(),
  onRemove: Hooks.getSyncHook<LocationData, void>(),
 },
 paint: {
  onAddToRGBUpdate: Hooks.getSyncHook<LocationData, void>(),
  onRichVoxelPaint: Hooks.getSyncHook<[id:string,location : LocationData], void>(),
 },
 settingsSynced : Hooks.getSyncHook<EngineSettingsData, void>(),
};
