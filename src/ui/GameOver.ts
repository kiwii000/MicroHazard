export class GameOver {
  private readonly root: HTMLDivElement;
  private readonly scoreEl: HTMLDivElement;
  private readonly btn: HTMLButtonElement;

  constructor(parent: HTMLElement) {
    this.root = document.createElement('div');
    this.root.className = 'game-over';
    this.root.innerHTML = `<div class="panel"><h2>Game Over</h2></div>`;
    const panel = this.root.firstElementChild as HTMLDivElement;
    this.scoreEl = document.createElement('div');
    this.scoreEl.style.marginBottom = '12px';
    panel.appendChild(this.scoreEl);
    this.btn = document.createElement('button');
    this.btn.textContent = 'Restart (R)';
    panel.appendChild(this.btn);
    parent.appendChild(this.root);
  }

  onRestart(cb: () => void): void {
    this.btn.addEventListener('click', cb);
  }

  show(score: number): void {
    this.scoreEl.textContent = `Final score: ${score.toFixed(0)}`;
    this.root.style.display = 'flex';
  }

  hide(): void {
    this.root.style.display = 'none';
  }
}
