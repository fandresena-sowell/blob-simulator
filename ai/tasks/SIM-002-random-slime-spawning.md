# SIM-002: Add Random Slime Spawning Mechanism

## Reference Files
The following files should be referenced when working on this task:
- ai/TODO.md (For understanding project context and dependencies)
- src/actors/slime.ts (Existing slime implementation)
- src/level.ts (Level where slimes are added)
- ai/tasks/SIM-001-slime-dna-genetics.md (DNA/genetics implementation)

## Overview
Create a system to randomly spawn new slimes in the environment according to configurable rules. This will populate the ecosystem and allow for observing emergent behaviors and evolution.

## Requirements
- Implement random initial slime generation on simulation start
- Create a spawning mechanism for new slimes during runtime
- Allow for configuring spawn parameters (rate, location, initial population)
- Ensure new slimes have randomized DNA (using the DNA system from SIM-001)
- Optimize for handling potentially large numbers of slimes

## Init
- [ ] Read existing documentation and acknowledge the project
- [ ] Understand the current slime and level implementation
- [ ] Review the DNA implementation from SIM-001

## Implementation Steps
- [ ] Create a `SlimeSpawner` class to manage slime creation
- [ ] Implement methods to generate random positions within valid spawn areas
- [ ] Add configuration options for initial population size, spawn rate, and spawn areas
- [ ] Create a spawn timer mechanism to periodically add new slimes
- [ ] Implement methods to generate random DNA for each new slime (using SIM-001)
- [ ] Add the spawning logic to the level's update cycle
- [ ] Implement spawn limits based on available resources or carrying capacity
- [ ] Add visual feedback for spawn events (optional particle effects)
- [ ] Create optional UI controls to adjust spawn parameters during runtime

## Success Criteria
- Simulation starts with a configurable number of slimes with varied traits
- New slimes spawn at a configurable rate in appropriate locations
- Spawn system can handle creating different variants of slimes
- Spawning is optimized to handle large numbers without performance degradation
- Visual distinction between slimes based on their genetic traits

## Dependencies
- SIM-001: Slime DNA/Genetics System

## Notes
- Consider implementing spawn "hot spots" or regions where slimes are more likely to appear
- Think about natural balance - spawning should not overwhelm the system
- Should implement a way to cull excess slimes if population grows too large
- Consider implementing events that trigger mass spawning (for future environmental features)

## Post-process
- [ ] Update project documentation to reflect the changes made
- [ ] Document configuration parameters for spawning

## Verification Checklist
- [ ] All implementation steps completed
- [ ] All success criteria met
- [ ] Spawning system thoroughly tested with various parameters
- [ ] Task fully addresses all requirements
- [ ] No regression in existing functionality
- [ ] Implementation performs well with large numbers of slimes
- [ ] Documentation updated as needed

## Final Steps
- [ ] Mark the task as completed in TODO.md
- [ ] Commit the changes with a conventional commit message format 