import { DivineShader, DivineShaderBuilder } from "@divinestar/shaders";
import { UtilMap } from "@divinevoxel/core/Global/Util/UtilMap";

export class DVEShaderRegister {
  shaders = new UtilMap<string, DivineShader>();

  create(shaders: DivineShader[]) {
    for (const shader of shaders) {
      this.shaders.add([[shader.id, shader]]);
    }
  }
  get(id: string) {
    return this.shaders.get(id);
  }
  getBulder() {
    return DivineShaderBuilder;
  }
}
