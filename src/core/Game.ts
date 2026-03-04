import { AIController } from '../entities/AIController';
import { CellEntity } from '../entities/CellEntity';
import { ConsumptionSystem } from '../entities/ConsumptionSystem';
import { MovementMotor } from '../entities/MovementMotor';
import { PelletEntity } from '../entities/PelletEntity';
import { PlayerController } from '../entities/PlayerController';
import { InputRouter } from '../input/InputRouter';
import { Renderer } from '../render/Renderer';
import { GameOver } from '../ui/GameOver';
import { HUD } from '../ui/HUD';
import { ObjectPool } from '../utils/ObjectPool';
import { SpatialHash } from '../utils/SpatialHash';
import { Camera2D } from '../world/Camera2D';
import { ChunkManager } from '../world/ChunkManager';
import { ChunkGenerator } from '../world/ChunkGenerator';
import { CurrentField } from '../world/CurrentField';
import { GameConfig } from './GameConfig';
import { RNG } from './RNG';

export class Game {
  private readonly camera = new Camera2D();
  private readonly input: InputRouter;
  private readonly renderer: Renderer;
  private readonly hud: HUD;
  private readonly gameOver: GameOver;

  private readonly player = new CellEntity();
  private readonly aiCells: CellEntity[] = [];
  private readonly pellets: PelletEntity[] = [];

  private readonly aiPool = new ObjectPool(() => new CellEntity(), 160);
  private readonly pelletPool = new ObjectPool(() => new PelletEntity(), 1200);

  private readonly chunkManager: ChunkManager;
  private readonly currentField = new CurrentField(GameConfig.seed);
  private readonly movementMotor = new MovementMotor();
  private readonly playerController: PlayerController;
  private readonly aiController = new AIController();
  private readonly consumeSystem = new ConsumptionSystem();
  private readonly spatial = new SpatialHash(GameConfig.spatialHashCellSize);
  private readonly rng = new RNG(GameConfig.seed + 77);

  private accumulator = 0;
  private prevTime = 0;
  private alive = true;
  private timeAlive = 0;
  private decayAccumulator = 0;
  private readonly consumeCells: CellEntity[] = [];

  constructor(private readonly app: HTMLElement, private readonly canvas: HTMLCanvasElement) {
    this.renderer = new Renderer(canvas, this.camera);
    this.hud = new HUD(app);
    this.gameOver = new GameOver(app);
    this.input = new InputRouter(canvas, this.camera);
    this.playerController = new PlayerController(this.input);
    this.chunkManager = new ChunkManager(new ChunkGenerator(GameConfig.seed));

    this.gameOver.onRestart(() => this.restart());
  }

  start(): void {
    this.input.bind();
    this.restart();
    window.addEventListener('resize', () => this.renderer.resize());
    this.renderer.resize();
    this.prevTime = performance.now();
    requestAnimationFrame((t) => this.frame(t));
  }

  private restart(): void {
    for (let i = 0; i < this.aiCells.length; i++) this.aiPool.release(this.aiCells[i]);
    for (let i = 0; i < this.pellets.length; i++) this.pelletPool.release(this.pellets[i]);
    this.aiCells.length = 0;
    this.pellets.length = 0;
    this.chunkManager.reset();
    this.player.resetCell('player');
    this.player.color = '#61b4ff';
    this.player.x = 0;
    this.player.y = 0;
    this.player.setMass(GameConfig.playerStartMass);
    this.timeAlive = 0;
    this.decayAccumulator = 0;
    this.alive = true;
    this.gameOver.hide();
  }

  private frame(ts: number): void {
    const dt = Math.min(0.05, (ts - this.prevTime) / 1000);
    this.prevTime = ts;
    this.accumulator += dt;

    const step = 1 / GameConfig.tickRate;
    while (this.accumulator >= step) {
      this.update(step);
      this.accumulator -= step;
    }

    this.camera.update(this.player.x, this.player.y);
    this.renderer.render(this.player, this.aiCells, this.pellets);
    this.hud.update(this.player.mass, this.timeAlive, this.player.mass + this.timeAlive * 3);

    requestAnimationFrame((t) => this.frame(t));
  }

  private update(dt: number): void {
    if (!this.alive) {
      if (this.input.consumeRestart()) this.restart();
      return;
    }

    this.timeAlive += dt;
    this.chunkManager.update(this.player.x, this.player.y, this.pellets, this.aiCells, this.pelletPool, this.aiPool);

    const pDir = this.playerController.desiredDirection(this.player);
    this.movementMotor.update(this.player, pDir.x, pDir.y, dt, this.currentField);

    this.spatial.clear();
    this.spatial.insert(this.player);
    for (let i = 0; i < this.aiCells.length; i++) {
      const ai = this.aiCells[i];
      if (!ai.active) continue;
      const dir = this.aiController.update(ai, dt, this.spatial, this.rng);
      this.movementMotor.update(ai, dir.x, dir.y, dt, this.currentField);
      this.spatial.insert(ai);
    }
    for (let i = 0; i < this.pellets.length; i++) {
      if (this.pellets[i].active) this.spatial.insert(this.pellets[i]);
    }

    this.consumeCells.length = 0;
    this.consumeCells.push(this.player);
    for (let i = 0; i < this.aiCells.length; i++) this.consumeCells.push(this.aiCells[i]);

    this.consumeSystem.consume(
      this.consumeCells,
      this.spatial,
      (_consumer, target) => {
        if (!target.active) return;
        target.active = false;

        if (target.kind === 'player') {
          this.alive = false;
          this.gameOver.show(this.player.mass + this.timeAlive * 3);
          return;
        }

        const idx = this.aiCells.indexOf(target);
        if (idx >= 0) {
          this.aiPool.release(target);
          this.aiCells.splice(idx, 1);
        }
      },
      (_consumer, pellet) => {
        if (!pellet.active) return;
        pellet.active = false;
        const idx = this.pellets.indexOf(pellet);
        if (idx >= 0) {
          this.pelletPool.release(pellet);
          this.pellets.splice(idx, 1);
        }
      },
    );

    this.decayAccumulator += dt;
    while (this.decayAccumulator >= 1) {
      this.decayAccumulator -= 1;
      this.player.setMass(Math.max(GameConfig.minMass, this.player.mass * (1 - GameConfig.decayRatePerSecond)));
      for (let i = 0; i < this.aiCells.length; i++) {
        const ai = this.aiCells[i];
        ai.setMass(Math.max(GameConfig.minMass, ai.mass * (1 - GameConfig.decayRatePerSecond)));
      }
    }

    if (this.input.consumeRestart()) this.restart();
  }
}
