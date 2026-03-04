import { Camera2D } from '../world/Camera2D';
import { KeyboardInput } from './KeyboardInput';
import { PointerInput } from './PointerInput';

export class InputRouter {
  private readonly pointer = new PointerInput();
  private readonly keyboard = new KeyboardInput();

  constructor(private readonly canvas: HTMLCanvasElement, private readonly camera: Camera2D) {}

  bind(): void {
    this.pointer.bind(this.canvas);
    this.keyboard.bind();
  }

  getPointerWorld(): { active: boolean; x: number; y: number } {
    const rect = this.canvas.getBoundingClientRect();
    const x = this.pointer.screenX - rect.left - rect.width * 0.5 + this.camera.x;
    const y = this.pointer.screenY - rect.top - rect.height * 0.5 + this.camera.y;
    return { active: this.pointer.active, x, y };
  }

  getKeyboardDirection(): { x: number; y: number } {
    return this.keyboard.getDirection();
  }

  consumeRestart(): boolean {
    return this.keyboard.consumeRestart();
  }
}
