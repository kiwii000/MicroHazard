import { GameConfig } from '../core/GameConfig';
import { chunkKey } from './ChunkCoord';
import { ChunkGenerator } from './ChunkGenerator';
import { CellEntity } from '../entities/CellEntity';
import { PelletEntity } from '../entities/PelletEntity';
import { ObjectPool } from '../utils/ObjectPool';

type ActiveChunk = {
  cx: number;
  cy: number;
  pelletIds: number[];
  aiIds: number[];
};

export class ChunkManager {
  private readonly active = new Map<string, ActiveChunk>();
  private readonly chunkStamp = new Set<string>();

  constructor(private readonly generator: ChunkGenerator) {}

  reset(): void {
    this.active.clear();
    this.chunkStamp.clear();
  }

  update(
    playerX: number,
    playerY: number,
    pellets: PelletEntity[],
    aiCells: CellEntity[],
    pelletPool: ObjectPool<PelletEntity>,
    aiPool: ObjectPool<CellEntity>,
  ): void {
    this.chunkStamp.clear();

    const ccx = Math.floor(playerX / GameConfig.chunkSize);
    const ccy = Math.floor(playerY / GameConfig.chunkSize);

    for (let y = ccy - GameConfig.activeChunkRadius; y <= ccy + GameConfig.activeChunkRadius; y++) {
      for (let x = ccx - GameConfig.activeChunkRadius; x <= ccx + GameConfig.activeChunkRadius; x++) {
        const key = chunkKey(x, y);
        this.chunkStamp.add(key);
        if (!this.active.has(key)) {
          this.activateChunk(x, y, key, pellets, aiCells, pelletPool, aiPool);
        }
      }
    }

    for (const [key, chunk] of this.active) {
      if (!this.chunkStamp.has(key)) {
        this.deactivateChunk(chunk, pellets, aiCells, pelletPool, aiPool);
        this.active.delete(key);
      }
    }
  }

  private activateChunk(
    cx: number,
    cy: number,
    key: string,
    pellets: PelletEntity[],
    aiCells: CellEntity[],
    pelletPool: ObjectPool<PelletEntity>,
    aiPool: ObjectPool<CellEntity>,
  ): void {
    const spawn = this.generator.generate(cx, cy);
    const chunk: ActiveChunk = { cx, cy, pelletIds: [], aiIds: [] };

    for (let i = 0; i < spawn.pellets.length && pellets.length < GameConfig.worldMaxPelletCount; i++) {
      const p = pelletPool.acquire();
      p.resetPellet();
      p.x = spawn.pellets[i].x;
      p.y = spawn.pellets[i].y;
      p.setMass(spawn.pellets[i].mass);
      p.color = '#f6f779';
      pellets.push(p);
      chunk.pelletIds.push(p.id);
    }

    for (let i = 0; i < spawn.ai.length && aiCells.length < GameConfig.worldMaxAICount; i++) {
      const a = aiPool.acquire();
      a.resetCell('ai');
      a.x = spawn.ai[i].x;
      a.y = spawn.ai[i].y;
      a.setMass(spawn.ai[i].mass);
      a.color = '#ff7aa0';
      aiCells.push(a);
      chunk.aiIds.push(a.id);
    }

    this.active.set(key, chunk);
  }

  private deactivateChunk(
    chunk: ActiveChunk,
    pellets: PelletEntity[],
    aiCells: CellEntity[],
    pelletPool: ObjectPool<PelletEntity>,
    aiPool: ObjectPool<CellEntity>,
  ): void {
    for (let i = pellets.length - 1; i >= 0; i--) {
      if (chunk.pelletIds.includes(pellets[i].id)) {
        pellets[i].active = false;
        pelletPool.release(pellets[i]);
        pellets.splice(i, 1);
      }
    }
    for (let i = aiCells.length - 1; i >= 0; i--) {
      if (chunk.aiIds.includes(aiCells[i].id)) {
        aiCells[i].active = false;
        aiPool.release(aiCells[i]);
        aiCells.splice(i, 1);
      }
    }
  }
}
