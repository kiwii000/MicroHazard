import { EntityBase } from './EntityBase';

export class PelletEntity extends EntityBase {
  resetPellet(): void {
    this.reset('pellet');
  }
}
