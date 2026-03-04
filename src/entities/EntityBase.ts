import { GameConfig } from '../core/GameConfig';

let nextEntityId = 1;

export type EntityKind = 'player' | 'ai' | 'pellet';

export class EntityBase {
  id = nextEntityId++;
  active = false;
  kind: EntityKind = 'pellet';
  x = 0;
  y = 0;
  vx = 0;
  vy = 0;
  mass = 1;
  radius = 1;
  color = '#fff';

  reset(kind: EntityKind): void {
    this.active = true;
    this.kind = kind;
    this.vx = 0;
    this.vy = 0;
    this.mass = 1;
    this.radius = 1;
    this.color = '#fff';
  }

  setMass(mass: number): void {
    this.mass = Math.max(0.01, mass);
    this.radius = Math.sqrt(this.mass / Math.PI) * GameConfig.radiusScale;
  }
}
