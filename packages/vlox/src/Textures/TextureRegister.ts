import type { ConstructorTextureData } from "./Constructor.types";
import type { TextureTypeUVMap } from "./Texture.types";

export const TextureRegister = {
  textureDataHasBeenSet: false,

  data: <TextureTypeUVMap>{},
  getTextureUV(data: ConstructorTextureData): number {
    const [textureType, textureId, varation] = data;
    let id = textureId;
    if (varation) {
      id = `${textureId}:${varation}`;
    }
    let uv = -1;

    uv = this.data[textureType][id];

    if (uv == -1) {
      throw new Error(
        `Texture with id: ${id} does not exists.`
      );
    }
    return uv;
  },

  setTextureIndex(data: TextureTypeUVMap) {
    this.textureDataHasBeenSet = true;
    this.data = data;
  },

  releaseTextureData() {
    (this as any).data = null;
    delete (this as any)["data"];
  },

  isReady() {
    return this.textureDataHasBeenSet;
  },
};
