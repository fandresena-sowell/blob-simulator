# Energy System Documentation

## Overview

The Energy System is a core component of the Slime Ecosystem Simulator that drives slime behavior and creates natural selection pressure. Slimes need energy to survive and perform actions, and they must consume food to replenish their energy. This document outlines the key components, parameters, and behaviors of the energy system.

## Core Components

### Energy Properties

Each slime has the following energy-related properties:

- **Current Energy**: The slime's current energy level (0-100)
- **Maximum Energy**: The maximum amount of energy a slime can store (default: 100)
- **Energy Decrease Rate**: The base rate at which energy depletes over time (0.005 per ms)
- **Energy Efficiency**: A genetic trait that affects how efficiently a slime converts food to energy (range: 0.5-1.5)
- **Starting Energy**: New slimes start with 50 energy (half their maximum)

### Hunger States

Slimes have three hunger states based on their current energy level:

1. **Satisfied** (>30% energy): Normal behavior with occasional rest periods
2. **Hungry** (15-30% energy): More active movement with less rest
3. **Starving** (<15% energy): Constant movement with rapid direction changes

The thresholds for these states can be configured through the `lowEnergyThreshold` (0.3) and `starvingThreshold` (0.15) parameters.

### Visual Indicators

The energy system includes visual indicators to show a slime's energy status:

- **Energy Bar**: Displayed above each slime, showing current energy level
- **Color Coding**: Energy bar changes from green to amber to red as energy decreases:
  - Green: Satisfied (>30% energy)
  - Amber/Yellow: Hungry (15-30% energy)
  - Red: Starving (<15% energy)

The energy bar is consistent in size regardless of the slime's physical size, making it easy to compare energy levels between different slimes at a glance.

## Energy Mechanics

### Energy Consumption

Slimes consume energy in several ways:

1. **Passive Consumption**: Energy decreases over time at a base rate (0.005 per ms)
2. **Movement**: Moving consumes additional energy based on speed trait
3. **Sprint Mode**: Sprinting consumes 2.5x more energy than normal movement

The formula for energy consumption during movement is:

```
energy_cost = base_rate * elapsed_time * speed_multiplier * [sprint_factor]
```

For example:
- A stationary slime with base energy decrease rate of 0.005 will lose 0.3 energy per second (0.005 * 1000ms * 0.06)
- A moving slime with speed multiplier 1.0 will lose an additional 0.25 energy per second (0.005 * 1000ms * 1.0 * 0.5)
- If sprinting, the same slime would lose 0.625 energy per second (0.005 * 1000ms * 1.0 * 0.5 * 2.5)

### Energy Gain

Slimes gain energy by consuming food:

1. **Food Types**: Different food types provide varying amounts of energy:
   - Basic Food (Green): 10 energy
   - Premium Food (Amber): 25 energy
   - Special Food (Purple): 50 energy

2. **Energy Efficiency**: The slime's energy efficiency trait (0.5-1.5) determines how much of the food's nutritional value is converted to energy:

```
energy_gain = food_nutritional_value * energy_efficiency
```

Examples:
- A slime with low efficiency (0.5) eating basic food gains 5 energy (10 * 0.5)
- A slime with high efficiency (1.5) eating basic food gains 15 energy (10 * 1.5)
- A slime with average efficiency (1.0) eating special food gains 50 energy (50 * 1.0)

### Death Mechanism

When a slime's energy reaches zero, it dies. The death process:
1. Sets the slime's `isDead` flag to true
2. Stops all movement
3. Fades out the slime visually over 1 second
4. Removes the slime from the scene
5. Notifies the SlimeManager via callback to update population counts

## Behavioral Impact

The energy system creates the following behavioral effects:

### Movement Patterns

- **Satisfied Slimes**: 80% chance to move, 20% chance to rest
- **Hungry Slimes**: 95% chance to move, 5% chance to rest
- **Starving Slimes**: Always moving, never resting

This creates a natural behavior where hungry slimes move more, increasing their chances of finding food but also accelerating their energy consumption, creating a realistic tension.

