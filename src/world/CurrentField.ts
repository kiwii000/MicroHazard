import { GameConfig } from '../core/GameConfig';
import { valueNoise2D } from './Noise';

export class CurrentField {
  constructor(private readonly seed: number) {}

  sample(x: number, y: number, out: { x: number; y: number }): void {
    const n = valueNoise2D(this.seed + 901, x * GameConfig.currentNoiseScale, y * GameConfig.currentNoiseScale);
    const angle = n * Math.PI * 2;
    out.x = Math.cos(angle) * GameConfig.currentStrength;
    out.y = Math.sin(angle) * GameConfig.currentStrength;
  }
}
