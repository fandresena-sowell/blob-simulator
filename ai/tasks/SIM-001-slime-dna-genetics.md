# SIM-001: Implement Slime DNA/Genetics System

## Reference Files
The following files should be referenced when working on this task:
- ai/TODO.md (For understanding project context and dependencies)
- src/actors/slime.ts (Existing slime implementation)
- src/level.ts (Level where slimes are added)
- src/main.ts (Game configuration)

## Overview
Implement a genetic system for slimes that defines their traits such as color, size, speed, and other characteristics. This will be the foundation for the evolution and ecosystem aspects of the simulation.

## Requirements
- Create a DNA data structure that encodes slime traits
- Implement trait expression that affects slime appearance and behavior
- Ensure traits are serializable for save/load functionality
- Allow for trait variation during initial slime creation

## Init
- [ ] Read existing documentation and acknowledge the project
- [ ] Understand the current slime implementation

## Implementation Steps
- [ ] Create a `SlimeDNA` class or interface that stores genetic information
- [ ] Define key traits (speed, size, color, energy efficiency, etc.)
- [ ] Implement methods to generate random DNA for new slimes
- [ ] Modify the Slime class to accept DNA during construction
- [ ] Update the slime's visual appearance based on DNA (color tint, size scaling)
- [ ] Adjust slime movement speed and other behaviors based on DNA
- [ ] Add methods for DNA combination (for future reproduction task)
- [ ] Create utility functions for DNA manipulation and analysis

## Success Criteria
- Slimes have varied appearances based on their genetics
- DNA traits directly affect slime behavior and capabilities
- DNA system is extensible to allow adding new traits in the future
- Slime appearance clearly indicates its genetic traits (visual cues)

## Dependencies
- None (builds on existing slime implementation)

## Notes
- Consider using a binary string, gene map, or floating-point array to represent DNA
- Balance trait advantages/disadvantages (e.g., faster speed might require more energy)
- Use a color scheme that makes genetic differences easily visible
- Consider how this system will integrate with future mutation and reproduction features

## Post-process
- [ ] Update project documentation to reflect the changes made
- [ ] Add comments explaining the DNA system for future tasks

## Verification Checklist
- [ ] All implementation steps completed
- [ ] All success criteria met
- [ ] DNA system thoroughly tested with multiple slimes
- [ ] Task fully addresses all requirements
- [ ] No regression in existing functionality
- [ ] Implementation thoroughly tested
- [ ] Documentation updated as needed

## Final Steps
- [ ] Mark the task as completed in TODO.md
- [ ] Commit the changes with a conventional commit message format 