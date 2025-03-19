# EVO-001: Implement Natural Selection

## Reference Files
The following files should be referenced when working on this task:
- ai/TODO.md (For understanding project context and dependencies)
- ai/tasks/SIM-001-slime-dna-genetics.md (DNA system)
- ai/tasks/SIM-004-energy-system.md (Energy system for survival)
- ai/tasks/SIM-005-slime-reproduction.md (Reproduction system)
- src/actors/slime.ts (Slime implementation)

## Overview
Implement a natural selection system where slimes with better-adapted traits survive longer and reproduce more, leading to evolution of the slime population over time. This is a core feature of the ecosystem simulation.

## Requirements
- Create a system that tracks slime survival rates based on traits
- Ensure traits that improve survival are more likely to be passed on
- Implement statistics tracking for population genetics over time
- Balance the system to allow for visible evolution without being too rapid
- Visualize the natural selection process

## Init
- [ ] Read existing documentation and acknowledge the project
- [ ] Review the slime DNA, energy, and reproduction systems

## Implementation Steps
- [ ] Add tracking mechanisms for slime lifespans and reproduction counts
- [ ] Implement statistical analysis tools for population genetics
- [ ] Create a system to identify which traits are becoming more/less common
- [ ] Adjust environment challenges to create selection pressure
- [ ] Implement population bottleneck events (optional) to accelerate evolution
- [ ] Add visualization tools for genetic changes over time
- [ ] Create a "fitness score" system to quantify slime adaptation
- [ ] Implement gene frequency tracking for the overall population
- [ ] Add historical data storage for evolutionary trends
- [ ] Create optional UI elements to display evolution statistics
- [ ] Implement "success" metrics for different slime strategies

## Success Criteria
- Slime population shows genetic changes over multiple generations
- Traits that provide advantages in the current environment become more common
- System can track and display evolutionary trends
- Selection pressure is balanced to create observable but not too rapid change
- Different environmental conditions lead to different evolutionary outcomes

## Dependencies
- SIM-001: Slime DNA/Genetics System
- SIM-004: Energy System
- SIM-005: Slime Reproduction
- SIM-006: Basic Slime AI (recommended for realistic behavior)

## Notes
- Natural selection should operate on multiple traits simultaneously
- Consider implementing specific challenges that test different traits
- Balance is crucial - evolution should be observable but not overwhelming
- Consider implementing "stable equilibriums" where multiple strategies can coexist
- Think about how environmental changes will drive evolutionary adaptation

## Post-process
- [ ] Update project documentation to reflect the changes made
- [ ] Document the natural selection system and its parameters

## Verification Checklist
- [ ] All implementation steps completed
- [ ] All success criteria met
- [ ] Natural selection thoroughly tested over multiple generations
- [ ] Task fully addresses all requirements
- [ ] No regression in existing functionality
- [ ] Implementation thoroughly tested
- [ ] Documentation updated as needed

## Final Steps
- [ ] Mark the task as completed in TODO.md
- [ ] Commit the changes with a conventional commit message format 