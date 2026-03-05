# MicroHazard Base

A clean single-player agar-like browser base built with Vite + TypeScript + Canvas2D.

## Run

```bash
npm install
npm run dev
```

## Core loop

- Control your cell with pointer drag (or WASD/arrow fallback).
- Eat pellets and smaller **biohazard** cells to gain mass.
- Avoid larger biohazards.
- Infinite deterministic chunked world with seeded generation.

## What this base includes

- Deterministic procedural chunk generation (`ChunkGenerator`, `ChunkManager`)
- Biomes that influence pellet and biohazard density
- Current field drift affecting all cells
- Shared movement motor for player + AI hazards
- Consumption rules + mass decay
- Object pooling and spatial hash for performance

## Tuning

Use `src/core/GameConfig.ts` to tune movement, growth, chunking, biome balance, spawn safety, and AI.
