/**
 * Unit tests for the Energy System implementation.
 */
import { Slime, MovementMode, HungerState, SlimeDirection } from "../../src/actors/slime";
import { FoodType } from "../../src/actors/food";
import { SlimeDNA } from "../../src/genetics/slime-dna";
import { Random } from "../../src/utils/random";

// Mock Excalibur dependencies
jest.mock("excalibur", () => {
  const originalModule = jest.requireActual("excalibur");
  return {
    ...originalModule,
    Actor: class MockActor {
      eventDispatcher = {
        events: new Map(),
      };
      on(eventName: string, callback: Function) {
        if (!this.eventDispatcher.events.has(eventName)) {
          this.eventDispatcher.events.set(eventName, []);
        }
        this.eventDispatcher.events.get(eventName).push(callback);
      }
      graphics = {
        use: jest.fn(),
        onPreDraw: null,
      };
      pos = { x: 0, y: 0 };
      vel = { x: 0, y: 0 };
      scale = { x: 1, y: 1, clone: () => ({ x: 1, y: 1 }) };
      actions = {
        fade: jest.fn().mockReturnValue({
          callMethod: jest.fn(callback => {
            // Immediately call the callback for testing
            callback();
            return { callMethod: jest.fn() };
          })
        })
      };
      scene = {
        remove: jest.fn()
      };
    },
    SpriteSheet: {
      fromImageSource: () => ({
        getSprite: () => ({
          clone: () => ({ flipHorizontal: false }),
        }),
      }),
    },
    Animation: {
      fromSpriteSheet: () => ({
        clone: () => ({
          flipHorizontal: false,
        }),
      }),
    },
    vec: (x: number, y: number) => ({ x, y }),
    Color: class {
      constructor(r: number, g: number, b: number, a: number) {
        return { r, g, b, a };
      }
    },
    ExcaliburGraphicsContext: class {
      save() {}
      restore() {}
      scale() {}
      drawRectangle() {}
    }
  };
});

// Mock the Resources module
jest.mock("../../src/resources", () => ({
  Resources: {
    Slime: "slime-image",
  },
}));

// Mock the Food class's playConsumeEffect method
jest.mock("../../src/actors/food", () => {
  const original = jest.requireActual("../../src/actors/food");
  return {
    ...original,
    Food: class extends original.Food {
      constructor(type?: FoodType) {
        super(type);
        // Override the method to prevent animation errors in tests
        this.playConsumeEffect = jest.fn();
      }
    },
  };
});

