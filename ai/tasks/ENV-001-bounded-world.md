# ENV-001: Create a Bounded World with Borders

## Reference Files
The following files should be referenced when working on this task:
- ai/TODO.md (For understanding project context and dependencies)
- src/level.ts (Level implementation to be modified)
- src/main.ts (Game configuration)
- src/actors/slime.ts (Slime implementation that will interact with borders)

## Overview
Create a bounded world with clear borders that prevent slimes from moving outside the simulation area. This will define the ecosystem boundaries and create a contained environment for the simulation.

## Requirements
- Implement visible world borders that prevent slimes from leaving the area
- Make borders visually distinct from the main environment
- Allow configuring the world size
- Ensure proper collision between slimes and borders
- Add optional visual effects for border collisions

## Init
- [ ] Read existing documentation and acknowledge the project
- [ ] Understand the current level implementation and collision system

## Implementation Steps
- [ ] Define world boundaries based on configuration parameters
- [ ] Create border actors or collision shapes at the edges of the world
- [ ] Implement collision detection between slimes and borders
- [ ] Add visual representation of the borders (walls, fences, or other visual indicators)
- [ ] Ensure slimes properly bounce off or stop at world boundaries
- [ ] Add optional particle effects when slimes collide with borders
- [ ] Implement configurable world size parameters
- [ ] Create a WorldBounds utility class to handle border-related calculations
- [ ] Add minimap or world size indicators (optional)
- [ ] Implement camera constraints to keep view within bounds

## Success Criteria
- World has clear, visible boundaries
- Slimes cannot move beyond the boundaries
- Boundaries are aesthetically consistent with the overall design
- World size can be configured through parameters
- Collision with boundaries feels natural and responsive

## Dependencies
- None (builds on existing level and actor implementation)

## Notes
- Consider making borders with a slight elasticity for naturalistic bounce effects
- World shape could be rectangular or potentially other shapes in the future
- Think about how the world size affects simulation performance and balance
- Consider implementing "wrapping" borders as an alternative option (slimes exit one side and enter from the opposite)

## Post-process
- [ ] Update project documentation to reflect the changes made
- [ ] Document world size parameters and border configuration options

## Verification Checklist
- [ ] All implementation steps completed
- [ ] All success criteria met
- [ ] Border system thoroughly tested with various slime velocities and angles
- [ ] Task fully addresses all requirements
- [ ] No regression in existing functionality
- [ ] Implementation thoroughly tested
- [ ] Documentation updated as needed

## Final Steps
- [ ] Mark the task as completed in TODO.md
- [ ] Commit the changes with a conventional commit message format 