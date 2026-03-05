export class HUD {
  private readonly root: HTMLDivElement;

  constructor(parent: HTMLElement) {
    this.root = document.createElement('div');
    this.root.className = 'hud';
    parent.appendChild(this.root);
  }

  update(mass: number, timeAlive: number, score: number, grace: number): void {
    const graceText = grace > 0 ? `<br/>Spawn Shield: ${grace.toFixed(1)}s` : '';
    this.root.innerHTML = `Cell Mass: ${mass.toFixed(1)}<br/>Survival: ${timeAlive.toFixed(1)}s<br/>Score: ${score.toFixed(0)}${graceText}`;
  }
}
