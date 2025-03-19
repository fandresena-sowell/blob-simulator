# SIM-003: Create Food Resources

## Reference Files
The following files should be referenced when working on this task:
- ai/TODO.md (For understanding project context and dependencies)
- src/actors/slime.ts (Existing slime implementation)
- src/level.ts (Level where food will be added)
- src/resources.ts (Resource management)

## Overview
Implement food resources that slimes can consume to gain energy. These resources will be the foundation of the ecosystem's energy cycle and drive slime behavior and evolution.

## Requirements
- Create a Food actor class that slimes can interact with
- Implement random food generation throughout the environment
- Implement random movement for each spawned slime
- Add collision detection between slimes and food
- Make food visually distinct and easily identifiable
- Create a food regeneration/respawn system

## Init
- [x] Read existing documentation and acknowledge the project
- [x] Understand the current slime implementation and collision system

## Implementation Steps
- [x] Create a `Food` class that extends Actor
- [x] Implement food appearance (sprite or simple shape with appropriate color)
- [x] Add random movement for each slime actor
- [x] Add collision detection with the slime actor
- [x] Implement a method for slimes to consume food (to be called on collision)
- [x] Add food nutritional value property (energy contained)
- [x] Create a FoodManager class to handle food spawning and lifecycle
- [x] Implement random food distribution across the level
- [x] Add food respawn mechanism with configurable rate
- [x] Create different food types with varying nutritional values (optional)
- [x] Add visual effects for food consumption
- [ ] Implement food growth/decay over time (optional)

## Success Criteria
- Food resources spawn randomly throughout the environment
- Slimes moves randomly inside the environment bound
- Slimes can collide with and consume food
- Food respawns at a configurable rate
- Food is visually distinct and easily identifiable
- System can handle many food items without performance issues

## Dependencies
- None (but will be used by SIM-004: Energy System)

## Notes
- Consider different food types with varying energy values or special properties
- Food distribution might be influenced by environmental factors in future tasks
- Think about food density and respawn rate for ecosystem balance
- Consider implementing food that grows over time or spreads to nearby areas

## Post-process
- [x] Update project documentation to reflect the changes made
- [x] Document the food system design and parameters

## Verification Checklist
- [x] All implementation steps completed
- [x] All success criteria met
- [x] Food system thoroughly tested with various parameters
- [x] Task fully addresses all requirements
- [x] No regression in existing functionality
- [x] Implementation thoroughly tested
- [x] Documentation updated as needed

## Final Steps
- [x] Mark the task as completed in TODO.md
- [x] Commit the changes with a conventional commit message format 