# Slime Spawner Documentation

## Overview

The SlimeSpawner system manages the creation and tracking of slimes in the ecosystem simulation. It handles both the initial population generation and the continuous spawning of new slimes over time. The system is designed to be configurable and optimized for handling large numbers of slimes.

## Implementation Details

The SlimeSpawner is implemented in `src/genetics/slime-spawner.ts` and integrated with the game level in `src/level.ts`. The system uses the existing DNA/genetics system (SIM-001) to create diverse slimes with varied traits.

### Key Components

1. **SlimeSpawner Class**: Main class responsible for spawning and tracking slimes
2. **SpawnConfig Interface**: Configuration options for customizing spawning behavior
3. **Visual Feedback**: Growth animation for newly spawned slimes
4. **Population Management**: Tracking and limiting the total population

## Configuration Parameters

The spawning system can be configured through the `SpawnConfig` interface with the following parameters:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `initialPopulation` | number | 20 | Number of slimes to create when the simulation starts |
| `spawnRate` | number | 0.2 | Rate at which new slimes spawn (slimes per second) |
| `maxPopulation` | number | 100 | Maximum number of slimes allowed in the simulation |
| `spawnAreaPadding` | number | 0.1 | Percentage of screen edges to avoid when spawning (0-0.5) |

Example configuration:
```typescript
const config: SpawnConfig = {
  initialPopulation: 30,   // Start with 30 slimes
  spawnRate: 0.5,          // Spawn 1 slime every 2 seconds
  maxPopulation: 150,      // Allow up to 150 slimes
  spawnAreaPadding: 0.15,  // Keep slimes 15% away from screen edges
};

// Create spawner with custom config
const spawner = new SlimeSpawner(engine, config);
```

## Optimization Strategies

The SlimeSpawner includes several optimizations to handle large numbers of slimes:

1. **Bounded position finding**: Uses a maximum number of attempts when finding valid spawn positions
2. **Population limiting**: Only attempts to spawn new slimes when below the maximum population
3. **Time-based spawning**: Uses elapsed time rather than frame count for consistent spawn rates
4. **Efficient collection management**: Optimized methods for adding/removing slimes
5. **Batched UI updates**: Only updates UI elements when the population changes

## Usage

The SlimeSpawner is integrated with the level system and handles spawning automatically. The level's `onPostUpdate` method calls the spawner's update function to create new slimes at the configured rate.

To customize spawning behavior at runtime:
```typescript
// Update configuration parameters during runtime
spawner.updateConfig({
  spawnRate: 1.0,  // Increase spawn rate to 1 slime per second
});
```

## Future Enhancements

Potential future enhancements for the spawning system:
- Spawn "hot spots" or regions where slimes are more likely to appear
- Events that trigger mass spawning (for environmental features)
- Biome-specific spawning behavior
- Spawn conditions based on ecosystem balance 