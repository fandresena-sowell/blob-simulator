# Food System Documentation

## Overview

The Food System is a fundamental component of the Slime Ecosystem Simulator, providing the energy resources that drive slime behavior and evolution. This system implements:

- Food resources that slimes can consume to gain energy
- Different food types with varying nutritional values
- Random distribution of food throughout the environment
- Food regeneration and lifecycle management
- Collision detection between slimes and food

This document explains the design of the food system, its key components, configuration options, and integration with other parts of the simulation.

## Core Components

The Food System consists of two main components:

1. **Food Class (`src/actors/food.ts`)**: Represents individual food resources that slimes can consume
2. **FoodManager Class (`src/managers/food-manager.ts`)**: Handles spawning, distribution, and lifecycle management of food

## Food Class

### Design Overview

The `Food` class extends Excalibur's `Actor` class, representing consumable resources in the environment. Each food instance has:

- A visual representation (colored circle)
- A nutritional value (energy provided when consumed)
- A type (Basic, Premium, or Special)
- Collision detection functionality

### Food Types

The system implements three food types with different properties:

| Type | Visual | Nutritional Value | Size Range |
|------|--------|------------------|------------|
| Basic | Green | 10 | 5-8 |
| Premium | Amber | 25 | 8-11 |
| Special | Purple | 50 | 11-15 |

### Key Properties

- `nutritionalValue`: Amount of energy provided when consumed
- `type`: The food type (Basic, Premium, Special)
- `isBeingConsumed`: Flag to prevent multiple consumption

### Key Methods

- `consume()`: Called when a slime consumes the food, returns nutritional value
- `playConsumeEffect()`: Visual effect when food is consumed (shrinking animation)
- `setConsumedCallback(callback)`: Sets a callback for when food is consumed (used by FoodManager)

### Visual Representation

Food is represented by colored circles with size based on the food type:
- Basic: Green (smaller)
- Premium: Amber (medium)
- Special: Purple (larger)

## FoodManager Class

### Design Overview

The `FoodManager` class handles the spawning, distribution, and lifecycle of food resources. It maintains a pool of active food items and respawns them according to configurable parameters.

### Configuration Options

The `FoodConfig` interface provides the following configuration options:

| Parameter | Description | Default |
|-----------|-------------|---------|
| `initialCount` | Initial number of food items | 30 |
| `spawnRate` | Food items spawned per second | 0.5 |
| `maxCount` | Maximum number of food items at once | 50 |
| `spawnAreaPadding` | Percentage of screen edges to avoid (0-0.5) | 0.1 |
| `specialFoodChance` | Chance of spawning special food (0-1) | 0.05 |
| `premiumFoodChance` | Chance of spawning premium food (0-1) | 0.15 |

### Key Methods

- `initialize()`: Creates the initial food population
- `update(elapsedMs)`: Updates food, spawns new items based on elapsed time
- `registerFood(food)`: Registers a food item with the manager
- `removeFood(food)`: Removes a food item from the manager
- `updateConfig(config)`: Updates the manager's configuration

### Spawning Algorithm

Food is spawned at random positions within the game area, with constraints:
- Food cannot spawn too close to other food items (minimum distance of 20 pixels)
- Food spawns with a distribution of types based on configured chances
- Food respawns over time until the maximum count is reached

## Integration with Slimes

### Random Movement

Slimes now move randomly throughout the environment:
- 80% chance to be moving, 20% chance to be idle
- Random direction selection (Up, Down, Left, Right)
- Random duration between direction changes (1-5 seconds)
- Boundary checks to keep slimes within the game area

### Collision and Consumption

When a slime collides with food:
1. The collision is detected through Excalibur's collision system
2. The slime's `consumeFood(food)` method is called
3. The food's `consume()` method is called, marking it for removal
4. The food plays a consumption animation (shrinking effect)
5. The slime gains energy based on the food's nutritional value and the slime's energy efficiency
6. The food is removed from the manager and the scene

### Energy System

The food system is integrated with an energy system for slimes:
- Slimes consume energy over time, with movement costing additional energy
- Consuming food replenishes energy
- Energy efficiency is determined by the slime's DNA

## Level Integration

The `MyLevel` class manages the food system:
- Initializes the FoodManager with configuration
- Adds initial food to the scene
- Updates the food system during the game loop
- Displays a UI element showing the current food count

## Usage Examples

### Configuring the Food System

```typescript
// Custom food configuration
const foodConfig: FoodConfig = {
  initialCount: 40,
  spawnRate: 0.3,
  maxCount: 60,
  spawnAreaPadding: 0.1,
  specialFoodChance: 0.05,
  premiumFoodChance: 0.15
};

// Initialize food manager with custom config
this.foodManager = new FoodManager(engine, foodConfig);
```

### Spawning Custom Food

```typescript
// Create a premium food item
const premiumFood = new Food(FoodType.Premium);
premiumFood.pos = vec(100, 100);

// Register and add to scene
this.foodManager.registerFood(premiumFood);
this.add(premiumFood);
```

## Future Considerations

The current implementation provides a solid foundation, but several enhancements could be made:

- **Food Growth/Decay**: Implementing food that grows or decays over time
- **Environmental Influence**: Food distribution affected by environmental factors
- **Food Spread**: Food that can multiply or spread to nearby areas
- **Advanced Visual Effects**: More sophisticated visuals for different food types
- **Food Chains**: Complex food webs with interdependencies

## Performance Considerations

The food system is designed to handle numerous food items efficiently:
- Food uses simple circle graphics for optimal rendering
- Spatial checking is optimized to avoid unnecessary calculations
- Food items are pooled and reused when possible 