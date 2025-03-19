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

## Online Demo

You can view the live version of this project on GitHub Pages at:
https://[your-username].github.io/blob-simulator

## GitHub Pages Deployment

This project is configured to automatically deploy to GitHub Pages when changes are pushed to the main branch. The deployment is handled by a GitHub Action workflow.

To set up GitHub Pages for this repository:

1. Go to your repository on GitHub
2. Navigate to Settings -> Pages
3. Under "Build and deployment" section, select "GitHub Actions" as the source
4. Push changes to the main branch to trigger a deployment

The GitHub Action workflow will:
- Build the project using Vite
- Deploy the built files to GitHub Pages

## Features

- Slimes with genetic traits that affect appearance and behavior
- Random slime generation with DNA-based traits
- Visual trait expression (color, size, speed)
- Automatic slime spawning with configurable parameters
- Population management and growth visualization
- Test harness for visualizing different slime traits (press 'T' in game)
- Food resources with different types and nutritional values
- Random slime movement with boundary detection
- Energy system where slimes consume food to gain energy
- Food respawning with configurable parameters

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
- Slime manager system: [docs/slime-manager.md](docs/slime-manager.md)
- Food system: [docs/food-system.md](docs/food-system.md)

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

See [docs/slime-manager.md](docs/slime-manager.md) for more details on the spawning system.

### Food System Configuration

The food system can be customized by modifying the `foodConfig` in `src/level.ts`:

```typescript
private foodConfig: FoodConfig = {
  initialCount: 40,        // Initial number of food items
  spawnRate: 0.3,          // Food per second
  maxCount: 60,            // Maximum number of food items
  spawnAreaPadding: 0.1,   // % of screen edges to avoid when spawning
  specialFoodChance: 0.05, // 5% chance for high-value food
  premiumFoodChance: 0.15, // 15% chance for medium-value food
};
```

See [docs/food-system.md](docs/food-system.md) for more details on the food system implementation.
