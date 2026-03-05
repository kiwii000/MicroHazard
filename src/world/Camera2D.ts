import { GameConfig } from '../core/GameConfig';
import { lerp } from '../utils/MathUtil';

export class Camera2D {
  x = 0;
  y = 0;

  update(targetX: number, targetY: number): void {
    this.x = lerp(this.x, targetX, GameConfig.cameraLerp);
    this.y = lerp(this.y, targetY, GameConfig.cameraLerp);
  }
}
