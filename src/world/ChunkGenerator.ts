import { GameConfig } from '../core/GameConfig';
import { RNG } from '../core/RNG';
import { BiomeType } from './BiomeType';
import { valueNoise2D } from './Noise';

export type ChunkSpawnData = {
  biome: BiomeType;
  pellets: Array<{ x: number; y: number; mass: number }>;
  ai: Array<{ x: number; y: number; mass: number }>;
};

export class ChunkGenerator {
  constructor(private readonly seed: number) {}

  biomeAtChunk(cx: number, cy: number): BiomeType {
    const n = valueNoise2D(this.seed + 321, cx * GameConfig.biomeNoiseScale, cy * GameConfig.biomeNoiseScale);
    if (n <= GameConfig.feastThreshold) return 'feast';
    if (n >= GameConfig.predatorThreshold) return 'predator';
    return 'normal';
  }

  generate(cx: number, cy: number): ChunkSpawnData {
    const biome = this.biomeAtChunk(cx, cy);
    const tune = GameConfig.biomeTuning[biome];
    const rng = new RNG(RNG.hash(this.seed, cx, cy));

    const pellets: ChunkSpawnData['pellets'] = [];
    const ai: ChunkSpawnData['ai'] = [];

    const pelletCount = rng.int(tune.pelletMin, tune.pelletMax);
    const aiCount = rng.int(tune.aiMin, tune.aiMax);

    const ox = cx * GameConfig.chunkSize;
    const oy = cy * GameConfig.chunkSize;

    for (let i = 0; i < pelletCount; i++) {
      pellets.push({
        x: ox + rng.range(0, GameConfig.chunkSize),
        y: oy + rng.range(0, GameConfig.chunkSize),
        mass: GameConfig.pelletMass,
      });
    }

    for (let i = 0; i < aiCount; i++) {
      const t = Math.min(1, Math.max(0, (rng.next() + tune.aiMassBias) * 0.5));
      const mass = GameConfig.aiMinMass + (GameConfig.aiMaxMass - GameConfig.aiMinMass) * t;
      ai.push({
        x: ox + rng.range(0, GameConfig.chunkSize),
        y: oy + rng.range(0, GameConfig.chunkSize),
        mass,
      });
    }

    return { biome, pellets, ai };
  }
}
