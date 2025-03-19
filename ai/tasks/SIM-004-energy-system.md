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
- [ ] Read existing documentation and acknowledge the project
- [ ] Review slime DNA and food resource implementations

## Implementation Steps
- [ ] Add energy property to the Slime class with maximum and current values
- [ ] Implement energy depletion over time (passive energy burn)
- [ ] Make movement and actions consume energy at appropriate rates
- [ ] Modify slime code to consume food and convert it to energy
- [ ] Add energy efficiency as a genetic trait in the DNA system
- [ ] Implement visual indicators of slime energy levels (color saturation, size, etc.)
- [ ] Add death functionality when energy is completely depleted
- [ ] Create energy consumption modifiers based on slime activities
- [ ] Implement different movement modes that use energy differently (sprint uses more)
- [ ] Add optional "hunger" behavior that increases when energy is low

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
- [ ] Update project documentation to reflect the changes made
- [ ] Document the energy system parameters and balance

## Verification Checklist
- [ ] All implementation steps completed
- [ ] All success criteria met
- [ ] Energy system thoroughly tested with various parameters
- [ ] Task fully addresses all requirements
- [ ] No regression in existing functionality
- [ ] Implementation thoroughly tested
- [ ] Documentation updated as needed

## Final Steps
- [ ] Mark the task as completed in TODO.md
- [ ] Commit the changes with a conventional commit message format 