# Food System Manual Testing Guide

This document provides a structured approach for manually testing the food system implementation. These tests help verify that the implementation works correctly and meets all requirements.

## Setup

1. Run the simulation in development mode:
   ```
   npm run dev
   ```

2. Open the simulation in a browser at the URL shown in the console.

## Test Categories

### 1. Visual Verification

#### 1.1 Food Appearance
- [ ] Verify that Basic food appears as small green circles
- [ ] Verify that Premium food appears as medium amber circles
- [ ] Verify that Special food appears as large purple circles

#### 1.2 Distribution
- [ ] Verify that food is randomly distributed across the level
- [ ] Verify that food respects the spawnAreaPadding (not too close to edges)
- [ ] Verify that food items maintain minimum distance from each other

### 2. Food Lifecycle

#### 2.1 Spawning
- [ ] Verify that initial food count matches the configured value
- [ ] Verify that new food spawns at the configured rate
- [ ] Verify that the system respects the maximum food count

#### 2.2 Consumption
- [ ] Verify that food shows a shrinking animation when consumed
- [ ] Verify that consumed food is removed from the level
- [ ] Verify that new food spawns to replace consumed food

### 3. Slime Interaction

#### 3.1 Collision
- [ ] Verify that slimes detect collisions with food
- [ ] Verify that slimes consume food upon collision

#### 3.2 Energy System
- [ ] Verify that slimes gain energy when consuming food
- [ ] Verify that different food types provide different energy amounts

### 4. Random Movement

#### 4.1 Slime Movement
- [ ] Verify that slimes move randomly throughout the environment
- [ ] Verify that slimes change direction periodically
- [ ] Verify that slimes sometimes pause/idle
- [ ] Verify that slimes stay within the level boundaries

### 5. Performance Testing

#### 5.1 Basic Performance
- [ ] Verify that the system runs smoothly with default settings

#### 5.2 Stress Testing
- [ ] Modify config to increase food count (e.g., 100+ items)
- [ ] Modify config to increase slime count (e.g., 50+ slimes)
- [ ] Verify that the system maintains acceptable performance

### 6. Configuration Testing

#### 6.1 Food Configuration
- [ ] Modify spawnRate and verify changes in food spawning frequency
- [ ] Modify food type chances and verify distribution changes
- [ ] Modify initialCount and verify starting food count

## Test Scenarios

### Scenario 1: Default Configuration
1. Start the simulation with default settings
2. Observe slime movement and interaction with food
3. Verify that slimes gain energy when consuming food
4. Verify that food respawns over time

### Scenario 2: High Food Density
1. Modify configuration to increase initialCount and maxCount
2. Restart the simulation
3. Verify that the higher food density works correctly
4. Observe performance with higher food count

### Scenario 3: Custom Food Distribution
1. Modify configuration to increase premiumFoodChance and specialFoodChance
2. Restart the simulation
3. Verify that the food type distribution changes accordingly

## Regression Testing

### Slime Functionality
- [ ] Verify that existing slime movement and animation still work correctly
- [ ] Verify that slime DNA system functions properly

### Level Integration
- [ ] Verify that the level initializes and updates correctly
- [ ] Verify that population display still works

## Test Results

Document your test results, including:
- Any bugs or issues found
- Performance observations
- Suggestions for improvements

## Completion

Once all tests are complete, update the verification checklist in the SIM-003 task document. 