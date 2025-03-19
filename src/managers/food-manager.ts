/**
 * Food Manager for the blob simulation.
 * This module handles spawning and lifecycle of food resources.
 */
import { Engine, vec } from "excalibur";
import { Food, FoodType } from "../actors/food";
import { Random } from "../utils/random";

export interface FoodConfig {
  initialCount: number;
  spawnRate: number; // Food per second
  maxCount: number;
  spawnAreaPadding: number; // Percentage of screen edges to avoid (0-0.5)
  specialFoodChance: number; // Chance of spawning special food (0-1)
  premiumFoodChance: number; // Chance of spawning premium food (0-1)
}

export class FoodManager {
  private engine: Engine;
  private foods: Food[] = [];
  private config: FoodConfig;
  private timeSinceLastSpawn: number = 0;
  
  constructor(engine: Engine, config?: Partial<FoodConfig>) {
    this.engine = engine;
    this.config = {
      initialCount: config?.initialCount ?? 30,
      spawnRate: config?.spawnRate ?? 0.5, // Default: spawn 1 food every 2 seconds
      maxCount: config?.maxCount ?? 50,
      spawnAreaPadding: config?.spawnAreaPadding ?? 0.1, // 10% padding from edges by default
      specialFoodChance: config?.specialFoodChance ?? 0.05, // 5% chance for special food
      premiumFoodChance: config?.premiumFoodChance ?? 0.15, // 15% chance for premium food
    };
  }
  
  /**
   * Initialize the food manager by creating the initial food items
   * @returns Array of created food items to be added to the scene
   */
  public initialize(): Food[] {
    // Clear any existing food
    this.foods = [];
    
    // Create initial food
    for (let i = 0; i < this.config.initialCount; i++) {
      const food = this.spawnFood();
      if (food) {
        this.registerFood(food);
      }
    }
    
    return [...this.foods];
  }
  
  /**
   * Update method to be called during the level's update cycle
   * @param elapsedMs Elapsed milliseconds since last update
   * @returns Array of new food created during this update (to be added to the scene)
   */
  public update(elapsedMs: number): Food[] {
    const newFoods: Food[] = [];
    
    if (this.foods.length < this.config.maxCount) {
      this.timeSinceLastSpawn += elapsedMs;
      
      // Calculate how many food items should spawn based on elapsed time
      const spawnInterval = 1000 / this.config.spawnRate;
      while (this.timeSinceLastSpawn >= spawnInterval && 
             this.foods.length < this.config.maxCount) {
        const food = this.spawnFood();
        if (food) {
          this.registerFood(food);
          newFoods.push(food);
          this.timeSinceLastSpawn -= spawnInterval;
        }
      }
    }
    
    return newFoods;
  }
  
  /**
   * Register a new food item with the manager
   * @param food The food to register
   */
  private registerFood(food: Food): void {
    this.foods.push(food);
    
    // Set up callback for when this food is consumed
    food.setConsumedCallback((consumedFood) => {
      this.removeFood(consumedFood);
    });
  }
  
  /**
   * Remove a food item from the manager tracking
   * @param food The food to remove
   */
  public removeFood(food: Food): void {
    const index = this.foods.indexOf(food);
    if (index !== -1) {
      this.foods.splice(index, 1);
    }
  }
  
  /**
   * Get the current food count
   */
  public getFoodCount(): number {
    return this.foods.length;
  }
  
  /**
   * Get all managed food items
   */
  public getAllFood(): Food[] {
    return [...this.foods];
  }
  
  /**
   * Generate a random position for a new food item
   * @returns Valid spawn position or null if couldn't find a position
   */
  private generateRandomPosition(): { x: number, y: number } | null {
    const padding = this.config.spawnAreaPadding;
    const minX = this.engine.drawWidth * padding;
    const maxX = this.engine.drawWidth * (1 - padding);
    const minY = this.engine.drawHeight * padding;
    const maxY = this.engine.drawHeight * (1 - padding);
    
    // Try to find a valid position within a certain number of attempts
    const maxAttempts = 20;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const x = Random.randomRange(minX, maxX);
      const y = Random.randomRange(minY, maxY);
      
      // Check distance from all existing food items
      let validPosition = true;
      for (const existingFood of this.foods) {
        const dx = existingFood.pos.x - x;
        const dy = existingFood.pos.y - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // If too close to another food, try a new position
        if (distance < 20) { // Minimum distance between food items
          validPosition = false;
          break;
        }
      }
      
      if (validPosition) {
        return { x, y };
      }
    }
    
    // Couldn't find a valid position after all attempts
    return null;
  }
  
  /**
   * Determine the type of food to spawn based on probabilities
   */
  private determineFoodType(): FoodType {
    const rand = Random.random();
    if (rand < this.config.specialFoodChance) {
      return FoodType.Special;
    } else if (rand < this.config.specialFoodChance + this.config.premiumFoodChance) {
      return FoodType.Premium;
    } else {
      return FoodType.Basic;
    }
  }
  
  /**
   * Create a new food with determined type at a valid position
   * @returns The new food or null if couldn't create one
   */
  private spawnFood(): Food | null {
    const position = this.generateRandomPosition();
    if (!position) {
      return null;
    }
    
    // Determine food type
    const foodType = this.determineFoodType();
    
    // Create food
    const food = new Food(foodType);
    food.pos = vec(position.x, position.y);
    
    return food;
  }
  
  /**
   * Update food manager configuration
   * @param config New configuration (partial)
   */
  public updateConfig(config: Partial<FoodConfig>): void {
    this.config = {
      ...this.config,
      ...config
    };
  }
} 