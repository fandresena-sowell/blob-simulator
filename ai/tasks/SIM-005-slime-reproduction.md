# SIM-005: Add Slime Reproduction

## Reference Files
The following files should be referenced when working on this task:
- ai/TODO.md (For understanding project context and dependencies)
- src/actors/slime.ts (Existing slime implementation)
- ai/tasks/SIM-001-slime-dna-genetics.md (DNA system for inheritance)
- ai/tasks/SIM-004-energy-system.md (Energy required for reproduction)

## Overview
Implement a reproduction system for slimes that allows them to create offspring when they have accumulated enough energy. The reproduction will combine DNA from parent slimes to create genetically diverse offspring.

## Requirements
- Allow slimes to reproduce when they have sufficient energy
- Implement genetic inheritance from parent to offspring
- Create a reproduction cooldown period
- Make reproduction cost a significant amount of energy
- Add optional visual effects for reproduction

## Init
- [ ] Read existing documentation and acknowledge the project
- [ ] Review the DNA and energy system implementations

## Implementation Steps
- [ ] Add reproduction-related properties to the Slime class (cooldown, energy threshold)
- [ ] Implement a method to check if a slime is ready to reproduce
- [ ] Create a reproduction method that spawns a new slime
- [ ] Implement DNA inheritance logic (combining parent DNA or asexual reproduction)
- [ ] Add energy cost for reproduction
- [ ] Implement reproduction cooldown timer
- [ ] Create visual indicators for slimes ready to reproduce
- [ ] Add optional particle effects during reproduction
- [ ] Implement optional "mating" behavior between slimes (for sexual reproduction)
- [ ] Add slight random mutations during DNA inheritance
- [ ] Create reproduction statistics tracking

## Success Criteria
- Slimes reproduce when they have sufficient energy
- Offspring inherit traits from parent(s) with slight variations
- Reproduction consumes energy and triggers a cooldown
- System creates a natural population cycle
- Reproduction is visually indicated

## Dependencies
- SIM-001: Slime DNA/Genetics System
- SIM-004: Energy System

## Notes
- Consider implementing both asexual and sexual reproduction methods
- Balance reproduction energy cost carefully to avoid population explosions
- Think about how reproduction ties into the evolutionary aspects of the simulation
- Reproduction rate should be influenced by environmental factors in future tasks

## Post-process
- [ ] Update project documentation to reflect the changes made
- [ ] Document the reproduction system parameters and balance

## Verification Checklist
- [ ] All implementation steps completed
- [ ] All success criteria met
- [ ] Reproduction system thoroughly tested with various parameters
- [ ] Task fully addresses all requirements
- [ ] No regression in existing functionality
- [ ] Implementation thoroughly tested
- [ ] Documentation updated as needed

## Final Steps
- [ ] Mark the task as completed in TODO.md
- [ ] Commit the changes with a conventional commit message format 