import { GameConfig } from '../core/GameConfig';
import { InputRouter } from '../input/InputRouter';
import { normalize } from '../utils/MathUtil';
import { CellEntity } from './CellEntity';

export class PlayerController {
  constructor(private readonly input: InputRouter) {}

  desiredDirection(player: CellEntity): { x: number; y: number } {
    const pointer = this.input.getPointerWorld();
    if (pointer.active) {
      const dx = pointer.x - player.x;
      const dy = pointer.y - player.y;
      const dist = Math.hypot(dx, dy);
      if (dist > GameConfig.playerPointerDeadZone) {
        const n = normalize(dx, dy);
        const influence = Math.min(1, dist / GameConfig.playerPointerInfluenceRadius);
        return { x: n.x * influence, y: n.y * influence };
      }
    }
    return this.input.getKeyboardDirection();
  }
}
