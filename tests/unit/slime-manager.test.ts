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
import { SlimeManager, SpawnConfig } from '../../src/managers/slime-manager';

describe('SlimeManager', () => {
  let engine: Engine;
  let manager: SlimeManager;
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
    manager = new SlimeManager(engine, defaultConfig);
  });

  test('should create initial slimes on initialize', () => {
    const slimes = manager.initialize();
    expect(slimes.length).toBe(defaultConfig.initialPopulation);
    expect(manager.getPopulation()).toBe(defaultConfig.initialPopulation);
  });

  test('should not spawn new slimes when at max population', () => {
    // Fill up to max population
    manager.initialize();
    
    // Add more slimes to reach max
    while(manager.getPopulation() < defaultConfig.maxPopulation) {
      const newSlime = manager.update(1000)[0]; // 1000ms = 1s, should spawn 1 slime
      expect(newSlime).toBeDefined();
    }
    
    // Should be at max now
    expect(manager.getPopulation()).toBe(defaultConfig.maxPopulation);
    
    // Try to spawn more, should return empty array
    const noNewSlimes = manager.update(5000); // Even with 5s elapsed
    expect(noNewSlimes.length).toBe(0);
    expect(manager.getPopulation()).toBe(defaultConfig.maxPopulation);
  });

  test('should spawn slimes at the configured rate', () => {
    manager.initialize();    
    // No time passed, no new slimes
    const noNewSlimes = manager.update(0);
    expect(noNewSlimes.length).toBe(0);
    
    // Half the required time, no new slimes
    const stillNoNewSlimes = manager.update(500);
    expect(stillNoNewSlimes.length).toBe(0);
    
    // Full required time (1000ms), should spawn 1 slime
    const oneNewSlime = manager.update(500); // 500 + 500 = 1000ms total
    expect(oneNewSlime.length).toBe(1);
    
    // 2000ms, should spawn 2 slimes (as long as we're below max)
    const currentCount = manager.getPopulation();
    const slotsRemaining = defaultConfig.maxPopulation - currentCount;
    if (slotsRemaining >= 2) {
      const twoNewSlimes = manager.update(2000);
      expect(twoNewSlimes.length).toBe(2);
    }
  });

  test('should remove slimes correctly', () => {
    const slimes = manager.initialize();
    const initialCount = manager.getPopulation();
    expect(initialCount).toBeGreaterThan(0);
    
    // Remove one slime
    manager.removeSlime(slimes[0]);
    expect(manager.getPopulation()).toBe(initialCount - 1);
    
    // Removing same slime again should have no effect
    manager.removeSlime(slimes[0]);
    expect(manager.getPopulation()).toBe(initialCount - 1);
  });

  test('should update config correctly', () => {
    const newConfig = {
      spawnRate: 2, // 2 per second
      maxPopulation: 20
    };
    
    manager.updateConfig(newConfig);
    
    // Verify it spawns at the new rate
    manager.initialize();
    
    // 500ms should now spawn 1 slime (at rate of 2 per second)
    const newSlimes = manager.update(500);
    expect(newSlimes.length).toBe(1);
  });
}); 