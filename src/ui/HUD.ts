export class HUD {
  private readonly root: HTMLDivElement;

  constructor(parent: HTMLElement) {
    this.root = document.createElement('div');
    this.root.className = 'hud';
    parent.appendChild(this.root);
  }

  update(mass: number, timeAlive: number, score: number): void {
    this.root.innerHTML = `Mass: ${mass.toFixed(1)}<br/>Time: ${timeAlive.toFixed(1)}s<br/>Score: ${score.toFixed(0)}`;
  }
}
