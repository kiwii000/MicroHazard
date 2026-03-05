export const GameConfig = {
  seed: 1337,
  tickRate: 60,
  chunkSize: 96,
  activeChunkRadius: 2,
  worldMaxAICount: 220,
  worldMaxPelletCount: 900,

  radiusScale: 1.9,
  playerStartMass: 34,
  aiMinMass: 12,
  aiMaxMass: 140,
  pelletMass: 1.2,
  minMass: 12,
  eatThreshold: 1.1,
  decayRatePerSecond: 0.0035,

  baseSpeed: 130,
  speedMassFactor: 0.06,
  baseTurnResponsiveness: 9,
  turnMassFactor: 0.016,
  accel: 8,

  playerPointerDeadZone: 6,
  playerPointerInfluenceRadius: 180,
  keyboardSpeedFactor: 1,

  currentNoiseScale: 0.0025,
  currentStrength: 18,

  biomeNoiseScale: 0.00075,
  feastThreshold: -0.3,
  predatorThreshold: 0.4,

  spawnSafeRadius: 220,
  spawnGraceSeconds: 6,

  biomeTuning: {
    feast: {
      pelletMin: 38,
      pelletMax: 56,
      aiMin: 2,
      aiMax: 5,
      aiMassBias: 0.25,
    },
    normal: {
      pelletMin: 24,
      pelletMax: 38,
      aiMin: 4,
      aiMax: 7,
      aiMassBias: 0.5,
    },
    predator: {
      pelletMin: 12,
      pelletMax: 22,
      aiMin: 6,
      aiMax: 10,
      aiMassBias: 0.85,
    },
  },

  aiWanderIntervalMin: 1.2,
  aiWanderIntervalMax: 3.4,
  aiDetectionBase: 130,
  aiDetectionMassFactor: 3,

  spatialHashCellSize: 80,
  cameraLerp: 0.13,
};

export type GameConfigType = typeof GameConfig;
