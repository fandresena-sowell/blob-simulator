/**
 * Unit tests for the Food class.
 */
import { Food, FoodType } from '../../../src/actors/food';
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

describe('Food', () => {
  beforeEach(() => {
    // Initialize Random with a seed for consistent tests
    Random.init('test-seed');
  });

  describe('Creation', () => {
    test('should create basic food by default', () => {
      const food = new Food();
      expect(food.getType()).toBe(FoodType.Basic);
      expect(food.getNutritionalValue()).toBe(10); // Basic nutrition value
    });

    test('should create premium food with correct properties', () => {
      const food = new Food(FoodType.Premium);
      expect(food.getType()).toBe(FoodType.Premium);
      expect(food.getNutritionalValue()).toBe(25); // Premium nutrition value
    });

    test('should create special food with correct properties', () => {
      const food = new Food(FoodType.Special);
      expect(food.getType()).toBe(FoodType.Special);
      expect(food.getNutritionalValue()).toBe(50); // Special nutrition value
    });
  });

  describe('Consumption', () => {
    test('should return nutritional value when consumed', () => {
      const food = new Food();
      const value = food.consume();
      expect(value).toBe(10); // Basic nutrition value
      expect(food.playConsumeEffect).toHaveBeenCalled();
    });

    test('should return 0 when consumed multiple times', () => {
      const food = new Food();
      food.consume(); // First consumption
      const secondValue = food.consume();
      expect(secondValue).toBe(0); // Already consumed
    });

    test('should call onConsumed callback when consumed', () => {
      const food = new Food();
      const mockCallback = jest.fn();
      food.setConsumedCallback(mockCallback);
      
      food.consume();
      
      expect(mockCallback).toHaveBeenCalledWith(food);
    });
  });
}); 