export const ParticleSystemData = {
 name: "New Particle System",
 id: "428b9595-838a-4671-bbc6-ad6e2e4e25fa",
 capacity: 1000,
 emitter: [0, -20, 0],
 particleEmitterType: {
  type: "SphereParticleEmitter",
  radius: 50,
  radiusRange: 1,
  directionRandomizer: 0.704,
 },
 textureName:
  "data:image/png;base64,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",
 invertY: true,
 animations: [],
 beginAnimationOnStart: false,
 beginAnimationFrom: 0,
 beginAnimationTo: 60,
 beginAnimationLoop: false,
 startDelay: 0,
 renderingGroupId: 0,

 minAngularSpeed: -0.5,
 maxAngularSpeed: 0.5,
 minSize: 0.3,
 maxSize: 0.8,
 minScaleX: 1,
 maxScaleX: 1,
 minScaleY: 1,
 maxScaleY: 1,
 minEmitPower: 10,
 maxEmitPower: 20,
 minLifeTime: 1,
 maxLifeTime: 5,
 emitRate: 500,
 gravity: [0, 0, 0],
 noiseStrength: [10, 10, 10],
 color1: [.6, 0, .8, 0.8],
 color2: [.6, 0, .8, 0.8],
 colorDead: [.6, 0, .8, 0.8],
 updateSpeed: 0.01,
 targetStopDuration: 0,
 blendMode: 2,
 preWarmCycles: 0,
 preWarmStepOffset: 1,
 minInitialRotation: 0,
 maxInitialRotation: 0,
 startSpriteCellID: 0,
 endSpriteCellID: 0,
 spriteCellChangeSpeed: 1,
 spriteCellWidth: 0,
 spriteCellHeight: 0,
 spriteRandomStartCell: false,
 isAnimationSheetEnabled: false,
 textureMask: [1, 1, 1, 1],
 customShader: null,
 preventAutoStart: false,
};
