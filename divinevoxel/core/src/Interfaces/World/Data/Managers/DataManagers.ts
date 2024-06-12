import { VoxelData } from "../../../../Types/index.js";
import { RegisterDataManager } from "../Classes/RegisterDataManager.js";
import { SubstanceData } from "../../../../Types/Substances.types.js";

export const VoxelManager = new RegisterDataManager<VoxelData>();
export const SubstanceManager = new RegisterDataManager<SubstanceData>();

VoxelManager.registerData([
  {
    id: "dve_air",
    tags: [
      ["#dve_substance", "#dve_air"],
      ["#dve_shape_id", "#dve_box"],
    ],
  },
  {
    id: "dve_barrier",
    tags: [
      ["#dve_substance", "#dve_air"],
      ["#dve_shape_id", "#dve_box"],
    ],
  },
]);

SubstanceManager.registerData([
  {
    id: "#dve_air",
    tags: [
      ["#dve_parent_substance", "#dve_air"],
      ["#dve_rendered_substance", "#dve_air"],
      ["#dve_is_solid", false],
      ["#dve_is_liquid", false],
      ["#dve_is_transparent", true],
      ["#dve_flow_rate", 0],
      ["#dve_culled_substances", []],
    ],
  },
  {
    id: "#dve_solid",
    tags: [
      ["#dve_parent_substance", "#dve_solid"],
      ["#dve_rendered_substance", "#dve_solid"],
      ["#dve_is_solid", true],
      ["#dve_is_liquid", false],
      ["#dve_is_transparent", false],
      ["#dve_flow_rate", 0],
      ["#dve_culled_substances", ["#dve_solid"]],
    ],
  },
  {
    id: "#dve_glow",
    tags: [
      ["#dve_parent_substance", "#dve_solid"],
      ["#dve_rendered_substance", "#dve_glow"],
      ["#dve_is_solid", true],
      ["#dve_is_liquid", false],
      ["#dve_is_transparent", false],
      ["#dve_flow_rate", 0],
      ["#dve_culled_substances", ["#dve_solid"]],
    ],
  },
  {
    id: "#dve_translucent",
    tags: [
      ["#dve_parent_substance", "#dve_flora"],
      ["#dve_rendered_substance", "#dve_solid"],
      ["#dve_is_solid", true],
      ["#dve_is_liquid", false],
      ["#dve_is_transparent", true],
      ["#dve_flow_rate", 0],
      ["#dve_culled_substances", []],
    ],
  },
  {
    id: "#dve_transparent",
    tags: [
      ["#dve_parent_substance", "#dve_solid"],
      ["#dve_rendered_substance", "#dve_solid"],
      ["#dve_is_solid", true],
      ["#dve_is_liquid", false],
      ["#dve_is_transparent", true],
      ["#dve_flow_rate", 0],
      ["#dve_culled_substances", ["#dve_transparent"]],
    ],
  },
  {
    id: "#dve_flora",
    tags: [
      ["#dve_parent_substance", "#dve_flora"],
      ["#dve_rendered_substance", "#dve_flora"],
      ["#dve_is_solid", true],
      ["#dve_is_liquid", false],
      ["#dve_is_transparent", true],
      ["#dve_flow_rate", 0],
      ["#dve_culled_substances", []],
    ],
  },
  {
    id: "#dve_liquid",
    tags: [
      ["#dve_parent_substance", "#dve_liquid"],
      ["#dve_rendered_substance", "#dve_liquid"],
      ["#dve_is_solid", false],
      ["#dve_is_liquid", true],
      ["#dve_is_transparent", true],
      ["#dve_flow_rate", 1],
      ["#dve_culled_substances", ["#dve_liquid", "#dve_solid", "#dve_glow"]],
    ],
  },
  {
    id: "#dve_magma",
    tags: [
      ["#dve_parent_substance", "#dve_liquid"],
      ["#dve_rendered_substance", "#dve_liquid"],
      ["#dve_is_solid", false],
      ["#dve_is_liquid", true],
      ["#dve_is_transparent", false],
      ["#dve_flow_rate", 3],
      ["#dve_culled_substances", ["#dve_liquid", "#dve_solid"]],
    ],
  },
]);
