/**
 * Food actor for the blob simulation.
 * This module defines the food resources that slimes can consume.
 */
import {
  Actor,
  Circle,
  Color,
  CollisionType,
  Engine,
  vec
} from "excalibur";
import { Random } from "../utils/random";

// Different types of food with varying nutritional values
export enum FoodType {
  Basic,
  Premium,
  Special
}

// Define a callback type for when food is consumed
export type FoodConsumedCallback = (food: Food) => void;

export class Food extends Actor {
  private nutritionalValue: number;
  private type: FoodType;
  private static readonly SIZE_RANGE = { min: 5, max: 15 };
  private onConsumed: FoodConsumedCallback | null = null;
  private isBeingConsumed: boolean = false;
  
  constructor(type: FoodType = FoodType.Basic) {
    // Create with random size based on type
    const size = Food.getSizeForType(type);
    
    super({
      name: "Food",
      width: size,
      height: size,
      collisionType: CollisionType.Active // Enable collision detection
    });
    
    this.type = type;
    this.nutritionalValue = Food.getNutritionalValueForType(type);
    
    // Create visual representation
    const foodColor = Food.getColorForType(type);
    this.graphics.use(new Circle({
      radius: size / 2,
      color: foodColor,
    }));
  }
  
  // Get size based on food type
  private static getSizeForType(type: FoodType): number {
    switch(type) {
      case FoodType.Basic:
        return Random.randomRange(Food.SIZE_RANGE.min, Food.SIZE_RANGE.min + 3);
      case FoodType.Premium:
        return Random.randomRange(Food.SIZE_RANGE.min + 3, Food.SIZE_RANGE.min + 6);
      case FoodType.Special:
        return Random.randomRange(Food.SIZE_RANGE.min + 6, Food.SIZE_RANGE.max);
    }
  }
  
  // Get food color based on type
  private static getColorForType(type: FoodType): Color {
    switch(type) {
      case FoodType.Basic:
        return new Color(76, 175, 80); // Green
      case FoodType.Premium:
        return new Color(255, 193, 7); // Amber
      case FoodType.Special:
        return new Color(156, 39, 176); // Purple
    }
  }
  
  // Get nutritional value based on type
  private static getNutritionalValueForType(type: FoodType): number {
    switch(type) {
      case FoodType.Basic:
        return 10;
      case FoodType.Premium:
        return 25;
      case FoodType.Special:
        return 50;
    }
  }
  
  override onInitialize(_engine: Engine): void {
    // Add any initialization logic here
  }
  
  // Get the nutritional value of this food
  public getNutritionalValue(): number {
    return this.nutritionalValue;
  }
  
  // Get the type of this food
  public getType(): FoodType {
    return this.type;
  }
  
  // Set a callback to be called when this food is consumed
  public setConsumedCallback(callback: FoodConsumedCallback): void {
    this.onConsumed = callback;
  }
  
  // Called when consumed by a slime
  public consume(): number {
    if (this.isBeingConsumed) {
      return 0; // Already being consumed
    }
    
    this.isBeingConsumed = true;
    this.playConsumeEffect();
    
    // Notify the manager that this food was consumed
    if (this.onConsumed) {
      this.onConsumed(this);
    }
    
    return this.nutritionalValue;
  }
  
  // Visual effect when being consumed
  public playConsumeEffect(): void {
    // For future enhancement: add particle effects or animation
    const originalScale = this.scale.clone();
    
    // Simple shrink animation
    const shrinkTime = 300; // ms
    const startTime = Date.now();
    
    const shrinkInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / shrinkTime, 1);
      
      this.scale = vec(
        originalScale.x * (1 - progress),
        originalScale.y * (1 - progress)
      );
      
      if (progress >= 1) {
        clearInterval(shrinkInterval);
        this.kill();
      }
    }, 16); // ~60fps
  }
} 