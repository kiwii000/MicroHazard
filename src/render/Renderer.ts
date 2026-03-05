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

  render(player: CellEntity, hazards: CellEntity[], pellets: PelletEntity[], elapsed: number, spawnGraceLeft: number): void {
    const ctx = this.ctx;
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;

    ctx.fillStyle = '#050b12';
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.translate(w * 0.5 - this.camera.x, h * 0.5 - this.camera.y);

    this.drawGrid(ctx, this.camera.x, this.camera.y, w, h);

    const twinkle = 0.88 + Math.sin(elapsed * 2.5) * 0.12;
    for (let i = 0; i < pellets.length; i++) {
      const p = pellets[i];
      if (!p.active) continue;
      ctx.fillStyle = '#ffd56b66';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius * 2.1 * twinkle, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffe694';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    for (let i = 0; i < hazards.length; i++) {
      const hazard = hazards[i];
      hazard.color = hazard.mass <= player.mass ? '#36c88f' : '#ef5f77';
      this.drawCell(hazard);
    }

    player.color = '#61b4ff';
    this.drawCell(player);

    if (spawnGraceLeft > 0) {
      const pulse = 1 + Math.sin(elapsed * 7) * 0.06;
      ctx.strokeStyle = '#79c5ffaa';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(player.x, player.y, player.radius * 1.65 * pulse, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  }

  private drawCell(cell: CellEntity): void {
    if (!cell.active) return;
    const ctx = this.ctx;
    ctx.fillStyle = cell.color;
    ctx.strokeStyle = '#061421';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cell.x, cell.y, cell.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  private drawGrid(ctx: CanvasRenderingContext2D, cx: number, cy: number, w: number, h: number): void {
    const grid = 96;
    const left = cx - w * 0.65;
    const right = cx + w * 0.65;
    const top = cy - h * 0.65;
    const bottom = cy + h * 0.65;

    ctx.strokeStyle = '#102233';
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
