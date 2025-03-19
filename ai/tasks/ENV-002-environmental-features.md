# ENV-002: Add Environmental Features

## Reference Files
The following files should be referenced when working on this task:
- ai/TODO.md (For understanding project context and dependencies)
- src/level.ts (Level implementation to be modified)
- ai/tasks/ENV-001-bounded-world.md (World bounds implementation)
- src/actors/slime.ts (Slime interaction with environment)

## Overview
Implement various environmental features such as obstacles, terrain types, and other elements that affect slime behavior and create a more complex and interesting ecosystem.

## Requirements
- Add different terrain types that affect slime movement and behavior
- Implement static obstacles that slimes must navigate around
- Create regions with different properties (food density, temperature, etc.)
- Make terrain visually distinct and easily identifiable
- Ensure proper interaction between slimes and environmental features

## Init
- [ ] Read existing documentation and acknowledge the project
- [ ] Understand the current level implementation and collision system

## Implementation Steps
- [ ] Create a base `TerrainType` class or enum to define different terrain properties
- [ ] Implement various terrain types (water, mud, grass, etc.) with different properties
- [ ] Add static obstacles (rocks, trees, etc.) that slimes must navigate around
- [ ] Create a visual representation system for different terrain types
- [ ] Implement collision detection between slimes and obstacles
- [ ] Add movement modifiers for different terrain types (slow in mud, fast on grass, etc.)
- [ ] Create a terrain generation system for random or designed environments
- [ ] Implement environmental regions with different properties (temperature, food density)
- [ ] Add particle effects or visual indicators for terrain interaction
- [ ] Create a configuration system for environmental parameters
- [ ] Implement terrain transitions and blending between different types

## Success Criteria
- Multiple terrain types with distinct visual appearances
- Static obstacles that slimes must navigate around
- Slime movement and behavior affected by terrain type
- Environmental features create interesting dynamics in the simulation
- System allows for both random and designed environments

## Dependencies
- ENV-001: Bounded World with Borders

## Notes
- Consider how terrain types will affect food generation and distribution
- Balance obstacle density to avoid creating isolated areas or impassable regions
- Think about how environmental features will interact with future weather and day/night systems
- Consider making some environmental features dynamic (growing plants, shifting terrain)

## Post-process
- [ ] Update project documentation to reflect the changes made
- [ ] Document the environmental features and their effects

## Verification Checklist
- [ ] All implementation steps completed
- [ ] All success criteria met
- [ ] Environmental features thoroughly tested with slime interaction
- [ ] Task fully addresses all requirements
- [ ] No regression in existing functionality
- [ ] Implementation thoroughly tested
- [ ] Documentation updated as needed

## Final Steps
- [ ] Mark the task as completed in TODO.md
- [ ] Commit the changes with a conventional commit message format 