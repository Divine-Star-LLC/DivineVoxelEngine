import { DVEShaderBuilder } from "../DVEShaderBuilder.js";
export class DVEShader {
    id;
    data;
    constructor(id, data) {
        this.id = id;
        this.data = data;
    }
    compiled = {
        vertex: "",
        fragment: "",
    };
    setCodeBody(forSharer = "shared", text) {
        if (forSharer == "vertex") {
            this.data.vertexMain.GLSL = text;
            return this;
        }
        if (forSharer == "frag") {
            this.data.fragMain.GLSL = text;
            return this;
        }
        return this;
    }
    getUniformList() {
        return [
            ...this.data.sharedUniforms.keys(),
            ...this.data.fragxUniforms.keys(),
            ...this.data.vertexUniforms.keys(),
            ...this.data.textures.keys(),
        ];
    }
    getAttributeList() {
        return [...this.data.attributes.keys()];
    }
    addUniform(data, forSharer = "shared") {
        if (forSharer == "shared") {
            for (const uniform of data) {
                this.data.sharedUniforms.set(uniform[0], uniform[1]);
            }
            return this;
        }
        if (forSharer == "vertex") {
            for (const uniform of data) {
                this.data.vertexUniforms.set(uniform[0], uniform[1]);
            }
            return this;
        }
        if (forSharer == "frag") {
            for (const uniform of data) {
                this.data.fragxUniforms.set(uniform[0], uniform[1]);
            }
            return this;
        }
        return this;
    }
    addVarying(data) {
        for (const varying of data) {
            this.data.varying.set(varying[0], [varying[1], varying[2]]);
        }
        return this;
    }
    addAttributes(data) {
        for (const attributes of data) {
            this.data.attributes.set(attributes[0], attributes[1]);
        }
        return this;
    }
    addTextures(data) {
        for (const attributes of data) {
            this.data.textures.set(attributes[0], attributes[1]);
        }
        return this;
    }
    addFunction(id, forSharer, data) {
        if (forSharer == "shared") {
            return this;
        }
        if (forSharer == "vertex") {
            this.data.localVertexFunctions.set(id, data);
            return this;
        }
        if (forSharer == "frag") {
            this.data.localFragFunctions.set(id, data);
            return this;
        }
        return this;
    }
    loadInFunctions(id, forSharer = "shared") {
        if (forSharer == "shared") {
            if (Array.isArray(id)) {
                this.data.sharedFunctions.push(...id);
                return this;
            }
            this.data.sharedFunctions.push(id);
            return this;
        }
        if (forSharer == "vertex") {
            if (Array.isArray(id)) {
                this.data.vertexFunctions.push(...id);
                return this;
            }
            this.data.vertexFunctions.push(id);
            return this;
        }
        if (forSharer == "frag") {
            if (Array.isArray(id)) {
                this.data.fragFunctions.push(...id);
                return this;
            }
            this.data.fragFunctions.push(id);
            return this;
        }
        return this;
    }
    compile() {
        const data = this.data;
        let uniforms = ``;
        for (const [key, type] of data.sharedUniforms) {
            uniforms += `uniform ${type} ${key};\n`;
        }
        let vertexUniforms = ``;
        for (const [key, type] of data.vertexUniforms) {
            vertexUniforms += `uniform ${type} ${key};\n`;
        }
        let fragUniforms = ``;
        for (const [key, type] of data.fragxUniforms) {
            fragUniforms += `uniform ${type} ${key};\n`;
        }
        let attributes = ``;
        for (const [key, type] of data.attributes) {
            attributes += `attribute ${type} ${key};\n`;
        }
        let textures = "";
        for (let [key, textureData] of data.textures) {
            let textureType = textureData.type;
            if (textureData.isArray && textureData.arrayLength) {
                key += `[${Number(textureData.arrayLength)}]`;
            }
            textures += `uniform ${textureType} ${key};\n`;
        }
        let varying = "";
        let vertexVarying = "";
        for (const [key, [type, set]] of data.varying) {
            varying += `varying ${type} ${key};\n`;
            vertexVarying += `${set.GLSL}\n`;
        }
        let functions = ``;
        for (const id of data.sharedFunctions) {
            functions += `${DVEShaderBuilder.buildFunction(id)}\n`;
        }
        let vertexFunctions = ``;
        for (const id of data.vertexFunctions) {
            vertexFunctions += `${DVEShaderBuilder.buildFunction(id)}\n`;
        }
        for (const [key, fd] of data.localVertexFunctions) {
            vertexFunctions += `${DVEShaderBuilder.buildFunction(key, fd)}\n`;
        }
        let fragFunctions = ``;
        for (const id of data.fragFunctions) {
            fragFunctions += `${DVEShaderBuilder.buildFunction(id)}\n`;
        }
        for (const [key, fd] of data.localFragFunctions) {
            fragFunctions += `${DVEShaderBuilder.buildFunction(key, fd)}\n`;
        }
        this.compiled.vertex = DVEShaderBuilder._replaceSnippets(`
precision highp float;
//uniforms
${uniforms}
${vertexUniforms}
//attributes
${attributes}
//varying
${varying}
//functions
${functions}
${vertexFunctions}
void main(void) {
${vertexVarying}
${data.vertexMain.GLSL}
}`);
        this.compiled.fragment = DVEShaderBuilder._replaceSnippets(`
precision highp float;
precision highp sampler2DArray;
//uniforms
${uniforms}
${fragUniforms}
//textures
${textures}
//varying
${varying}
//functions
${functions}
${fragFunctions}
void main(void) {
${data.fragMain.GLSL}
}`);
        return this.compiled;
    }
    clone(newID) {
        const shader = DVEShaderBuilder.createShader(newID);
        shader.data = structuredClone(this.data);
        return shader;
    }
}
