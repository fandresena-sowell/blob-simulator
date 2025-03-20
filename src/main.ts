import { Color, DisplayMode, Engine, FadeInOut } from "excalibur";
import { loader } from "./resources";
import { MyLevel } from "./level";
import { SlimeTestHarness } from "./debug/test-harness";
import { Random } from "./utils/random"

// Parse seed from URL for deterministic randomness in testing
const urlParams = new URLSearchParams(window.location.search);
const seed = urlParams.get('seed') || String(Math.random());
Random.init(seed);
console.log(`Using random seed: ${seed}`);

// Declare global interface for TypeScript
declare global {
  interface Window {
    blobSimGame?: Engine;
  }
}

// Goal is to keep main.ts small and just enough to configure the engine
const game = new Engine({
  width: 800, // Logical width and height in game pixels
  height: 600,
  displayMode: DisplayMode.Fixed, // Display mode tells excalibur how to fill the window
  pixelArt: true, // pixelArt will turn on the correct settings to render pixel art without jaggies or shimmering artifacts
  scenes: {
    start: MyLevel
  },
  // physics: {
  //   solver: SolverStrategy.Realistic,
  //   substep: 5 // Sub step the physics simulation for more robust simulations
  // },
  // fixedUpdateTimestep: 16 // Turn on fixed update timestep when consistent physic simulation is important
});

// Expose the game engine globally for testing
window.blobSimGame = game;

game.start('start', { // name of the start scene 'start'
  loader, // Optional loader (but needed for loading images/sounds)
  inTransition: new FadeInOut({ // Optional in transition
    duration: 1000,
    direction: 'in',
    color: Color.ExcaliburBlue
  })
}).then(() => {
  // Initialize the test harness after the game starts
  new SlimeTestHarness(game);
  console.log('Game started. Press T to toggle the DNA test harness.');
});