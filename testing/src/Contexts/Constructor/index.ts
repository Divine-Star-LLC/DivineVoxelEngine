import { StartContrusctor } from "@divinevoxel/react/Contexts/Constructor";
import { GetLightDebugBox } from "./Voxels/LightDebugBox";
import { GetMarkerBox } from "./Voxels/MarkerBox";
import { GetDreamEther } from "./Voxels/LiquidDreamEther";
import { DivineVoxelEngineConstructor } from "@divinevoxel/core/Constructor";
import { Flat3DIndex, Vec3Array } from "@divinevoxel/core/Math";
import { BrushTool } from "@divinevoxel/core/Tools/Brush/Brush";
import { TemplateProcessor } from "@divinevoxel/core/Constructor/Builder/Processors/TemplateProcessor";
import { LocationData } from "@divinestar/voxelspaces";
await StartContrusctor({
  getVoxelConstructors(voxelConstructors) {
    const { defaults } = voxelConstructors;
    return [
      GetLightDebugBox(),
      GetMarkerBox(),
      GetDreamEther(),
      defaults.box.simple("dve_debug_box", {
        top: ["#dve_solid", "dve_debug_box", "top"],
        bottom: ["#dve_solid", "dve_debug_box", "bottom"],
        north: ["#dve_solid", "dve_debug_box", "north"],
        south: ["#dve_solid", "dve_debug_box", "south"],
        east: ["#dve_solid", "dve_debug_box", "east"],
        west: ["#dve_solid", "dve_debug_box", "west"],
      }),
      defaults.box.simple("dve_data_holder", [
        "#dve_solid",
        "dve_data_holder",
        "front",
      ]),
      //dream
      defaults.box.simple("dve_dream_grass_block", [
        "#dve_flora",
        "dve_dream_grass_block",
        "grassy-top",
      ]),
      defaults.box.pillar("dve_dream_stone_pillar", {
        top: ["#dve_solid", "dve_dream_stone_pillar", "top"],
        bottom: ["#dve_solid", "dve_dream_stone_pillar", "top"],
        sideBottom: ["#dve_solid", "dve_dream_stone_pillar", "side-bottom"],
        sideMiddle: ["#dve_solid", "dve_dream_stone_pillar"],
        sideTop: ["#dve_solid", "dve_dream_stone_pillar", "side-top"],
        sideFloat: ["#dve_solid", "dve_dream_stone_pillar", "top"],
      }),
      defaults.box.pillar("dve_dream_stone", {
        top: ["#dve_solid", "dve_dream_stone", "grassy-top"],
        bottom: ["#dve_solid", "dve_dream_stone"],
        sideBottom: ["#dve_solid", "dve_dream_stone"],
        sideMiddle: ["#dve_solid", "dve_dream_stone"],
        sideTop: ["#dve_solid", "dve_dream_stone", "grassy-side"],
        sideFloat: ["#dve_solid", "dve_dream_stone", "grassy-side"],
      }),
      defaults.box.simple("dve_dream_lamp", ["#dve_solid", "dve_dream_lamp"]),
      defaults.box.pillar("dve_dream_stone_slab", {
        top: ["#dve_solid", "dve_dream_stone", "grassy-top"],
        bottom: ["#dve_solid", "dve_dream_stone"],
        sideBottom: ["#dve_solid", "dve_dream_stone"],
        sideMiddle: ["#dve_solid", "dve_dream_stone"],
        sideTop: ["#dve_solid", "dve_dream_stone", "grassy-side"],
        sideFloat: ["#dve_solid", "dve_dream_stone", "grassy-side"],
      }),
      defaults.box.simple("dve_dream_log", ["#dve_solid", "dve_dream_log"]),
      defaults.box.simple("dve_dream_stone_stair", [
        "#dve_solid",
        "dve_dream_stone",
      ]),
      defaults.crossedPanel.simple("dve_dream_grass", [
        "#dve_flora",
        "dve_dream_grass",
      ]),
      defaults.panel.simple("dve_dream_vine", ["#dve_flora", "dve_dream_vine"]),
      defaults.box.simple("dve_dream_leaves", [
        "#dve_flora",
        "dve_dream_leaves",
      ]),
      //dread
      defaults.box.pillar("dve_dread_stone_pillar", {
        top: ["#dve_solid", "dve_dread_stone_pillar", "top"],
        bottom: ["#dve_solid", "dve_dread_stone_pillar", "top"],
        sideBottom: ["#dve_solid", "dve_dread_stone_pillar", "side-bottom"],
        sideMiddle: ["#dve_solid", "dve_dread_stone_pillar"],
        sideTop: ["#dve_solid", "dve_dread_stone_pillar", "side-top"],
        sideFloat: ["#dve_solid", "dve_dread_stone_pillar", "top"],
      }),
      defaults.box.pillar("dve_dread_stone", {
        top: ["#dve_solid", "dve_dread_stone", "grassy-top"],
        bottom: ["#dve_solid", "dve_dread_stone"],
        sideBottom: ["#dve_solid", "dve_dread_stone"],
        sideMiddle: ["#dve_solid", "dve_dread_stone"],
        sideTop: ["#dve_solid", "dve_dread_stone", "grassy-side"],
        sideFloat: ["#dve_solid", "dve_dread_stone", "grassy-side"],
      }),
      defaults.box.simple("dve_dread_lamp", ["#dve_solid", "dve_dread_lamp"]),
      defaults.liquid.simple("dve_liquid_dread_ether", [
        ["#dve_liquid", "dve_liquid_dread_ether", "still-1"],
        ["#dve_liquid", "dve_liquid_dread_ether", "still-1"],
      ]),

      defaults.crossedPanel.simple("dve_dread_grass", [
        "#dve_solid",
        "dve_dread_grass",
      ]),
    ];
  },
});

