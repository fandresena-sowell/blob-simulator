# SIM-006: Implement Basic Slime AI

## Reference Files
The following files should be referenced when working on this task:
- ai/TODO.md (For understanding project context and dependencies)
- src/actors/slime.ts (Existing slime implementation)
- ai/tasks/SIM-003-food-resources.md (Food seeking behavior)
- ai/tasks/SIM-004-energy-system.md (Energy drives behavior)
- ai/tasks/SIM-005-slime-reproduction.md (Reproduction behavior)

## Overview
Implement basic artificial intelligence for slimes to allow them to seek food, avoid hazards, and make decisions based on their current state and environment. This will make the simulation more dynamic and realistic.

## Requirements
- Create a behavior system that drives slime movement and actions
- Implement food-seeking behavior based on energy levels
- Add simple decision-making based on slime state and surroundings
- Create a way for slimes to detect and navigate towards resources
- Make AI behavior influenced by slime genetics

## Init
- [ ] Read existing documentation and acknowledge the project
- [ ] Review the slime energy system and food resources implementations

## Implementation Steps
- [ ] Create a `SlimeAI` component or system to manage behavior
- [ ] Implement a basic state machine with states like "idle", "seeking food", "fleeing", etc.
- [ ] Add sensors for detecting food, other slimes, and hazards in vicinity
- [ ] Implement pathfinding or simple movement towards detected resources
- [ ] Create a decision-making system based on current energy levels and surroundings
- [ ] Add wandering behavior when no immediate goals are present
- [ ] Implement flee behavior from potential threats
- [ ] Make AI use the reproduction system when conditions are right
- [ ] Add genetic traits that influence AI decision making (boldness, curiosity, etc.)
- [ ] Implement memory of food locations (optional)
- [ ] Add group behavior where applicable (optional flocking)

## Success Criteria
- Slimes autonomously seek food when energy is low
- Slimes make decisions appropriate to their current state
- Movement patterns appear natural and purposeful
- AI behavior varies between slimes based on their genetics
- Slimes can navigate around simple obstacles to reach goals

## Dependencies
- SIM-001: Slime DNA/Genetics System (for AI behavior traits)
- SIM-003: Food Resources (for seeking behavior)
- SIM-004: Energy System (drives behavior priorities)
- SIM-005: Slime Reproduction (for reproduction behavior)

## Notes
- Balance between deterministic and random behavior to create interesting patterns
- Consider implementing varying levels of intelligence as a genetic trait
- AI shouldn't be too perfect - some inefficiency creates more interesting behavior
- Consider implementing emergent social behaviors between slimes

## Post-process
- [ ] Update project documentation to reflect the changes made
- [ ] Document the AI system and behavior parameters

## Verification Checklist
- [ ] All implementation steps completed
- [ ] All success criteria met
- [ ] AI system thoroughly tested in various scenarios
- [ ] Task fully addresses all requirements
- [ ] No regression in existing functionality
- [ ] Implementation thoroughly tested
- [ ] Documentation updated as needed

## Final Steps
- [ ] Mark the task as completed in TODO.md
- [ ] Commit the changes with a conventional commit message format 