export class PointerInput {
  active = false;
  screenX = 0;
  screenY = 0;

  bind(canvas: HTMLCanvasElement): void {
    const set = (x: number, y: number): void => {
      this.screenX = x;
      this.screenY = y;
      this.active = true;
    };

    canvas.addEventListener('pointerdown', (e) => {
      set(e.clientX, e.clientY);
      canvas.setPointerCapture(e.pointerId);
    });
    canvas.addEventListener('pointermove', (e) => {
      if (this.active) set(e.clientX, e.clientY);
    });
    canvas.addEventListener('pointerup', () => {
      this.active = false;
    });
    canvas.addEventListener('pointercancel', () => {
      this.active = false;
    });
  }
}
