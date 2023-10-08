import type { VoxelUpdateTasks, UpdateTasks } from "Types/Tasks/Tasks.types.js";
import { Propagation } from "../../Propagation/Propagation.js";
import { EngineSettings as ES } from "../../../Data/Settings/EngineSettings.js";
import { DataTool } from "../../../Tools/Data/DataTool.js";
import { $3dCardinalNeighbors } from "../../../Math/Constants/CardinalNeighbors.js";
import { BrushTool } from "../../../Tools/Brush/Brush.js";

import { LightTaskRequest, TasksRequest } from "../TasksRequest.js";
import { LocationDataDistanceSort } from "../../../Math/Functions/DistnaceSort.js";

const dataTool = new DataTool();
const nDataTool = new DataTool();
const brushTool = new BrushTool();
brushTool._update = false;

const updateLightTask = (tasks: LightTaskRequest) => {
 let doRGB = ES.doRGBPropagation();
 let doSun = ES.doSunPropagation();
 const [dimension, x, y, z] = tasks.origin;
 nDataTool.setDimension(dimension);
 for (const n of $3dCardinalNeighbors) {
  const nx = n[0] + x;
  const ny = n[1] + y;
  const nz = n[2] + z;
  if (!nDataTool.loadInAt(nx, ny, nz)) continue;
  if (doRGB) {
   if (nDataTool.hasRGBLight()) {
    tasks.queues.rgb.update.push(nx, ny, nz);
   }
  }
  if (doSun) {
   if (nDataTool.hasSunLight()) {
    tasks.queues.sun.update.push(nx, ny, nz);
   }
  }
 }
};

export async function EreaseAndUpdate(data: UpdateTasks) {
 if (!dataTool.setLocation(data[0]).loadIn()) return false;
 const [dimension, x, y, z] = data[0];
 const tasks = TasksRequest.getVoxelUpdateRequests(data[0], data[1], data[2]);
 tasks.setPriority(0).start().setBuldMode("sync").addToRebuildQueue(x, y, z);
 tasks.setBuldMode("async").addNeighborsToRebuildQueue(x, y, z);
 if (ES.doFlow()) {
  if (dataTool.getSubstnaceData().isLiquid()) {
   await Propagation.flow.remove(tasks);
   tasks.stop();
   return true;
  }
 }

 const light = dataTool.getLight();
 const isLightSource = dataTool.isLightSource();
 dataTool
  .setLight(light > 0 ? light : 0)
  .setAir()
  .commit(2);
 if (ES.doLight()) {
  if (ES.doRGBPropagation() && isLightSource) {
   tasks.queues.rgb.remove.push(x, y, z);
   Propagation.rgb.remove(tasks);
  }
  updateLightTask(tasks);
  if (ES.doRGBPropagation()) {
   Propagation.rgb.update(tasks);
  }
  if (ES.doSunPropagation()) {
   Propagation.sun.update(tasks);
  }
 }

 // LocationDataDistanceSort(tasks.origin, tasks.syncQueue);
 tasks.runRebuildQueue();
 tasks.stop();
 return true;
}

export async function PaintAndUpdate(data: VoxelUpdateTasks) {
 if (!dataTool.setLocation(data[0]).loadIn()) return false;
 const [dimension, x, y, z] = data[0];
 const raw = data[1];
 const tasks = TasksRequest.getVoxelUpdateRequests(data[0], data[2], data[3]);
 tasks.start().setPriority(0).setBuldMode("sync").addToRebuildQueue(x, y, z);
 tasks.setBuldMode("async").addNeighborsToRebuildQueue(x, y, z);
 brushTool.setLocation(data[0]).setRaw(raw);
 nDataTool.loadInRaw(raw);
 const substanceData = nDataTool.getSubstnaceData();

 const isOpaque = nDataTool.isOpaque();
 let doRGB = ES.doRGBPropagation();
 let doSun = ES.doSunPropagation();

 lighttest: if (ES.doLight()) {
  const light = dataTool.getLight();
  if (light <= 0) break lighttest;
  if (doSun) {
   if (dataTool.hasSunLight()) {
    tasks.queues.sun.remove.push(x, y, z);
    Propagation.sun.remove(tasks);
   }
  }
  if (doRGB) {
   if (dataTool.hasRGBLight() && isOpaque) {
    tasks.queues.rgb.remove.push(x, y, z);
    Propagation.rgb.remove(tasks);
   }
  }
 }

 brushTool.paint();

 if (ES.doLight()) {
  updateLightTask(tasks);
  if (doRGB) {
   tasks.queues.rgb.update.push(x, y, z);
   Propagation.rgb.update(tasks);
  }
  if (doSun) {
   Propagation.sun.update(tasks);
  }
 }

 if (ES.doFlow()) {
  if (substanceData.isLiquid()) {
   Propagation.flow.update(tasks);
  }
 }

 tasks.runRebuildQueue();
 tasks.stop();
 return;
}

export async function VoxelUpdate(data: VoxelUpdateTasks) {
 if (!dataTool.setLocation(data[0]).loadIn()) return false;
 const [dimension, x, y, z] = data[0];
 const tasks = TasksRequest.getVoxelUpdateRequests(data[0], data[2], data[3]);
 tasks.setPriority(0).start().setBuldMode("sync").addToRebuildQueue(x, y, z);
 tasks.setBuldMode("async").addNeighborsToRebuildQueue(x, y, z);

 dataTool.loadInRaw(data[1]);
 dataTool.commit();

 let doRGB = ES.doRGBPropagation();
 let doSun = ES.doSunPropagation();

 if (ES.doLight()) {
  updateLightTask(tasks);
  if (doRGB) {
   tasks.queues.rgb.update.push(x, y, z);
   Propagation.rgb.update(tasks);
  }
  if (doSun) {
   Propagation.sun.update(tasks);
  }
 }

 if (ES.doFlow()) {
  if (dataTool.getSubstnaceData().isLiquid()) {
   Propagation.flow.update(tasks);
  }
 }

 tasks.runRebuildQueue();
 tasks.stop();
 return;
}
