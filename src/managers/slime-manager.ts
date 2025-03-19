/**
 * Slime Manager for the blob simulation.
 * This module handles spawning and lifecycle of slimes in the ecosystem.
 */
import { Engine, vec } from "excalibur";
import { Slime } from "../actors/slime";
import { SlimeDNA } from "../genetics/slime-dna";
import { Random } from "../utils/random";

export interface SpawnConfig {
  initialPopulation: number;
  spawnRate: number; // Slimes per second
  maxPopulation: number;
  spawnAreaPadding: number; // Percentage of screen edges to avoid (0-0.5)
}

export class SlimeManager {
  private engine: Engine;
  private slimes: Slime[] = [];
  private config: SpawnConfig;
  private timeSinceLastSpawn: number = 0;
  
  constructor(engine: Engine, config?: Partial<SpawnConfig>) {
    this.engine = engine;
    this.config = {
      initialPopulation: config?.initialPopulation ?? 20,
      spawnRate: config?.spawnRate ?? 0.2, // Default: spawn 1 slime every 5 seconds
      maxPopulation: config?.maxPopulation ?? 100,
      spawnAreaPadding: config?.spawnAreaPadding ?? 0.1, // 10% padding from edges by default
    };
  }
  
  /**
   * Initialize the manager by creating the initial population
   * @returns Array of created slimes to be added to the scene
   */
  public initialize(): Slime[] {
    // Clear any existing slimes
    this.slimes = [];
    
    // Create initial population
    for (let i = 0; i < this.config.initialPopulation; i++) {
      const slime = this.spawnSlime();
      if (slime) {
        this.slimes.push(slime);
      }
    }
    
    return [...this.slimes];
  }
  
  /**
   * Update method to be called during the level's update cycle
   * @param elapsedMs Elapsed milliseconds since last update
   * @returns Array of new slimes created during this update (to be added to the scene)
   */
  public update(elapsedMs: number): Slime[] {
    const newSlimes: Slime[] = [];
    
    if (this.slimes.length < this.config.maxPopulation) {
      this.timeSinceLastSpawn += elapsedMs;
      
      // Calculate how many slimes should spawn based on elapsed time
      const spawnInterval = 1000 / this.config.spawnRate;
      while (this.timeSinceLastSpawn >= spawnInterval && 
             this.slimes.length < this.config.maxPopulation) {
        const slime = this.spawnSlime();
        if (slime) {
          this.slimes.push(slime);
          newSlimes.push(slime);
          this.timeSinceLastSpawn -= spawnInterval;
        }
      }
    }
    
    return newSlimes;
  }
  
  /**
   * Remove a slime from the manager tracking
   * @param slime The slime to remove
   */
  public removeSlime(slime: Slime): void {
    const index = this.slimes.indexOf(slime);
    if (index !== -1) {
      this.slimes.splice(index, 1);
    }
  }
  
  /**
   * Get the current slime population
   */
  public getPopulation(): number {
    return this.slimes.length;
  }
  
  /**
   * Get all managed slimes
   */
  public getSlimes(): Slime[] {
    return [...this.slimes];
  }
  
  /**
   * Generate a random position for a new slime
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
      
      // Check distance from all existing slimes
      let validPosition = true;
      for (const existingSlime of this.slimes) {
        const dx = existingSlime.pos.x - x;
        const dy = existingSlime.pos.y - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // If too close to another slime, try a new position
        if (distance < 30) { // Minimum distance between slimes
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
   * Create a new slime with random DNA at a valid position
   * @returns The new slime or null if couldn't create one
   */
  private spawnSlime(): Slime | null {
    const position = this.generateRandomPosition();
    if (!position) {
      return null;
    }
    
    // Create slime with random DNA
    const slime = new Slime(SlimeDNA.createRandom());
    slime.pos = vec(position.x, position.y);
    slime.stopMoving(); // Slimes start idle
    
    return slime;
  }
  
  /**
   * Update slime manager configuration
   * @param config New configuration (partial)
   */
  public updateConfig(config: Partial<SpawnConfig>): void {
    this.config = {
      ...this.config,
      ...config
    };
  }
} 