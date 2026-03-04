import { GameConfig } from '../core/GameConfig';
import { RNG } from '../core/RNG';
import { SpatialHash } from '../utils/SpatialHash';
import { normalize } from '../utils/MathUtil';
import { CellEntity } from './CellEntity';
import { EntityBase } from './EntityBase';

export class AIController {
  private readonly nearby: EntityBase[] = [];

  update(ai: CellEntity, dt: number, spatialHash: SpatialHash, rng: RNG): { x: number; y: number } {
    const detectRadius = GameConfig.aiDetectionBase + Math.sqrt(ai.mass) * GameConfig.aiDetectionMassFactor;
    spatialHash.queryCircle(ai.x, ai.y, detectRadius, this.nearby);

    let threat: CellEntity | null = null;
    let prey: CellEntity | null = null;
    let threatDistSq = Number.POSITIVE_INFINITY;
    let preyDistSq = Number.POSITIVE_INFINITY;

    for (let i = 0; i < this.nearby.length; i++) {
      const e = this.nearby[i];
      if (!e.active || e.id === ai.id || e.kind === 'pellet') continue;
      const dx = e.x - ai.x;
      const dy = e.y - ai.y;
      const dsq = dx * dx + dy * dy;
      if (e.radius > ai.radius * GameConfig.eatThreshold && dsq < threatDistSq) {
        threat = e as CellEntity;
        threatDistSq = dsq;
      } else if (ai.radius > e.radius * GameConfig.eatThreshold && dsq < preyDistSq) {
        prey = e as CellEntity;
        preyDistSq = dsq;
      }
    }

    if (threat) {
      return normalize(ai.x - threat.x, ai.y - threat.y);
    }
    if (prey) {
      return normalize(prey.x - ai.x, prey.y - ai.y);
    }

    ai.aiDecisionTimer -= dt;
    if (ai.aiDecisionTimer <= 0) {
      ai.aiDecisionTimer = rng.range(GameConfig.aiWanderIntervalMin, GameConfig.aiWanderIntervalMax);
      ai.aiTargetX = ai.x + rng.range(-220, 220);
      ai.aiTargetY = ai.y + rng.range(-220, 220);
    }

    return normalize(ai.aiTargetX - ai.x, ai.aiTargetY - ai.y);
  }
}
