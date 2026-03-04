# MicroHazard

MicroHazard is a browser-based, single-player agar-like prototype built with **Vite + TypeScript + Canvas2D**.

## Run

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Controls

- **Primary:** drag/touch pointer to steer toward pointer location.
- **Fallback:** `WASD` or arrow keys.
- **Restart:** `R` key or Game Over button.

## Gameplay

- Move, consume pellets and smaller AI cells, and avoid larger AI cells.
- Mass controls size and speed:
  - `radius = sqrt(mass / PI) * radiusScale`
  - `speed = baseSpeed / (1 + speedMassFactor * sqrt(mass))`
- Soft mass decay runs continuously, clamped to `minMass`.
- Infinite run via deterministic chunk generation.

## Tuning surface

All important knobs are in:

- `src/core/GameConfig.ts`

Tune chunking, biome spawn curves, movement, AI behavior, currents, decay, and collision thresholds there.

## Architecture / safe extension points

- `src/core/Game.ts`: orchestration and game loop.
- `src/world/ChunkManager.ts`: active chunk lifecycle and pooled spawning.
- `src/world/ChunkGenerator.ts`: deterministic seeded content generation.
- `src/world/CurrentField.ts`: deterministic world drift vector field.
- `src/entities/ConsumptionSystem.ts`: ownership of consume rules.
- `src/entities/MovementMotor.ts`: consistent physics for player + AI.

### Add new mechanics safely

Prefer plugging new systems into `Game.update` as independent modules:

1. Read state (entities/world/input).
2. Apply effects (mass, velocity, status flags).
3. Keep deterministic dependencies seeded (`RNG.hash` + chunk coords or run seed).

Examples: scent trails, ring shrink systems, hazards, blooms.
