import { GameConfig } from '../core/GameConfig';
import { CurrentField } from '../world/CurrentField';
import { CellEntity } from './CellEntity';

export class MovementMotor {
  private readonly currentVec = { x: 0, y: 0 };

  update(cell: CellEntity, desiredX: number, desiredY: number, dt: number, currentField: CurrentField): void {
    const targetSpeed = GameConfig.baseSpeed / (1 + GameConfig.speedMassFactor * Math.sqrt(cell.mass));
    const turnRate = GameConfig.baseTurnResponsiveness / (1 + GameConfig.turnMassFactor * Math.sqrt(cell.mass));

    const targetVx = desiredX * targetSpeed;
    const targetVy = desiredY * targetSpeed;

    cell.vx += (targetVx - cell.vx) * Math.min(1, turnRate * dt * GameConfig.accel);
    cell.vy += (targetVy - cell.vy) * Math.min(1, turnRate * dt * GameConfig.accel);

    currentField.sample(cell.x, cell.y, this.currentVec);
    cell.x += (cell.vx + this.currentVec.x) * dt;
    cell.y += (cell.vy + this.currentVec.y) * dt;
  }
}
