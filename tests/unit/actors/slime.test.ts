import { Slime, SlimeDirection } from '../../../src/actors/slime';
import { SlimeDNA } from '../../../src/genetics/slime-dna';
import { Color } from 'excalibur';
import { Random } from '../../../src/utils/random';

// Mock Excalibur classes that Slime depends on
jest.mock('excalibur', () => {
  const original = jest.requireActual('excalibur');
  
  // Mock classes and functions that Slime uses
  return {
    __esModule: true,
    ...original,
    Actor: class {
      pos = { x: 0, y: 0 };
      vel = { x: 0, y: 0 };
      scale = { x: 1, y: 1 };
      graphics = {
        use: jest.fn(),
        opacity: 1
      };
      constructor() {}
      onInitialize() {}
      onPostUpdate() {}
    },
    Vector: {
      ...original.Vector,
    },
    SpriteSheet: {
      fromImageSource: () => ({
        getSprite: () => ({
          clone: () => ({
            flipHorizontal: false,
            tint: null
          }),
          tint: null
        })
      })
    },
    Animation: {
      fromSpriteSheet: () => ({
        clone: () => ({
          flipHorizontal: false,
          tint: null
        }),
        tint: null
      })
    },
    vec: (x: number, y: number) => ({ x, y })
  };
});

// Mock the Resources import
jest.mock('../../../src/resources', () => ({
  Resources: {
    Slime: 'slime-sprite-mock'
  }
}));

describe('Slime', () => {
  beforeEach(() => {
    Random.init('test-seed');
  });
  describe('DNA Trait Expression', () => {
    test('slime should apply size from DNA', () => {
      // Create DNA with specific size
      const testSize = 1.5;
      const customDNA = new SlimeDNA({
        size: { name: 'Size', value: testSize, min: 0.5, max: 2.0 }
      });
      
      // Create slime with custom DNA
      const slime = new Slime(customDNA);
      
      // Invoke initialization to apply DNA traits
      slime.onInitialize();
      
      // Verify scale was applied correctly
      expect(slime.scale.x).toBe(testSize);
      expect(slime.scale.y).toBe(testSize);
    });
    
    test('slime should apply color from DNA', () => {
      // Monitor calls to sprite/animation tint setting
      const tintSpy = jest.fn();
      
      // Create slime with mock tint implementation
      const customDNA = new SlimeDNA({
        color: { name: 'Color', value: 0.5, min: 0, max: 1 }
      });
      
      const slime = new Slime(customDNA);
      
      // Override the animations and idles objects to track tint changes
      const animations: any = {};
      const idles: any = {};
      
      for (const direction of Object.values(SlimeDirection)) {
        if (typeof direction === 'number') {
          animations[direction] = { tint: null };
          idles[direction] = { tint: null };
          
          // Track when tint is set
          Object.defineProperty(animations[direction], 'tint', {
            set: (value) => {
              tintSpy(value);
            }
          });
          
          Object.defineProperty(idles[direction], 'tint', {
            set: (value) => {
              tintSpy(value);
            }
          });
        }
      }
      
      // Replace animations and idles with our mock versions
      Object.defineProperty(slime, 'animations', {
        value: animations,
        writable: true
      });
      
      Object.defineProperty(slime, 'idles', {
        value: idles,
        writable: true
      });
      
      // Invoke initialization to apply DNA traits
      slime.onInitialize();
      
      // Verify tint was applied
      expect(tintSpy).toHaveBeenCalled();
      
      // Verify all tints were the same color (from DNA)
      const firstColor = tintSpy.mock.calls[0][0];
      for (let i = 1; i < tintSpy.mock.calls.length; i++) {
        const color = tintSpy.mock.calls[i][0];
        expect(color).toEqual(firstColor);
      }
      
      // Verify the color is an instance of Color
      expect(firstColor).toBeInstanceOf(Color);
    });
    
    test('slime movement speed should be affected by DNA', () => {
      // Create DNA with specific speed
      const baseSpeed = 50; // Default base speed
      const speedMultiplier = 1.3;
      const expectedVelocity = baseSpeed * speedMultiplier;
      
      const customDNA = new SlimeDNA({
        speed: { name: 'Speed', value: speedMultiplier, min: 0.1, max: 1.5 }
      });
      
      // Create slime with custom DNA
      const slime = new Slime(customDNA);
      
      // Move the slime
      slime.moveInDirection(SlimeDirection.Right);
      
      // Verify velocity matches expected value with DNA multiplier applied
      expect(slime.vel.x).toBeCloseTo(expectedVelocity);
      expect(slime.vel.y).toBe(0);
      
      // Test a different direction
      slime.moveInDirection(SlimeDirection.Down);
      expect(slime.vel.x).toBe(0);
      expect(slime.vel.y).toBeCloseTo(expectedVelocity);
    });
    
    test('reproduce should combine DNA from parents', () => {
      // Create two slimes with different DNA
      const parentDNA1 = new SlimeDNA({
        speed: { name: 'Speed', value: 0.5, min: 0.1, max: 1.5 }
      });
      
      const parentDNA2 = new SlimeDNA({
        speed: { name: 'Speed', value: 1.0, min: 0.1, max: 1.5 }
      });
      
      const parent1 = new Slime(parentDNA1);
      const parent2 = new Slime(parentDNA2);
      
      // Mock the SlimeDNA.combine method to verify it's called correctly
      const originalCombine = SlimeDNA.combine;
      const combineSpy = jest.fn().mockImplementation((dna1, dna2) => {
        return new SlimeDNA();
      });
      
      SlimeDNA.combine = combineSpy;
      
      // Create child through reproduction
      const child = parent1.reproduce(parent2);
      
      // Verify combine was called with both parent DNAs
      expect(combineSpy).toHaveBeenCalledWith(parentDNA1, parentDNA2);
      
      // Verify a new slime was created
      expect(child).toBeInstanceOf(Slime);
      
      // Restore original combine method
      SlimeDNA.combine = originalCombine;
    });
    
    test('energy efficiency should be retrieved from DNA', () => {
      // Create DNA with specific energy efficiency
      const efficiencyValue = 1.2;
      const customDNA = new SlimeDNA({
        energyEfficiency: { name: 'Energy Efficiency', value: efficiencyValue, min: 0.5, max: 1.5 }
      });
      
      // Create slime with custom DNA
      const slime = new Slime(customDNA);
      
      // Verify energy efficiency is correctly retrieved
      expect(slime.getEnergyEfficiency()).toBe(efficiencyValue);
    });
  });
}); 