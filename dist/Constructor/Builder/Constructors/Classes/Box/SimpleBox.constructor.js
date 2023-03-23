import { BoxVoxelShape } from "../../../Shapes/default/Box/Box.voxel.shape.js";
import { VoxelConstructor } from "../VoxelConstructor.js";
export class SimpleBoxVoxelConstructor extends VoxelConstructor {
    id;
    textureData;
    textures = [];
    constructor(id, textureData) {
        super();
        this.id = id;
        this.textureData = textureData;
    }
    process(tool) {
        tool.getOverlayTextures().setAll(0);
        if (tool.isFaceExposed("top")) {
            tool.setTexture(this.textures[0]).calculateLight("top");
            BoxVoxelShape.add.top();
        }
        if (tool.isFaceExposed("bottom")) {
            tool.setTexture(this.textures[1]).calculateLight("bottom");
            BoxVoxelShape.add.bottom();
        }
        if (tool.isFaceExposed("east")) {
            tool.setTexture(this.textures[2]).calculateLight("east");
            BoxVoxelShape.add.east();
        }
        if (tool.isFaceExposed("west")) {
            tool.setTexture(this.textures[3]).calculateLight("west");
            BoxVoxelShape.add.west();
        }
        if (tool.isFaceExposed("south")) {
            tool.setTexture(this.textures[4]).calculateLight("south");
            BoxVoxelShape.add.south();
        }
        if (tool.isFaceExposed("north")) {
            tool.setTexture(this.textures[5]).calculateLight("north");
            BoxVoxelShape.add.north();
        }
    }
    onTexturesRegistered(textureManager) {
        const textures = this.textureData;
        if (Array.isArray(textures)) {
            let i = 6;
            while (i--) {
                this.textures.push(textureManager.getTextureUV(textures));
            }
            return;
        }
        this.textures.push(textureManager.getTextureUV(textures.top));
        this.textures.push(textureManager.getTextureUV(textures.bottom));
        this.textures.push(textureManager.getTextureUV(textures.east));
        this.textures.push(textureManager.getTextureUV(textures.west));
        this.textures.push(textureManager.getTextureUV(textures.south));
        this.textures.push(textureManager.getTextureUV(textures.north));
    }
}
