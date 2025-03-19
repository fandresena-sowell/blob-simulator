# ENV-004: Add Weather Effects

## Reference Files
The following files should be referenced when working on this task:
- ai/TODO.md (For understanding project context and dependencies)
- src/level.ts (Level implementation to be modified)
- ai/tasks/ENV-003-day-night-cycle.md (Time system integration)
- src/actors/slime.ts (Slime behavior affected by weather)

## Overview
Implement a weather system with various weather effects that affect the environment and slime behavior, creating a more dynamic and realistic ecosystem with changing environmental conditions.

## Requirements
- Create multiple weather types (rain, snow, clear, etc.)
- Implement visual effects for each weather type
- Make environment properties change based on weather
- Affect slime behavior based on weather conditions
- Create a weather transition system

## Init
- [ ] Read existing documentation and acknowledge the project
- [ ] Understand the current level implementation and rendering system
- [ ] Review day/night cycle implementation if completed

## Implementation Steps
- [ ] Create a `WeatherSystem` class to manage weather effects
- [ ] Implement various weather types (clear, cloudy, rainy, stormy, etc.)
- [ ] Add visual particle effects for different weather conditions
- [ ] Create sound effects for different weather types (optional)
- [ ] Implement environment property changes based on weather (visibility, temperature)
- [ ] Modify slime movement and behavior based on weather conditions
- [ ] Add weather transition effects between different types
- [ ] Create a weather prediction or pattern system
- [ ] Implement weather intensity variations (light rain to heavy storm)
- [ ] Add visual indicators for current weather condition
- [ ] Create a configurable system for weather parameters and probabilities

## Success Criteria
- Multiple weather types with distinct visual appearances
- Smooth transitions between different weather conditions
- Environment properties change based on weather
- Slime behavior is affected by weather conditions
- Weather system is configurable and creates interesting patterns

## Dependencies
- ENV-003: Day/Night Cycle (optional but recommended for integration)

## Notes
- Consider how weather will affect terrain properties (mud gets muddier in rain, etc.)
- Think about seasonal weather patterns for long-term simulations
- Balance weather effects to create interesting dynamics without overwhelming the simulation
- Consider rare weather events that can dramatically change the ecosystem temporarily

## Post-process
- [ ] Update project documentation to reflect the changes made
- [ ] Document the weather system parameters and effects

## Verification Checklist
- [ ] All implementation steps completed
- [ ] All success criteria met
- [ ] Weather system thoroughly tested with various conditions
- [ ] Task fully addresses all requirements
- [ ] No regression in existing functionality
- [ ] Implementation thoroughly tested
- [ ] Documentation updated as needed

## Final Steps
- [ ] Mark the task as completed in TODO.md
- [ ] Commit the changes with a conventional commit message format 