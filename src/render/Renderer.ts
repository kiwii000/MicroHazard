import { Camera2D } from '../world/Camera2D';
import { CellEntity } from '../entities/CellEntity';
import { PelletEntity } from '../entities/PelletEntity';

export class Renderer {
  private readonly ctx: CanvasRenderingContext2D;

  constructor(private readonly canvas: HTMLCanvasElement, private readonly camera: Camera2D) {
    const ctx = this.canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D not available');
    this.ctx = ctx;
  }

  resize(): void {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = Math.floor(this.canvas.clientWidth * dpr);
    const h = Math.floor(this.canvas.clientHeight * dpr);
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
    }
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  render(player: CellEntity, aiCells: CellEntity[], pellets: PelletEntity[]): void {
    const ctx = this.ctx;
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#081019';
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.translate(w * 0.5 - this.camera.x, h * 0.5 - this.camera.y);

    this.drawGrid(ctx, this.camera.x, this.camera.y, w, h);

    for (let i = 0; i < pellets.length; i++) {
      const p = pellets[i];
      if (!p.active) continue;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    for (let i = 0; i < aiCells.length; i++) this.drawCell(aiCells[i]);
    this.drawCell(player);
    ctx.restore();
  }

  private drawCell(cell: CellEntity): void {
    if (!cell.active) return;
    const ctx = this.ctx;
    ctx.fillStyle = cell.color;
    ctx.strokeStyle = '#0a0a0a99';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cell.x, cell.y, cell.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  private drawGrid(ctx: CanvasRenderingContext2D, cx: number, cy: number, w: number, h: number): void {
    const grid = 96;
    const left = cx - w * 0.6;
    const right = cx + w * 0.6;
    const top = cy - h * 0.6;
    const bottom = cy + h * 0.6;

    ctx.strokeStyle = '#112033';
    ctx.lineWidth = 1;

    const startX = Math.floor(left / grid) * grid;
    const startY = Math.floor(top / grid) * grid;
    for (let x = startX; x <= right; x += grid) {
      ctx.beginPath();
      ctx.moveTo(x, top);
      ctx.lineTo(x, bottom);
      ctx.stroke();
    }
    for (let y = startY; y <= bottom; y += grid) {
      ctx.beginPath();
      ctx.moveTo(left, y);
      ctx.lineTo(right, y);
      ctx.stroke();
    }
  }
}