### Direction Changes

- **Satisfied Slimes**: Change direction every 1-5 seconds
- **Hungry Slimes**: Change direction every 0.8-3 seconds
- **Starving Slimes**: Change direction every 0.5-2 seconds

Hungry and starving slimes change direction more frequently, simulating more frantic searching behavior.

### Sprint Mode

- Slimes can sprint by pressing the Space key (affects all slimes)
- Sprinting increases speed by 1.5x but consumes 2.5x more energy
- Slimes cannot sprint if they have less than 20% energy
- Sprint mode is toggled on/off with each space bar press

## Natural Selection Pressure and Balance

The energy system creates natural selection pressure through several balanced trade-offs:

1. **Energy Efficiency vs. Other Traits**: Slimes must balance energy efficiency with other traits like speed and size
2. **Speed vs. Energy Consumption**: Faster slimes find food quicker but burn energy faster
3. **Movement vs. Rest**: Moving increases the chance of finding food but consumes more energy
4. **Hunger-driven Behavior**: Increased activity when hungry creates a realistic survival behavior pattern

### Balancing Considerations

The current balance settings are based on testing with the following observations:

- **Average Slime Lifespan**: ~2-3 minutes without finding food
- **Food Frequency**: The default FoodManager settings spawn enough food to support about 70% of the maximum slime population
- **Energy Efficiency Impact**: Slimes with high energy efficiency (1.5) live approximately twice as long as those with low efficiency (0.5)
- **Speed Trade-off**: The energy cost of speed is balanced so fast slimes don't automatically outperform slower ones

This creates a sustainable ecosystem where both energy-efficient and fast slimes have different but viable survival strategies.

## Configuration Parameters

The energy system can be adjusted through the following parameters:

| Parameter | Default | Description | Impact of Adjusting |
|-----------|---------|-------------|-------------------|
| `maxEnergy` | 100 | Maximum energy a slime can store | Higher values create more buffer, lower values make survival more challenging |
| `energyDecreaseRate` | 0.005 | Base rate of energy depletion per ms | Higher values increase overall difficulty, lower values make survival easier |
| `lowEnergyThreshold` | 0.3 | Energy ratio below which slime is considered hungry | Affects how soon slimes change behavior when energy depletes |
| `starvingThreshold` | 0.15 | Energy ratio below which slime is considered starving | Determines when most aggressive food-seeking behavior kicks in |
| `sprintSpeedMultiplier` | 1.5 | Speed increase factor when sprinting | Affects sprint usefulness for catching food |
| `sprintEnergyMultiplier` | 2.5 | Energy consumption multiplier when sprinting | Balances the risk/reward of sprinting |

### Performance Optimization

The energy system has been optimized for performance:
- Energy calculations use simple multiplication rather than complex formulas
- Visual energy bar updates only when necessary
- Consistent energy bar size for all slimes simplifies drawing and improves readability

## Integration with Other Systems

The energy system integrates with:

1. **DNA System**: Energy efficiency is a genetic trait passed down during reproduction
2. **Food System**: Slimes gain energy by consuming food resources
3. **Movement System**: Energy consumption is tied to movement speed and actions
4. **UI System**: Energy status is displayed visually above slimes
5. **SlimeManager**: Death notifications help manage population counts

## Testing and Verification

The energy system has been tested through:

1. **Functional Testing**: Verification that all mechanics work as expected
2. **Balance Testing**: Ensuring the ecosystem maintains a sustainable population
3. **Visual Testing**: Confirming energy indicators are clear and consistent
4. **Edge Cases**: Testing behavior at energy extremes (full, empty)

## Future Enhancements

Potential future enhancements to the energy system:

1. **Food Seeking Behavior**: Slimes actively seek food when hungry
2. **Energy Storage Trait**: Separate genetic trait for maximum energy capacity
3. **Environmental Effects**: Terrain types that affect energy consumption rates
4. **Hibernation**: Very low energy state that minimizes energy consumption
5. **Energy-based Reproduction**: Reproduction only possible above certain energy threshold 