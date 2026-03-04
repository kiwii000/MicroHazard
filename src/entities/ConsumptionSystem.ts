import { GameConfig } from '../core/GameConfig';
import { SpatialHash } from '../utils/SpatialHash';
import { CellEntity } from './CellEntity';
import { EntityBase } from './EntityBase';
import { PelletEntity } from './PelletEntity';

export class ConsumptionSystem {
  private readonly nearby: EntityBase[] = [];

  consume(
    cells: CellEntity[],
    spatial: SpatialHash,
    onCellConsumed: (consumer: CellEntity, target: CellEntity) => void,
    onPelletConsumed: (consumer: CellEntity, pellet: PelletEntity) => void,
  ): void {
    for (let i = 0; i < cells.length; i++) {
      const eater = cells[i];
      if (!eater.active) continue;
      spatial.queryCircle(eater.x, eater.y, eater.radius + 10, this.nearby);
      for (let n = 0; n < this.nearby.length; n++) {
        const target = this.nearby[n];
        if (!target.active || target.id === eater.id) continue;
        const dx = target.x - eater.x;
        const dy = target.y - eater.y;
        const overlapDist = eater.radius + target.radius;
        if (dx * dx + dy * dy > overlapDist * overlapDist) continue;

        if (target.kind === 'pellet') {
          const pellet = target as PelletEntity;
          eater.setMass(eater.mass + pellet.mass);
          onPelletConsumed(eater, pellet);
          continue;
        }

        const cellTarget = target as CellEntity;
        if (eater.radius >= cellTarget.radius * GameConfig.eatThreshold) {
          eater.setMass(eater.mass + cellTarget.mass);
          onCellConsumed(eater, cellTarget);
        }
      }
    }
  }
}