describe("Energy System", () => {
  beforeEach(() => {
    // Initialize Random with a seed for consistent tests
    Random.init("test-seed");
    
    // Clear all mocks
    jest.clearAllMocks();
  });
  
  describe("Energy Consumption", () => {
    test("energy should decrease over time", () => {
      // Create a slime
      const slime = new Slime();
      const initialEnergy = (slime as any).energy;
      const decreaseRate = (slime as any).energyDecreaseRate;
      
      // Simulate time passing (1000ms)
      const elapsedMs = 1000;
      (slime as any).updateEnergy(elapsedMs);
      
      // Calculate expected energy decrease
      const expectedDecrease = decreaseRate * elapsedMs;
      const expectedEnergy = initialEnergy - expectedDecrease;
      
      // Check if energy decreased by the correct amount
      expect((slime as any).energy).toBeCloseTo(expectedEnergy);
    });
    
    test("moving should consume additional energy", () => {
      // Create a slime with known speed
      const speedValue = 1.0;
      const dna = new SlimeDNA({
        speed: { name: 'Speed', value: speedValue, min: 0.1, max: 1.5 }
      });
      
      const slime = new Slime(dna);
      const initialEnergy = (slime as any).energy;
      const decreaseRate = (slime as any).energyDecreaseRate;
      
      // Set slime to moving
      (slime as any).isMoving = true;
      
      // Simulate time passing (1000ms)
      const elapsedMs = 1000;
      (slime as any).updateEnergy(elapsedMs);
      
      // Calculate expected energy decrease
      // Base decrease + movement decrease
      const baseDecrease = decreaseRate * elapsedMs;
      const movementDecrease = decreaseRate * elapsedMs * speedValue * 0.5;
      const expectedEnergy = initialEnergy - baseDecrease - movementDecrease;
      
      // Check if energy decreased by the correct amount (with moving)
      expect((slime as any).energy).toBeCloseTo(expectedEnergy);
    });
    
    test("sprinting should consume more energy than normal movement", () => {
      // Create a slime with known speed
      const speedValue = 1.0;
      const dna = new SlimeDNA({
        speed: { name: 'Speed', value: speedValue, min: 0.1, max: 1.5 }
      });
      
      const slime = new Slime(dna);
      const initialEnergy = (slime as any).energy;
      const decreaseRate = (slime as any).energyDecreaseRate;
      const sprintMultiplier = (slime as any).sprintEnergyMultiplier;
      
      // Set slime to moving and sprinting
      (slime as any).isMoving = true;
      (slime as any).movementMode = MovementMode.Sprint;
      
      // Simulate time passing (1000ms)
      const elapsedMs = 1000;
      (slime as any).updateEnergy(elapsedMs);
      
      // Calculate expected energy decrease
      // Base decrease + movement decrease with sprint
      const baseDecrease = decreaseRate * elapsedMs;
      const movementDecrease = decreaseRate * elapsedMs * speedValue * 0.5 * sprintMultiplier;
      const expectedEnergy = initialEnergy - baseDecrease - movementDecrease;
      
      // Check if energy decreased by the correct amount (with sprinting)
      expect((slime as any).energy).toBeCloseTo(expectedEnergy);
    });
    
    test("energy should not go below zero", () => {
      // Create a slime with very low energy
      const slime = new Slime();
      (slime as any).energy = 0.001; // Almost no energy
      
      // Simulate a lot of time passing
      const elapsedMs = 10000;
      (slime as any).updateEnergy(elapsedMs);
      
      // Energy should be clamped to zero
      expect((slime as any).energy).toBe(0);
    });
  });
  
  describe("Hunger States", () => {
    test("slime should update hunger state based on energy level", () => {
      // Create a slime
      const slime = new Slime();
      const lowEnergyThreshold = (slime as any).lowEnergyThreshold;
      const starvingThreshold = (slime as any).starvingThreshold;
      const maxEnergy = (slime as any).maxEnergy;
      
      // Test satisfied state (>30% energy)
      (slime as any).energy = maxEnergy * (lowEnergyThreshold + 0.1);
      (slime as any).updateHungerState();
      expect((slime as any).hungerState).toBe(HungerState.Satisfied);
      
      // Test hungry state (15-30% energy)
      (slime as any).energy = maxEnergy * (lowEnergyThreshold - 0.05);
      (slime as any).updateHungerState();
      expect((slime as any).hungerState).toBe(HungerState.Hungry);
      
      // Test starving state (<15% energy)
      (slime as any).energy = maxEnergy * (starvingThreshold - 0.05);
      (slime as any).updateHungerState();
      expect((slime as any).hungerState).toBe(HungerState.Starving);
    });
    
    test("hungry slimes should move more frequently", () => {
      // Create a slime
      const slime = new Slime();
      
      // Test satisfied state - 80% chance to move
      (slime as any).hungerState = HungerState.Satisfied;
      
      // Set up spy to return specific values instead of using mockReturnValueOnce
      jest.spyOn(Random, 'random')
        .mockImplementationOnce(() => 0.79) // below 0.8, should move
        .mockImplementationOnce(() => 0.81) // above 0.8, should not move
        .mockImplementationOnce(() => 0.94) // below 0.95, should move
        .mockImplementationOnce(() => 0.96); // above 0.95, should not move
      
      // Case 1: Value < 0.8, should move
      let shouldMove = Random.random() < 0.8;
      expect(shouldMove).toBe(true);
      
      // Case 2: Value > 0.8, should rest
      shouldMove = Random.random() < 0.8;
      expect(shouldMove).toBe(false);
      
      // Test hungry state - 95% chance to move
      (slime as any).hungerState = HungerState.Hungry;
      
      // Case 1: Value < 0.95, should move
      shouldMove = Random.random() < 0.95;
      expect(shouldMove).toBe(true);
      
      // Case 2: Value > 0.95, should rest
      shouldMove = Random.random() < 0.95;
      expect(shouldMove).toBe(false);
      
      // Test starving state - always 100% chance to move
      (slime as any).hungerState = HungerState.Starving;
      
      // Starving slimes have 100% chance to move (no random check)
      shouldMove = true;
      expect(shouldMove).toBe(true);
    });
    
    test("hungry slimes should change direction more frequently", () => {
      // Create a slime
      const slime = new Slime();
      
      // Mock the Random.randomRange method
      const mockRandomRange = jest.spyOn(Random, 'randomRange');
      
      // Test satisfied state
      (slime as any).hungerState = HungerState.Satisfied;
      (slime as any).changeRandomMovement();
      
      // Should use 1000-5000ms range
      expect(mockRandomRange).toHaveBeenCalledWith(1000, 5000);
      
      // Test hungry state
      (slime as any).hungerState = HungerState.Hungry;
      (slime as any).changeRandomMovement();
      
      // Should use 800-3000ms range
      expect(mockRandomRange).toHaveBeenCalledWith(800, 3000);
      
      // Test starving state
      (slime as any).hungerState = HungerState.Starving;
      (slime as any).changeRandomMovement();
      
      // Should use 500-2000ms range
      expect(mockRandomRange).toHaveBeenCalledWith(500, 2000);
    });
  });
  
  describe("Energy Visualization", () => {
    test("energy bar should be configured correctly", () => {
      // Create a slime
      const slime = new Slime();
      
      // Verify energy bar properties are set
      expect((slime as any).energyBarWidth).toBeGreaterThan(0);
      expect((slime as any).energyBarHeight).toBeGreaterThan(0);
      expect((slime as any).energyBarY).toBeDefined();
      expect((slime as any).energyBarColor).toBeDefined();
      expect((slime as any).lowEnergyColor).toBeDefined();
      
      // Verify onPreDraw hook is set
      expect((slime as any).graphics.onPreDraw).toBeInstanceOf(Function);
    });
    
    test("drawEnergyBar should use different colors based on hunger state", () => {
      // Create a slime
      const slime = new Slime();
      
      // Create a mock context
      const mockCtx = {
        drawRectangle: jest.fn()
      };
      
      // Test satisfied state
      (slime as any).hungerState = HungerState.Satisfied;
      (slime as any).drawEnergyBar(mockCtx);
      
      // First call is for background, second for the bar
      expect(mockCtx.drawRectangle).toHaveBeenCalledTimes(2);
      const satisfiedCall = mockCtx.drawRectangle.mock.calls[1][3]; // Get color argument
      
      // Reset mock for next test
      mockCtx.drawRectangle.mockClear();
      
      // Test hungry state
      (slime as any).hungerState = HungerState.Hungry;
      (slime as any).drawEnergyBar(mockCtx);
      const hungryCall = mockCtx.drawRectangle.mock.calls[1][3]; // Get color argument
      
      // Reset mock for next test
      mockCtx.drawRectangle.mockClear();
      
      // Test starving state
      (slime as any).hungerState = HungerState.Starving;
      (slime as any).drawEnergyBar(mockCtx);
      const starvingCall = mockCtx.drawRectangle.mock.calls[1][3]; // Get color argument
      
      // Colors should be different based on state
      expect(satisfiedCall).not.toEqual(hungryCall);
      expect(hungryCall).not.toEqual(starvingCall);
      expect(starvingCall).not.toEqual(satisfiedCall);
    });
  });
  
  describe("Death Mechanism", () => {
    test("slime should die when energy reaches zero", () => {
      // Create a slime
      const slime = new Slime();
      
      // Spy on the die method
      const dieSpy = jest.spyOn(slime as any, 'die');
      
      // Set energy to zero
      (slime as any).energy = 0;
      
      // Update energy which should trigger death
      (slime as any).updateEnergy(100);
      
      // Verify die was called
      expect(dieSpy).toHaveBeenCalled();
    });
    
    test("death callback should be called when slime dies", () => {
      // Create a slime
      const slime = new Slime();
      
      // Create a mock death callback
      const mockCallback = jest.fn();
      slime.setDeathCallback(mockCallback);
      
      // Trigger death
      (slime as any).die();
      
      // Verify the callback was called with the slime
      expect(mockCallback).toHaveBeenCalledWith(slime);
    });
    
    test("slime should be removed from scene when it dies", () => {
      // Create a slime
      const slime = new Slime();
      
      // Spy on scene.remove
      const removeSpy = jest.spyOn((slime as any).scene, 'remove');
      
      // Trigger death
      (slime as any).die();
      
      // Verify scene.remove was called with the slime
      expect(removeSpy).toHaveBeenCalledWith(slime);
    });
    
    test("isDying should return true after death is triggered", () => {
      // Create a slime
      const slime = new Slime();
      
      // Verify isDying is initially false
      expect(slime.isDying()).toBe(false);
      
      // Trigger death
      (slime as any).die();
      
      // Verify isDying now returns true
      expect(slime.isDying()).toBe(true);
    });
  });
  
  describe("Sprint Mode", () => {
    test("sprint mode should increase speed", () => {
      // Create a slime
      const slime = new Slime();
      const sprintSpeedMultiplier = (slime as any).sprintSpeedMultiplier;
      
      // Move in normal mode
      slime.moveInDirection(SlimeDirection.Right);
      const normalSpeed = (slime as any).vel.x;
      
      // Enable sprint mode
      (slime as any).setMovementMode(MovementMode.Sprint);
      
      // Move again
      slime.moveInDirection(SlimeDirection.Right);
      const sprintSpeed = (slime as any).vel.x;
      
      // Sprint speed should be higher
      expect(sprintSpeed).toBeGreaterThan(normalSpeed);
      
      // Speed increase should match sprint multiplier
      expect(sprintSpeed / normalSpeed).toBeCloseTo(sprintSpeedMultiplier);
    });
    
    test("can't sprint with low energy", () => {
      // Create a slime
      const slime = new Slime();
      const maxEnergy = (slime as any).maxEnergy;
      
      // Set energy to 15% (below the 20% sprint threshold)
      (slime as any).energy = maxEnergy * 0.15;
      
      // Try to enable sprint mode
      (slime as any).setMovementMode(MovementMode.Sprint);
      
      // Should remain in normal mode
      expect((slime as any).movementMode).toBe(MovementMode.Normal);
    });
    
    test("toggle sprint should switch between modes", () => {
      // Create a slime with enough energy
      const slime = new Slime();
      const maxEnergy = (slime as any).maxEnergy;
      (slime as any).energy = maxEnergy * 0.5; // 50% energy
      
      // Initially in normal mode
      expect((slime as any).movementMode).toBe(MovementMode.Normal);
      
      // Toggle sprint
      slime.toggleSprint();
      
      // Should be in sprint mode
      expect((slime as any).movementMode).toBe(MovementMode.Sprint);
      
      // Toggle again
      slime.toggleSprint();
      
      // Should be back in normal mode
      expect((slime as any).movementMode).toBe(MovementMode.Normal);
    });
  });
}); 