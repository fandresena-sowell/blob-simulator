# UI-002: Create Controls for Simulation Speed

## Reference Files
The following files should be referenced when working on this task:
- ai/TODO.md (For understanding project context and dependencies)
- src/main.ts (Game configuration)
- src/level.ts (Simulation update logic)

## Overview
Implement UI controls that allow users to adjust the simulation speed, pause the simulation, and control the flow of time in the ecosystem. This will enhance the user experience by allowing observation at different timescales.

## Requirements
- Create controls for pausing, resuming, and adjusting simulation speed
- Implement a visual indicator of current simulation speed
- Make controls intuitive and easy to use
- Ensure smooth transitions between different speeds
- Allow keyboard shortcuts for common speed controls

## Init
- [ ] Read existing documentation and acknowledge the project
- [ ] Understand Excalibur.js game loop and time scaling
- [ ] Review existing UI components and styling

## Implementation Steps
- [ ] Create a `SimulationControls` UI component
- [ ] Implement pause/resume button functionality
- [ ] Add speed adjustment controls (slider or preset buttons)
- [ ] Create a visual indicator of current simulation speed
- [ ] Implement keyboard shortcuts for common controls
- [ ] Add time scaling functionality in the game loop
- [ ] Ensure systems properly adjust to time scaling (physics, animations)
- [ ] Create visual styling consistent with the game's aesthetic
- [ ] Add tooltips for control explanations
- [ ] Implement time counter/clock display
- [ ] Add optional step-by-step advancement mode for detailed observation

## Success Criteria
- Users can pause, resume, and adjust simulation speed
- Current simulation speed is clearly indicated
- Controls are intuitive and responsive
- Simulation behaves correctly at different speeds
- Keyboard shortcuts work as expected

## Dependencies
- None

## Notes
- Consider implementing preset speed multiples (0.5x, 1x, 2x, 5x, etc.)
- Think about how time scaling affects animations and physics
- Balance between performance and accuracy at high speeds
- Consider adding a "fast-forward until event" feature for long-term observation

## Post-process
- [ ] Update project documentation to reflect the changes made
- [ ] Document the simulation speed controls and their effects

## Verification Checklist
- [ ] All implementation steps completed
- [ ] All success criteria met
- [ ] Controls thoroughly tested at various speeds
- [ ] Task fully addresses all requirements
- [ ] No regression in existing functionality
- [ ] Implementation thoroughly tested
- [ ] Documentation updated as needed

## Final Steps
- [ ] Mark the task as completed in TODO.md
- [ ] Commit the changes with a conventional commit message format 