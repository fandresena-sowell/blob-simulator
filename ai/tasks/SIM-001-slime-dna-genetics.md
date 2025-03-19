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
- [x] Create a DNA data structure that encodes slime traits
- [x] Implement trait expression that affects slime appearance and behavior
- [x] Ensure traits are serializable for save/load functionality
- [x] Allow for trait variation during initial slime creation

## Init
- [x] Read existing documentation and acknowledge the project
- [x] Understand the current slime implementation

## Implementation Steps
- [x] Create a `SlimeDNA` class or interface that stores genetic information
- [x] Define key traits (speed, size, color, energy efficiency, etc.)
- [x] Implement methods to generate random DNA for new slimes
- [x] Modify the Slime class to accept DNA during construction
- [x] Update the slime's visual appearance based on DNA (color tint, size scaling)
- [x] Adjust slime movement speed and other behaviors based on DNA
- [x] Add methods for DNA combination (for future reproduction task)
- [x] Create utility functions for DNA manipulation and analysis

## Success Criteria
- [x] Slimes have varied appearances based on their genetics
- [x] DNA traits directly affect slime behavior and capabilities
- [x] DNA system is extensible to allow adding new traits in the future
- [x] Slime appearance clearly indicates its genetic traits (visual cues)

## Dependencies
- None (builds on existing slime implementation)

## Notes
- Consider using a binary string, gene map, or floating-point array to represent DNA
- Balance trait advantages/disadvantages (e.g., faster speed might require more energy)
- Use a color scheme that makes genetic differences easily visible
- Consider how this system will integrate with future mutation and reproduction features

## Post-process
- [x] Update project documentation to reflect the changes made
- [x] Add comments explaining the DNA system for future tasks

## Verification Checklist
- [x] All implementation steps completed
- [x] All success criteria met
- [x] DNA system thoroughly tested with multiple slimes
- [x] Task fully addresses all requirements
- [x] No regression in existing functionality
- [x] Implementation thoroughly tested
- [x] Documentation updated as needed

## Final Steps
- [x] Mark the task as completed in TODO.md
- [x] Commit the changes with a conventional commit message format 

## Testing Implementation
The following testing infrastructure has been implemented to verify the DNA/genetics system:

### Unit Testing
- [x] Created Jest tests for SlimeDNA class
- [x] Created Jest tests for Slime DNA trait expression
- [x] Tests verify DNA generation, combination, mutation and serialization

### Visual Testing
- [x] Created Playwright tests for visual verification
- [x] Implemented in-game test harness (toggle with 'T' key)
- [x] Test harness provides visual comparison of slimes with different traits

### Documentation
- [x] Created visual trait identification guide (docs/slime-dna-visual-guide.md)
- [x] Updated README with testing information
- [x] Added test harness usage instructions 