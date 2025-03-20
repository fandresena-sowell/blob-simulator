# SIM-004: Implement Energy System

## Reference Files
The following files should be referenced when working on this task:
- ai/TODO.md (For understanding project context and dependencies)
- src/actors/slime.ts (Existing slime implementation)
- ai/tasks/SIM-001-slime-dna-genetics.md (DNA system that affects energy usage)
- ai/tasks/SIM-003-food-resources.md (Food resources that provide energy)

## Overview
Implement an energy system for slimes where they need to consume food to survive and perform actions. This system will drive slime behavior and create natural selection pressure.

## Requirements
- Add energy property to slimes that depletes over time
- Implement energy consumption based on slime actions (movement, etc.)
- Allow slimes to gain energy by consuming food resources
- Make energy efficiency a genetic trait that varies between slimes
- Implement slime death when energy is completely depleted

## Init
- [x] Read existing documentation and acknowledge the project
- [x] Review slime DNA and food resource implementations

## Implementation Steps
- [x] Add energy property to the Slime class with maximum and current values
- [x] Implement energy depletion over time (passive energy burn)
- [x] Make movement and actions consume energy at appropriate rates
- [x] Modify slime code to consume food and convert it to energy
- [x] Add energy efficiency as a genetic trait in the DNA system
- [x] Implement visual indicators of slime energy levels (energy bar)
- [x] Add death functionality when energy is completely depleted
- [x] Create energy consumption modifiers based on slime activities
- [x] Implement different movement modes that use energy differently (sprint uses more)
- [x] Add optional "hunger" behavior that increases when energy is low

## Success Criteria
- Slimes consume energy over time and through actions
- Slimes gain energy by consuming food
- Energy efficiency varies between slimes based on genetics
- Slimes die when energy is completely depleted
- Energy levels are visually indicated on slimes
- System creates natural pressure to seek food

## Dependencies
- SIM-001: Slime DNA/Genetics System (for energy efficiency trait)
- SIM-003: Food Resources (source of energy)

## Notes
- Balance energy consumption rates carefully to create a challenging but fair ecosystem
- Consider implementing energy storage as a separate trait from energy efficiency
- Energy system should integrate with future reproduction system (reproduction requires energy)
- Consider environmental factors that might affect energy consumption (future feature)

## Post-process
- [x] Update project documentation to reflect the changes made
- [x] Document the energy system parameters and balance

## Verification Checklist
- [x] All implementation steps completed
- [x] All success criteria met
- [x] Energy system thoroughly tested with various parameters
- [x] Task fully addresses all requirements
- [x] No regression in existing functionality
- [x] Implementation thoroughly tested
- [x] Documentation updated as needed

## Final Steps
- [x] Mark the task as completed in TODO.md
- [x] Commit the changes with a conventional commit message format 