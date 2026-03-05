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

  render(player: CellEntity, aiCells: CellEntity[], pellets: PelletEntity[], elapsed: number, spawnGraceLeft: number): void {
    const ctx = this.ctx;
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;

    const gradient = ctx.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0, '#0f1f2f');
    gradient.addColorStop(1, '#06101b');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.translate(w * 0.5 - this.camera.x, h * 0.5 - this.camera.y);

    this.drawGrid(ctx, this.camera.x, this.camera.y, w, h);

    const twinkle = 0.75 + Math.sin(elapsed * 3) * 0.2;
    for (let i = 0; i < pellets.length; i++) {
      const p = pellets[i];
      if (!p.active) continue;
      ctx.fillStyle = 'rgba(255, 210, 90, 0.24)';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius * 2.4 * twinkle, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    for (let i = 0; i < aiCells.length; i++) {
      const ai = aiCells[i];
      ai.color = ai.mass <= player.mass ? '#5dd39e' : '#f26d85';
      this.drawCell(ai);
    }
    this.drawCell(player);

    if (spawnGraceLeft > 0) {
      const pulse = 1 + Math.sin(elapsed * 8) * 0.04;
      ctx.strokeStyle = 'rgba(120, 190, 255, 0.8)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(player.x, player.y, player.radius * 1.5 * pulse, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  }

  private drawCell(cell: CellEntity): void {
    if (!cell.active) return;
    const ctx = this.ctx;
    ctx.fillStyle = cell.color;
    ctx.strokeStyle = '#041018aa';
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

    ctx.strokeStyle = '#173049';
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
