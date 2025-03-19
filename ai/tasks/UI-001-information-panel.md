# UI-001: Add Information Panel Showing Ecosystem Stats

## Reference Files
The following files should be referenced when working on this task:
- ai/TODO.md (For understanding project context and dependencies)
- src/main.ts (Game configuration)
- src/level.ts (Access to simulation data)

## Overview
Create an information panel UI that displays key ecosystem statistics and metrics to help users understand the state of the simulation and monitor changes over time.

## Requirements
- Create a UI panel that displays ecosystem statistics
- Show real-time metrics such as population counts, average traits, etc.
- Make the panel visually consistent with the overall design
- Ensure the UI updates regularly with current data
- Allow toggling the panel visibility

## Init
- [ ] Read existing documentation and acknowledge the project
- [ ] Understand the current UI capabilities in Excalibur.js
- [ ] Review existing ecosystem metrics and data sources

## Implementation Steps
- [ ] Create a `StatsPanel` UI component using Excalibur's UI system
- [ ] Implement a layout for displaying multiple statistics
- [ ] Add core statistics displays (population count, food available, etc.)
- [ ] Create data collection and aggregation functions
- [ ] Implement regular updates of displayed statistics
- [ ] Add toggle functionality to show/hide the panel
- [ ] Create visual styling consistent with the game's aesthetic
- [ ] Implement categorized tabs for different types of statistics (optional)
- [ ] Add simple visualizations (graphs, charts) for key metrics (optional)
- [ ] Create hover tooltips for explaining statistics (optional)
- [ ] Implement customizable panel (user can choose which stats to display)

## Success Criteria
- Panel clearly displays key ecosystem metrics
- UI updates regularly with current simulation data
- Panel can be toggled on/off by the user
- Visual design is consistent with the overall game aesthetic
- Performance remains good even with the panel constantly updating

## Dependencies
- None (but will display data from various simulation systems)

## Notes
- Consider what statistics are most meaningful to display
- Balance information density with readability
- Think about how to visualize trends over time, not just current values
- Consider making statistics exportable for external analysis (optional)

## Post-process
- [ ] Update project documentation to reflect the changes made
- [ ] Document the available statistics and their meanings

## Verification Checklist
- [ ] All implementation steps completed
- [ ] All success criteria met
- [ ] Panel thoroughly tested with various simulation states
- [ ] Task fully addresses all requirements
- [ ] No regression in existing functionality
- [ ] Implementation thoroughly tested
- [ ] Documentation updated as needed

## Final Steps
- [ ] Mark the task as completed in TODO.md
- [ ] Commit the changes with a conventional commit message format 