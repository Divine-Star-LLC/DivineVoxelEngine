import { DVEB } from "../../../DivineVoxelEngineBuilder.js";
const shapeDimensions1 = {
    width: 0.5,
    depth: 0.5,
    height: 0.5,
};
const shapeDimensions2 = {
    width: 0.5,
    depth: 0.5,
    height: 0.5,
};
let currentDimensions = shapeDimensions1;
const transform = {
    v1: { x: 0, y: 0, z: 0 },
    v2: { x: 0, y: 0, z: 0 },
    v3: { x: 0, y: 0, z: 0 },
    v4: { x: 0, y: 0, z: 0 },
};
const yTransform = {
    y1: 0,
    y2: 0,
    y3: 0,
    y4: 0,
};
const vertexLevels = {
    v1l: 0,
    v2l: 0,
    v3l: 0,
    v4l: 0,
    v1v: 0,
    v2v: 0,
    v3v: 0,
    v4v: 0,
};
const sourceBlockTest = (data) => {
    if (data.flowTemplate && data.flowTemplateIndex != undefined) {
        if ((data.flowTemplate[data.flowTemplateIndex + 1] == 15 &&
            data.flowTemplate[data.flowTemplateIndex + 2] == 15 &&
            data.flowTemplate[data.flowTemplateIndex + 3] == 15 &&
            data.flowTemplate[data.flowTemplateIndex + 4] == 15) ||
            data.flowTemplate[data.flowTemplateIndex] == 1) {
            yTransform.y1 = 0;
            yTransform.y2 = 0;
            yTransform.y3 = 0;
            yTransform.y4 = 0;
            return true;
        }
    }
    return false;
};
const calculateVertexLevels = (data) => {
    if (data.flowTemplate && data.flowTemplateIndex != undefined) {
        vertexLevels.v1l = data.flowTemplate[data.flowTemplateIndex + 1];
        vertexLevels.v2l = data.flowTemplate[data.flowTemplateIndex + 2];
        vertexLevels.v3l = data.flowTemplate[data.flowTemplateIndex + 3];
        vertexLevels.v4l = data.flowTemplate[data.flowTemplateIndex + 4];
        vertexLevels.v1v = vertexLevels.v1l / 15 - 1;
        vertexLevels.v2v = vertexLevels.v2l / 15 - 1;
        vertexLevels.v3v = vertexLevels.v3l / 15 - 1;
        vertexLevels.v4v = vertexLevels.v4l / 15 - 1;
    }
};
const resetVertexLevels = () => {
    vertexLevels.v1l = 0;
    vertexLevels.v2l = 0;
    vertexLevels.v3l = 0;
    vertexLevels.v4l = 0;
    vertexLevels.v1v = 0;
    vertexLevels.v2v = 0;
    vertexLevels.v3v = 0;
    vertexLevels.v4v = 0;
};
const resetTransform = () => {
    transform.v1.y = 0;
    transform.v2.y = 0;
    transform.v3.y = 0;
    transform.v4.y = 0;
};
const processDefaultFaceData = (face, data) => {
    const flip = DVEB.shapeHelper.shouldFaceFlip(data.face, face);
    DVEB.shapeBuilder.addFace(face, data.position, currentDimensions, data, flip, transform);
    const uv = data.unTemplate[data.uvTemplateIndex];
    const rotation = DVEB.shapeHelper.getTextureRotation(data.face, face);
    DVEB.uvHelper.addUVs(face, {
        uvs: data.uvs,
        uv: uv,
        width: { start: 0, end: 1 },
        height: { start: 0, end: 1 },
        flipped: flip,
        rotoate: rotation,
    });
    DVEB.uvHelper.processOverlayUVs(data);
    DVEB.shapeHelper.calculateLightColor(data.RGBLightColors, data.sunLightColors, data.lightTemplate, data.lightIndex);
    if (data.substance == "flora") {
        let animData = DVEB.shapeHelper.meshFaceData.setAnimationType(3, 0);
        DVEB.shapeHelper.addFaceData(animData, data.faceData);
    }
    else {
        DVEB.shapeHelper.addFaceData(0, data.faceData);
    }
    data.uvTemplateIndex += 1;
    data.overylayUVTemplateIndex += 4;
    data.lightIndex += 4;
    data.colorIndex += 4;
    data.aoIndex += 4;
};
const faceFunctions = {
    //add top face
    0: (data) => {
        calculateVertexLevels(data);
        transform.v1.y = vertexLevels.v1v + yTransform.y1;
        transform.v2.y = vertexLevels.v2v + yTransform.y1;
        transform.v3.y = vertexLevels.v3v + yTransform.y1;
        transform.v4.y = vertexLevels.v4v + yTransform.y1;
        processDefaultFaceData("top", data);
        resetTransform();
    },
    //add bottom face
    1: (data) => {
        processDefaultFaceData("bottom", data);
    },
    //add east face
    2: (data) => {
        //set();
        transform.v1.y = vertexLevels.v4v;
        transform.v2.y = vertexLevels.v3v;
        transform.v3.y = -yTransform.y1;
        transform.v4.y = -yTransform.y2;
        processDefaultFaceData("east", data);
        resetTransform();
    },
    //add weest face
    3: (data) => {
        transform.v1.y = vertexLevels.v2v;
        transform.v2.y = vertexLevels.v1v;
        processDefaultFaceData("west", data);
        resetTransform();
    },
    //add south face
    4: (data) => {
        transform.v1.y = vertexLevels.v1v;
        transform.v2.y = vertexLevels.v4v;
        processDefaultFaceData("south", data);
        resetTransform();
    },
    //add north face
    5: (data) => {
        transform.v1.y = vertexLevels.v3v;
        transform.v2.y = vertexLevels.v2v;
        processDefaultFaceData("north", data);
        resetTransform();
    },
};
export const FluidSourceBlockVoxelShape = {
    cullFace(data) {
        if (data.face == "top" &&
            data.neighborVoxel.substance != "fluid" &&
            data.voxel.id != data.neighborVoxel.id) {
            return true;
        }
        return data.substanceResult;
    },
    aoOverRide(data) {
        return data.substanceResult;
    },
    id: "FluidSourceBlock",
    addToChunkMesh(data) {
        if (sourceBlockTest(data)) {
        }
        if (DVEB.shapeHelper.isFaceExposexd(data.face, "top")) {
            data.position.x += shapeDimensions1.width;
            data.position.z += shapeDimensions1.depth;
            data.position.y += shapeDimensions1.height;
            currentDimensions = shapeDimensions1;
        }
        else {
            data.position.x += shapeDimensions2.width;
            data.position.z += shapeDimensions2.depth;
            data.position.y += shapeDimensions2.height;
            currentDimensions = shapeDimensions2;
        }
        if (DVEB.shapeHelper.isFaceExposexd(data.face, "top")) {
            faceFunctions[0](data);
        }
        if (DVEB.shapeHelper.isFaceExposexd(data.face, "bottom")) {
            faceFunctions[1](data);
        }
        if (DVEB.shapeHelper.isFaceExposexd(data.face, "east")) {
            faceFunctions[2](data);
        }
        if (DVEB.shapeHelper.isFaceExposexd(data.face, "west")) {
            faceFunctions[3](data);
        }
        if (DVEB.shapeHelper.isFaceExposexd(data.face, "south")) {
            faceFunctions[4](data);
        }
        if (DVEB.shapeHelper.isFaceExposexd(data.face, "north")) {
            faceFunctions[5](data);
        }
        resetVertexLevels();
        resetTransform();
        if (DVEB.shapeHelper.isFaceExposexd(data.face, "top")) {
            if (data.flowTemplateIndex !== undefined) {
                data.flowTemplateIndex += 5;
            }
        }
        return DVEB.shapeHelper.produceShapeReturnData(data);
    },
};
