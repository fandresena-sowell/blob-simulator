import { Random } from '../../src/utils/random';

// Mock dependencies
jest.mock('excalibur', () => {
  return {
    Engine: class MockEngine {
      drawWidth = 800;
      drawHeight = 600;
    },
    vec: (x: number, y: number) => ({ x, y, clone: () => ({ x, y }) }),
    Actor: class MockActor {
      pos = { x: 0, y: 0 };
      scale = { x: 1, y: 1, clone: () => ({ x: 1, y: 1 }) };
      vel = { x: 0, y: 0 };
      kill = jest.fn();
      stopMoving = jest.fn();
      graphics = {
        use: jest.fn(),
        opacity: 1,
        current: { text: '' }
      };
    }
  };
});

jest.mock('../../src/actors/slime', () => {
  return {
    Slime: class MockSlime {
      pos = { x: 0, y: 0 };
      scale = { x: 1, y: 1, clone: () => ({ x: 1, y: 1 }) };
      vel = { x: 0, y: 0 };
      kill = jest.fn();
      stopMoving = jest.fn();
      reproduce = jest.fn();
      graphics = {
        use: jest.fn(),
        opacity: 1
      };
      constructor() {
        this.stopMoving();
      }
      getDNA = jest.fn().mockReturnValue({});
    }
  };
});

// Need to import after mocks are set up
import { Engine } from 'excalibur';
import { SlimeSpawner, SpawnConfig } from '../../src/genetics/slime-spawner';

describe('SlimeSpawner', () => {
  let engine: Engine;
  let spawner: SlimeSpawner;
  let defaultConfig: SpawnConfig;

  beforeEach(() => {
    // Initialize Random with a fixed seed for deterministic tests
    Random.init('test-seed');
    
    engine = new Engine();
    defaultConfig = {
      initialPopulation: 5,
      spawnRate: 1, // 1 per second for easier testing
      maxPopulation: 10,
      spawnAreaPadding: 0.1
    };
    spawner = new SlimeSpawner(engine, defaultConfig);
  });

  test('should create initial slimes on initialize', () => {
    const slimes = spawner.initialize();
    expect(slimes.length).toBe(defaultConfig.initialPopulation);
    expect(spawner.getPopulation()).toBe(defaultConfig.initialPopulation);
  });

  test('should not spawn new slimes when at max population', () => {
    // Fill up to max population
    spawner.initialize();
    
    // Add more slimes to reach max
    while(spawner.getPopulation() < defaultConfig.maxPopulation) {
      const newSlime = spawner.update(1000)[0]; // 1000ms = 1s, should spawn 1 slime
      expect(newSlime).toBeDefined();
    }
    
    // Should be at max now
    expect(spawner.getPopulation()).toBe(defaultConfig.maxPopulation);
    
    // Try to spawn more, should return empty array
    const noNewSlimes = spawner.update(5000); // Even with 5s elapsed
    expect(noNewSlimes.length).toBe(0);
    expect(spawner.getPopulation()).toBe(defaultConfig.maxPopulation);
  });

  test('should spawn slimes at the configured rate', () => {
    spawner.initialize();    
    // No time passed, no new slimes
    const noNewSlimes = spawner.update(0);
    expect(noNewSlimes.length).toBe(0);
    
    // Half the required time, no new slimes
    const stillNoNewSlimes = spawner.update(500);
    expect(stillNoNewSlimes.length).toBe(0);
    
    // Full required time (1000ms), should spawn 1 slime
    const oneNewSlime = spawner.update(500); // 500 + 500 = 1000ms total
    expect(oneNewSlime.length).toBe(1);
    
    // 2000ms, should spawn 2 slimes (as long as we're below max)
    const currentCount = spawner.getPopulation();
    const slotsRemaining = defaultConfig.maxPopulation - currentCount;
    if (slotsRemaining >= 2) {
      const twoNewSlimes = spawner.update(2000);
      expect(twoNewSlimes.length).toBe(2);
    }
  });

  test('should remove slimes correctly', () => {
    const slimes = spawner.initialize();
    const initialCount = spawner.getPopulation();
    expect(initialCount).toBeGreaterThan(0);
    
    // Remove one slime
    spawner.removeSlime(slimes[0]);
    expect(spawner.getPopulation()).toBe(initialCount - 1);
    
    // Removing same slime again should have no effect
    spawner.removeSlime(slimes[0]);
    expect(spawner.getPopulation()).toBe(initialCount - 1);
  });

  test('should update config correctly', () => {
    const newConfig = {
      spawnRate: 2, // 2 per second
      maxPopulation: 20
    };
    
    spawner.updateConfig(newConfig);
    
    // Verify it spawns at the new rate
    spawner.initialize();
    
    // 500ms should now spawn 1 slime (at rate of 2 per second)
    const newSlimes = spawner.update(500);
    expect(newSlimes.length).toBe(1);
  });
}); 