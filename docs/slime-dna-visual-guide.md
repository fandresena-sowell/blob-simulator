# Slime DNA Visual Guide

This document serves as a reference for visually identifying slime traits based on their appearance.

## Visual Trait Indicators

### Color
- The slime's color is directly determined by its color gene
- The gene value (0-1) is mapped to the HSL color wheel:
  - 0.0: Red (0° hue)
  - 0.33: Green (120° hue)
  - 0.66: Blue (240° hue)
  - 1.0: Red again (360° hue)
- All slimes have full saturation for vibrant colors

### Size
- The slime's physical size directly reflects its size gene
- Size ranges from 0.5 (half normal size) to 2.0 (double normal size)
- Larger slimes are more noticeable but may move more slowly

### Speed
- Not directly visible, but observable through movement
- Can be tested by activating slime movement
- Speed ranges from 0.1 (very slow) to 1.5 (very fast)
- The test harness includes moving slimes to demonstrate speed differences

### Energy Efficiency
- Not directly visible in appearance
- Affects how quickly slimes consume energy
- Will be more apparent when energy system is implemented
- Ranges from 0.5 (inefficient) to 1.5 (highly efficient)

### Sense Radius
- Not directly visible but will affect behavior
- Determines how far a slime can detect objects around it
- Ranges from 50 (short range) to 200 (long range)
- Will be more apparent when AI behaviors are implemented

## Testing Tool Usage

To use the DNA testing tool:

1. Launch the game
2. Press 'T' key to toggle the test harness
3. Observe the different slimes with varied traits
4. Press 'T' again to return to normal gameplay

The test harness provides examples of slimes with min/max values for each trait to help understand the visual differences.

## Visual Verification Process

When testing the DNA system, verify the following:

1. **Color Variation**: Slimes should display a wide range of colors based on their DNA
2. **Size Variation**: Slimes should visibly differ in size according to their size gene
3. **Movement Speed**: When moving, slimes should travel at different speeds
4. **Initial Population**: The level should generate slimes with randomized traits
5. **Trait Consistency**: A slime's traits should remain consistent throughout its lifetime

## Screenshots

When running the simulation, take screenshots of:

1. A group of randomly generated slimes showing trait variety
2. The test harness displaying slimes with specific trait values
3. Side-by-side comparison of slimes with extreme trait values (min vs max)

These screenshots can be saved in the `docs/images/` directory for reference.

## Future Testing

As new features are added:
- Update this guide with any new traits
- Add sections for testing trait inheritance and mutation
- Document how traits affect new behaviors 