const loadInFlatIndex = new Flat3DIndex();
loadInFlatIndex.bounds = {
  x: 256,
  y: 128,
  z: 256,
};
const dataTool = DivineVoxelEngineConstructor.instance.getDataTool();
const brushTool = new BrushTool();
brushTool._update = false;
DivineVoxelEngineConstructor.instance.TC.registerTasks<
  [
    dimension: string,
    index: Vec3Array,
    start: Vec3Array,
    end: Vec3Array,
    sab: SharedArrayBuffer
  ]
>(
  "load-in-generated-world-segment",
  async ([dimension, index, start, end, sab], onDone) => {
    const data = new Uint32Array(sab);
    const sx = start[0];
    const sz = start[2];
    const ex = end[0];
    const ez = end[2];
    const sy = start[1];
    const ey = end[1];

    const location: LocationData = [dimension, 0, 0, 0];
    let [six, siy, siz] = index;
    let ix = six,
      iy = siy,
      iz = siz;

    for (let x = sx; x < ex; x += 16) {
      iz = siz;

      for (let z = sz; z < ez; z += 16) {
        iy = siy;

        for (let y = sy; y < ey; y += 16) {
          if (!dataTool._chunkTool.loadInAtLocation([dimension, x, y, z]))
            continue;

          let vix = ix,
            viy = iy,
            viz = iz;

          for (let cx = x; cx < x + 16; cx++) {
            viz = iz;
            for (let cz = z; cz < z + 16; cz++) {
              viy = iy;
              for (let cy = y; cy < y + 16; cy++) {
                location[1] = cx;
                location[2] = cy;
                location[3] = cz;

                const index =
                  DivineVoxelEngineConstructor.instance.data.spaces.voxel.getIndexLocation(
                    location
                  );

                const voxel_index =
                  loadInFlatIndex.getIndex([vix, viy, viz]) * 2;

                const mainData = data[voxel_index];
                const stateData = data[voxel_index + 1];
                dataTool._chunkTool.segments.id.set(index, mainData & 0xffff);
                dataTool._chunkTool.segments.light.set(
                  index,
                  (mainData & (0xffff << 16)) >>> 1
                );
                dataTool._chunkTool.segments.state.set(
                  index,
                  stateData & 0xffff
                );
                dataTool._chunkTool.segments.secondaryId.set(
                  index,
                  (stateData & (0xffff << 16)) >>> 16
                );
                viy++;
              }
              viz++;
            }
            vix++;
          }

          iy += 16;
        }
        iz += 16;
      }
      ix += 16;
    }

    if (onDone) onDone();
  },
  "deferred"
);

const templateInFlatIndex = new Flat3DIndex();
templateInFlatIndex.bounds = {
  x: 64,
  y: 128,
  z: 64,
};
DivineVoxelEngineConstructor.instance.TC.registerTasks<
  [
    dimension: string,
    index: Vec3Array,
    start: Vec3Array,
    end: Vec3Array,
    sab: SharedArrayBuffer
  ]
>(
  "build-world-template",
  async ([dimension, index, start, end, sab], onDone) => {
    const data = new Uint32Array(sab);
    const sx = start[0];
    const sz = start[2];
    const ex = end[0];
    const ez = end[2];
    const sy = start[1];
    const ey = end[1];

    let [six, siy, siz] = index;
    let ix = six,
      iy = siy,
      iz = siz;
    for (let x = sx; x < ex; x += 16) {
      iz = siz;
      for (let z = sz; z < ez; z += 16) {
        iy = siy;
        for (let y = sy; y < ey; y += 16) {
          TemplateProcessor.build(
            [dimension, x, y, z],
            data,
            [ix * 16, iy * 16, iz * 16],
            templateInFlatIndex
          );
          iy++;
        }
        iz++;
      }
      ix++;
    }

    if (onDone) onDone();
  },
  "deferred"
);
