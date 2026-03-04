import { EntityBase } from './EntityBase';

export class CellEntity extends EntityBase {
  aiTargetX = 0;
  aiTargetY = 0;
  aiDecisionTimer = 0;

  resetCell(kind: 'player' | 'ai'): void {
    this.reset(kind);
    this.aiTargetX = this.x;
    this.aiTargetY = this.y;
    this.aiDecisionTimer = 0;
  }
}
