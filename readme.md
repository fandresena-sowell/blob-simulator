# Blob Simulator

A simulation game that models an ecosystem of evolving slime creatures. Built with Excalibur.js, TypeScript, and Vite.

Check out the full documentation @ https://excaliburjs.com

You can use the excalibur cli to generate this template

```sh
npm create excalibur
```

## Getting Started

1. [Generate a repository](https://github.com/excaliburjs/template-ts-vite/generate) from this template
2. Modify the `package.json` with your own details
3. Run `npm install` to install dependencies
4. Run `npm run dev` to start the Vite server!
5. Have fun!

## Features

- Slimes with genetic traits that affect appearance and behavior
- Random slime generation with DNA-based traits
- Visual trait expression (color, size, speed)
- Automatic slime spawning with configurable parameters
- Population management and growth visualization
- Test harness for visualizing different slime traits (press 'T' in game)

## Testing Framework

This project utilizes a comprehensive testing approach to verify the DNA/genetics system:

### Unit Testing with Jest

Run unit tests with:
```sh
yarn test:unit
```

Unit tests verify:
- DNA generation and manipulation
- Trait expression in slimes
- DNA inheritance and mutation
- Serialization of genetic information

### Integration Testing with Playwright

Run integration tests with:
```sh
yarn test
```

Playwright tests verify:
- Visual trait differences between slimes
- Simulation rendering and functionality

### Visual Testing Harness

A built-in test harness can be activated by pressing 'T' while the game is running. This provides:
- Visual comparison of slimes with different trait values
- Side-by-side trait visualization
- Movement demos to verify speed traits

## Documentation

- DNA trait visual guide: [docs/slime-dna-visual-guide.md](docs/slime-dna-visual-guide.md)
- Slime spawning system: [docs/slime-spawner.md](docs/slime-spawner.md)

## Configuration

The simulation includes several configurable parameters:

### Slime Spawning Configuration

You can customize the slime spawning behavior by modifying the `spawnConfig` in `src/level.ts`:

```typescript
private spawnConfig: SpawnConfig = {
  initialPopulation: 20,   // Initial number of slimes
  spawnRate: 0.2,          // Slimes per second (1 every 5 seconds)
  maxPopulation: 100,      // Maximum allowed slimes
  spawnAreaPadding: 0.1,   // % of screen edges to avoid when spawning
};
```

See [docs/slime-spawner.md](docs/slime-spawner.md) for more details on the spawning system.
