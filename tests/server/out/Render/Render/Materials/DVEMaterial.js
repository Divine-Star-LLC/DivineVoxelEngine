import { DVER } from "../../DivineVoxelEngineRender.js";
export class DVEMaterial {
    type;
    options;
    material = null;
    time = 0;
    constructor(type = "solid", options) {
        this.type = type;
        this.options = options;
    }
    getMaterial() {
        return this.material;
    }
    updateFogOptions(data) {
        if (!this.material)
            return;
        this.material.setVector4("fogOptions", data);
    }
    setSunLightLevel(level) {
        if (!this.material) {
            throw new Error("Material must be created first before it can be updated.");
        }
        this.material.setFloat("sunLightLevel", level);
    }
    setBaseLevel(level) {
        if (!this.material) {
            throw new Error("Material must be created first before it can be updated.");
        }
        this.material.setFloat("baseLevel", level);
    }
    updateMaterialSettings(settings) {
        if (!this.material) {
            throw new Error("Material must be created first before it can be updated.");
        }
        if (settings.lighting?.doAO) {
            this.material.setFloat("doAO", 1.0);
        }
        else {
            this.material.setFloat("doAO", 0.0);
        }
        if (settings.lighting?.doSunLight) {
            this.material.setFloat("doSun", 1.0);
        }
        else {
            this.material.setFloat("doSun", 0.0);
        }
        if (settings.lighting?.doRGBLight) {
            this.material.setFloat("doRGB", 1.0);
        }
        else {
            this.material.setFloat("doRGB", 0.0);
        }
        if (settings.voxels?.doColors) {
            this.material.setFloat("doColor", 1.0);
        }
        else {
            this.material.setFloat("doColor", 0.0);
        }
        if (DVER.render.effectOptions.liquidEffects ||
            DVER.render.effectOptions.floraEffects) {
            this.material.setFloat("doEffects", 1);
        }
        else {
            this.material.setFloat("doEffects", 0);
        }
    }
    createMaterial(data) {
        const shader = DVER.render.shaders.createVoxelShader("solid");
        const animData = DVER.render.animationManager.registerAnimationsN(this.type, data.animations, data.animationTimes);
        shader.addUniform(animData.uniforms);
        shader.addFunction("getUVFace", "vertex", {
            inputs: [["uv", "float"]],
            output: "float",
            body: {
                GLSL: animData.animationFunctionBody,
            },
        });
        const overlayAnimData = DVER.render.animationManager.registerAnimationsN(this.type, data.overlayAnimations, data.overlayAnimationTimes, true);
        shader.setCodeBody("vertex", `@#dve_${this.type}_vertex`);
        shader.setCodeBody("frag", `@#dve_${this.type}_frag`);
        shader.addUniform(overlayAnimData.uniforms);
        shader.addFunction("getOverlayUVFace", "vertex", {
            inputs: [["uv", "float"]],
            output: "float",
            body: {
                GLSL: overlayAnimData.animationFunctionBody,
            },
        });
        shader.compile();
        BABYLON.Effect.ShadersStore[`${this.type}VertexShader`] =
            shader.compiled.vertex;
        BABYLON.Effect.ShadersStore[`${this.type}FragmentShader`] =
            shader.compiled.fragment;
        const shaderMaterial = new BABYLON.ShaderMaterial(this.type, data.scene, this.type, {
            attributes: shader.getAttributeList(),
            uniforms: shader.getUniformList(),
            needAlphaBlending: this.options.alphaBlending,
            needAlphaTesting: this.options.alphaTesting,
        });
        this.material = shaderMaterial;
        this.material.fogEnabled = true;
        if (this.options.alphaBlending) {
            //shaderMaterial.separateCullingPass = fals;
            shaderMaterial.backFaceCulling = false;
            shaderMaterial.forceDepthWrite = true;
            shaderMaterial.needDepthPrePass = true;
        }
        shaderMaterial.setTextureArray("voxelTexture", data.texture);
        shaderMaterial.setTextureArray("voxelOverlayTexture", data.overlayTexture);
        shaderMaterial.setFloat("sunLightLevel", 1);
        shaderMaterial.setFloat("baseLevel", 0.1);
        shaderMaterial.setVector3("worldOrigin", BABYLON.Vector3.Zero());
        this.material.onBind = (mesh) => {
            if (!this.material)
                return;
            const effect = this.material.getEffect();
            const scene = mesh.getScene();
            if (!effect)
                return;
            effect.setFloat4("vFogInfos", scene.fogMode, scene.fogStart, scene.fogEnd, scene.fogDensity);
            effect.setColor3("vFogColor", scene.fogColor);
        };
        this.updateMaterialSettings(data.settings);
        DVER.render.animationManager.registerMaterial(this.type, this.material);
        return this.material;
    }
    overrideMaterial(material) {
        this.material = material;
    }
    runEffects() {
        // if (DVER.render.fogOptions.mode != "animated-volumetric") return;
        if (!this.material)
            return;
        this.time += 0.005;
        this.material.setFloat("time", this.time);
        if (DVER.render.fo.activeNode) {
            this.material.setVector3("worldOrigin", DVER.render.fo.activeNode.position);
        }
    }
}
