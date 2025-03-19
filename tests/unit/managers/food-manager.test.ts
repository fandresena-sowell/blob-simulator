/**
 * Unit tests for the FoodManager class.
 */
import { FoodManager, FoodConfig } from '../../../src/managers/food-manager';
import { FoodType } from '../../../src/actors/food';
import { Engine } from 'excalibur';
import { Random } from '../../../src/utils/random';

// Mock the Food class's playConsumeEffect method
jest.mock('../../../src/actors/food', () => {
  const original = jest.requireActual('../../../src/actors/food');
  return {
    ...original,
    Food: class extends original.Food {
      constructor(type?: FoodType) {
        super(type);
        // Override the method to prevent scale.clone() error
        this.playConsumeEffect = jest.fn();
      }
    }
  };
});

// Mock the graphics.use method to avoid canvas context errors
jest.mock('excalibur', () => {
  const originalModule = jest.requireActual('excalibur');
  return {
    ...originalModule,
    Actor: class MockActor {
      graphics = {
        use: jest.fn()
      };
      pos = { x: 0, y: 0 };
      scale = { x: 1, y: 1, clone: () => ({ x: 1, y: 1 }) };
      collisionType = 'Active';
    },
    Circle: class MockCircle {
      constructor(config: any) {
        // No need to do anything here
      }
    },
    CollisionType: {
      Active: 'Active'
    },
    Vector: class MockVector {
      constructor(x: number, y: number) {
        return { x, y, clone: () => ({ x, y }) };
      }
      static Zero = { x: 0, y: 0, clone: () => ({ x: 0, y: 0 }) };
    }
  };
});

describe('FoodManager', () => {
  let engine: Engine;
  
  beforeEach(() => {
    // Initialize Random with a seed for consistent tests
    Random.init('test-seed');
    
    // Create a mock Engine instance
    engine = {
      drawWidth: 800,
      drawHeight: 600
    } as unknown as Engine;
  });
  
  describe('Initialization', () => {
    test('should initialize with default settings when no config provided', () => {
      const manager = new FoodManager(engine);
      const foods = manager.initialize();
      
      // Default initialCount is 30
      expect(foods.length).toBe(30);
      expect(manager.getFoodCount()).toBe(30);
    });
    
    test('should initialize with custom settings', () => {
      const config: Partial<FoodConfig> = {
        initialCount: 10,
        maxCount: 20
      };
      
      const manager = new FoodManager(engine, config);
      const foods = manager.initialize();
      
      expect(foods.length).toBe(10);
      expect(manager.getFoodCount()).toBe(10);
    });
  });
  
  describe('Food Management', () => {
    test('should remove food when consumed', () => {
      const manager = new FoodManager(engine, { initialCount: 5 });
      manager.initialize();
      
      const foods = manager.getAllFood();
      expect(foods.length).toBe(5);
      
      // Find a callback for the first food
      // We need to trigger removal through the callback that was set
      const food = foods[0];
      food.consume(); // This should trigger the callback
      
      // After removal, there should be 4 foods left
      expect(manager.getFoodCount()).toBe(4);
    });
    
    test('should update food over time', () => {
      const manager = new FoodManager(engine, { 
        initialCount: 5,
        maxCount: 10,
        spawnRate: 1.0 // 1 food per second
      });
      manager.initialize();
      
      // After 2 seconds at 1 food/sec, we should have 2 new foods
      const newFoods = manager.update(2000);
      
      expect(newFoods.length).toBe(2);
      expect(manager.getFoodCount()).toBe(7); // 5 initial + 2 new
    });
    
    test('should respect maxCount when spawning food', () => {
      const manager = new FoodManager(engine, { 
        initialCount: 8,
        maxCount: 10,
        spawnRate: 1.0 // 1 food per second
      });
      manager.initialize();
      
      // After 5 seconds at 1 food/sec, we should only have 2 new foods (to reach max 10)
      const newFoods = manager.update(5000);
      
      expect(newFoods.length).toBe(2);
      expect(manager.getFoodCount()).toBe(10); // maxed out at 10
    });
  });
  
  describe('Configuration', () => {
    test('should update configuration', () => {
      const manager = new FoodManager(engine, { 
        initialCount: 5,
        spawnRate: 0.5
      });
      
      // Update the configuration
      manager.updateConfig({
        spawnRate: 2.0 // 2 food per second
      });
      
      // After 1 second at 2 food/sec, we should get 2 new foods
      manager.initialize(); // Reset and initialize
      const newFoods = manager.update(1000);
      
      expect(newFoods.length).toBe(2);
    });
  });
}); 