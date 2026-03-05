import { normalize } from '../utils/MathUtil';

export class KeyboardInput {
  private readonly keys = new Set<string>();

  bind(): void {
    window.addEventListener('keydown', (e) => this.keys.add(e.key.toLowerCase()));
    window.addEventListener('keyup', (e) => this.keys.delete(e.key.toLowerCase()));
  }

  getDirection(): { x: number; y: number } {
    const up = this.keys.has('w') || this.keys.has('arrowup');
    const down = this.keys.has('s') || this.keys.has('arrowdown');
    const left = this.keys.has('a') || this.keys.has('arrowleft');
    const right = this.keys.has('d') || this.keys.has('arrowright');
    return normalize((right ? 1 : 0) - (left ? 1 : 0), (down ? 1 : 0) - (up ? 1 : 0));
  }

  consumeRestart(): boolean {
    if (this.keys.has('r')) {
      this.keys.delete('r');
      return true;
    }
    return false;
  }
}
