import {
  DefaultLoader,
  Engine,
  ExcaliburGraphicsContext,
  Scene,
  SceneActivationContext,
  vec,
  Color,
  Text,
  Actor,
  Font,
  FontUnit,
} from "excalibur";
import { Slime } from "./actors/slime";
import { SlimeManager, SpawnConfig } from "./managers/slime-manager";
import { FoodManager, FoodConfig } from "./managers/food-manager";

export class MyLevel extends Scene {
  private slimes: Slime[] = [];
  private slimeManager!: SlimeManager; // Using definite assignment assertion
  private spawnConfig: SpawnConfig = {
    initialPopulation: 20,
    spawnRate: 0.2, // 1 slime every 5 seconds
    maxPopulation: 100,
    spawnAreaPadding: 0.1,
  };
  private populationTextActor!: Actor;
  
  // Add food management
  private foodManager!: FoodManager;
  private foodConfig: FoodConfig = {
    initialCount: 40,
    spawnRate: 0.3, // Food per second
    maxCount: 60,
    spawnAreaPadding: 0.1,
    specialFoodChance: 0.05,
    premiumFoodChance: 0.15,
  };
  private foodCountTextActor!: Actor;

  override onInitialize(engine: Engine): void {
    // Initialize the slime manager
    this.slimeManager = new SlimeManager(engine, this.spawnConfig);
    
    // Initialize the food manager
    this.foodManager = new FoodManager(engine, this.foodConfig);
    
    // Create UI displays
    this.createPopulationDisplay();
    this.createFoodCountDisplay();
    
    // Create initial population of slimes
    const initialSlimes = this.slimeManager.initialize();
    
    // Add all initial slimes to the scene
    initialSlimes.forEach(slime => {
      this.slimes.push(slime);
      this.add(slime);
    });
    
    // Create initial food items
    const initialFood = this.foodManager.initialize();
    
    // Add all initial food to the scene
    initialFood.forEach(food => {
      this.add(food);
    });
    
    // Update the UI displays
    this.updatePopulationText();
    this.updateFoodCountText();
  }

  /**
   * Create the population display UI element
   */
  private createPopulationDisplay(): void {
    const populationText = new Text({
      text: `Slimes: 0/0`,
      font: new Font({
        family: 'Arial',
        size: 16,
        unit: FontUnit.Px,
      }),
      color: Color.White,
    });
    
    this.populationTextActor = new Actor({
      pos: vec(100, 20),
    });
    
    this.populationTextActor.graphics.use(populationText);
    this.add(this.populationTextActor);
  }
  
  /**
   * Create the food count display UI element
   */
  private createFoodCountDisplay(): void {
    const foodCountText = new Text({
      text: `Food: 0/0`,
      font: new Font({
        family: 'Arial',
        size: 16,
        unit: FontUnit.Px,
      }),
      color: Color.White,
    });
    
    this.foodCountTextActor = new Actor({
      pos: vec(100, 50), // Position below population text
    });
    
    this.foodCountTextActor.graphics.use(foodCountText);
    this.add(this.foodCountTextActor);
  }

  override onPreLoad(loader: DefaultLoader): void {
    // Add any scene specific resources to load
  }

  override onActivate(context: SceneActivationContext<unknown>): void {
    // Called when Excalibur transitions to this scene
  }

  override onDeactivate(context: SceneActivationContext): void {
    // Called when Excalibur transitions away from this scene
  }

  override onPreUpdate(engine: Engine, elapsedMs: number): void {
    // Called before anything updates in the scene
  }

  override onPostUpdate(engine: Engine, elapsedMs: number): void {
    // Spawn new slimes based on configured spawn rate
    const newSlimes = this.slimeManager.update(elapsedMs);
    
    // Add any new slimes to the scene
    newSlimes.forEach(slime => {
      this.slimes.push(slime);
      this.add(slime);
      
      // Optional: Add a visual spawning effect
      this.addSpawnEffect(slime);
    });
    
    // Update food resources
    const newFood = this.foodManager.update(elapsedMs);
    
    // Add any new food to the scene
    newFood.forEach(food => {
      this.add(food);
    });
    
    // Update the UI displays if needed
    if (newSlimes.length > 0) {
      this.updatePopulationText();
    }
    
    if (newFood.length > 0) {
      this.updateFoodCountText();
    }
  }

  override onPreDraw(ctx: ExcaliburGraphicsContext, elapsedMs: number): void {
    // Called before Excalibur draws to the screen
  }

  override onPostDraw(ctx: ExcaliburGraphicsContext, elapsedMs: number): void {
    // Called after Excalibur draws to the screen
  }
  
  /**
   * Update the population text display
   */
  private updatePopulationText(): void {
    const text = this.populationTextActor.graphics.current as Text;
    text.text = `Slimes: ${this.slimeManager.getPopulation()}/${this.spawnConfig.maxPopulation}`;
  }
  
  /**
   * Update the food count text display
   */
  private updateFoodCountText(): void {
    const text = this.foodCountTextActor.graphics.current as Text;
    text.text = `Food: ${this.foodManager.getFoodCount()}/${this.foodConfig.maxCount}`;
  }
  
  /**
   * Add a visual effect when a new slime spawns
   */
  private addSpawnEffect(slime: Slime): void {
    // Future enhancement: Add particles or animation effect
    // For now, just scale the slime up from 0
    const originalScale = slime.scale.clone();
    slime.scale = vec(0, 0);
    
    // Simple grow animation
    const growTime = 500; // ms
    const startTime = Date.now();
    
    const growInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / growTime, 1);
      
      slime.scale = vec(
        originalScale.x * progress,
        originalScale.y * progress
      );
      
      if (progress >= 1) {
        clearInterval(growInterval);
      }
    }, 16); // ~60fps
  }
  
  /**
   * Handle the death of a slime
   */
  public removeSlime(slime: Slime): void {
    // Remove from manager tracking
    this.slimeManager.removeSlime(slime);
    
    // Remove from our local tracking
    const index = this.slimes.indexOf(slime);
    if (index !== -1) {
      this.slimes.splice(index, 1);
    }
    
    // Remove from scene
    slime.kill();
    
    // Update the population display
    this.updatePopulationText();
  }
}
