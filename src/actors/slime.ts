/**
 * Slime actor for the blob simulation.
 * This module defines the main character controlled in the game.
 */
import {
  Actor,
  Animation,
  CollisionStartEvent,
  Engine,
  Sprite,
  SpriteSheet,
  vec,
  Color,
  ExcaliburGraphicsContext,
} from "excalibur";
import { Resources } from "../resources";
import { SlimeDNA } from "../genetics/slime-dna";
import { Food } from "./food";
import { Random } from "../utils/random";

// Define directions without using keyboard keys
export enum SlimeDirection {
  Up,
  Right,
  Down,
  Left,
}

// Define movement modes
export enum MovementMode {
  Normal,
  Sprint,
}

// Define hunger states
export enum HungerState {
  Satisfied,
  Hungry,
  Starving,
}

const SLIME_RADIUS = 12;
export class Slime extends Actor {
  protected animations: Record<SlimeDirection, Animation>;
  protected idles: Record<SlimeDirection, Sprite>;
  protected currentDirection: SlimeDirection = SlimeDirection.Down;
  protected isMoving = false;
  protected dna: SlimeDNA;
  protected baseSpeed: number = 50;
  protected isDead: boolean = false;
  protected movementMode: MovementMode = MovementMode.Normal;
  protected hungerState: HungerState = HungerState.Satisfied;

  // Event callback for when slime dies
  public onDeathCallback: ((slime: Slime) => void) | null = null;

  // New properties for random movement and energy
  private movementChangeTimer: number = 0;
  private movementChangeDuration: number = 0;
  private energy: number = 50; // Starting energy
  private readonly maxEnergy: number = 100;
  private readonly energyDecreaseRate: number = 0.005; // Energy decrease per ms
  
  // Energy bar properties
  private readonly energyBarWidth: number = 24;
  private readonly energyBarHeight: number = 3;
  private readonly energyBarPadding: number = 2;
  private readonly energyBarY: number = -16; // Position above slime
  private readonly energyBarBgColor: Color = new Color(40, 40, 40, 0.8);
  private readonly energyBarColor: Color = new Color(50, 200, 50, 1);
  private readonly lowEnergyColor: Color = new Color(200, 50, 50, 1);
  private readonly lowEnergyThreshold: number = 0.3; // 30% of max energy
  private readonly starvingThreshold: number = 0.15; // 15% of max energy
  
  // Movement energy factors
  private readonly sprintSpeedMultiplier: number = 1.5;
  private readonly sprintEnergyMultiplier: number = 2.5;

  constructor(dna?: SlimeDNA) {
    super({
      name: "Slime",
      pos: vec(150, 150),
      radius: SLIME_RADIUS,
      scale: vec(1, 1),
    });

    // Use provided DNA or create random DNA
    this.dna = dna || SlimeDNA.createRandom();

    const sheet = SpriteSheet.fromImageSource({
      image: Resources.Slime,
      grid: {
        rows: 3,
        columns: 3,
        spriteWidth: 24,
        spriteHeight: 24,
      },
    });
    const upAnim = Animation.fromSpriteSheet(sheet, [0, 1, 2], 200);
    const rightAnim = Animation.fromSpriteSheet(sheet, [3, 4, 5], 200);
    const downAnim = Animation.fromSpriteSheet(sheet, [6, 7, 8], 200);
    const leftAnim = rightAnim.clone();
    leftAnim.flipHorizontal = true;
    this.animations = {
      [SlimeDirection.Up]: upAnim,
      [SlimeDirection.Right]: rightAnim,
      [SlimeDirection.Down]: downAnim,
      [SlimeDirection.Left]: leftAnim,
    };

    const rightIdle = sheet.getSprite(0, 1);
    const leftIdle = rightIdle.clone();
    leftIdle.flipHorizontal = true;
    this.idles = {
      [SlimeDirection.Up]: sheet.getSprite(0, 0),
      [SlimeDirection.Right]: rightIdle,
      [SlimeDirection.Down]: sheet.getSprite(0, 2),
      [SlimeDirection.Left]: leftIdle,
    };
    
    // Set up the pre-draw hook for the energy bar
    this.graphics.onPreDraw = (ctx: ExcaliburGraphicsContext, _delta: number) => {
      // Don't draw energy bar if dead
      if (this.isDead) return;
      
      // Save the current context state
      ctx.save();
      
      // Counter the slime's scale to make energy bar a consistent size
      const inverseScale = 1 / Math.max(this.scale.x, 0.1);
      ctx.scale(inverseScale, inverseScale);
      
      // Draw the energy bar
      this.drawEnergyBar(ctx);
      
      // Restore the context state
      ctx.restore();
    };
  }

  override onInitialize() {
    // Apply DNA traits to the slime
    this.applyDNATraits();
    this.graphics.use(this.idles[this.currentDirection]);

    // Add collision handler for food
    this.on("collisionstart", (evt: CollisionStartEvent) => {
      // Check if the collision is with food
      if (evt.other.owner.name === "Food") {
        const food = evt.other.owner as unknown as Food;
        this.consumeFood(food);
      }
    });
  }

  private applyDNATraits() {
    // Apply size based on DNA - this will be the slime's permanent size
    // (size should not change based on energy/hunger level)
    const size = this.dna.getGeneValue("size");
    this.scale = vec(size, size);

    // Apply color tint based on DNA
    const dnaColor = this.dna.getColor();
    this.graphics.opacity = 1.0;

    // Apply color to all animations and idle sprites
    Object.values(this.animations).forEach((anim) => {
      anim.tint = dnaColor;
    });

    Object.values(this.idles).forEach((sprite) => {
      sprite.tint = dnaColor;
    });
  }

  public getDNA(): SlimeDNA {
    return this.dna;
  }

  override onPreUpdate(engine: Engine, elapsedMs: number): void {
    // Don't update if dead
    if (this.isDead) return;
    
    // Random movement behavior
    this.updateRandomMovement(elapsedMs);

    // Update energy
    this.updateEnergy(elapsedMs);

    // Check for world boundaries
    this.checkBoundaries(engine);
  }

  override onPostUpdate(_engine: Engine, _elapsedMs: number): void {
    // Don't update if dead
    if (this.isDead) return;
    
    // Update animations based on current movement state
    if (this.isMoving) {
      this.graphics.use(this.animations[this.currentDirection]);
    } else {
      this.graphics.use(this.idles[this.currentDirection]);
    }
  }
  
  /**
   * Draw the energy bar above the slime
   */
  private drawEnergyBar(ctx: ExcaliburGraphicsContext): void {
    // Energy bar now appears at a consistent size regardless of slime scale
    
    // Adjust the Y position based on slime size to ensure the bar stays above the slime
    const yAdjust = SLIME_RADIUS * this.scale.y;
    const energyBarY = this.energyBarY - yAdjust + SLIME_RADIUS;
    
    // Calculate energy bar position
    const energyBarX = -this.energyBarWidth / 2;
    
    // Draw background
    ctx.drawRectangle(
      vec(energyBarX, energyBarY),
      this.energyBarWidth,
      this.energyBarHeight,
      this.energyBarBgColor
    );
    
    // Calculate fill width based on current energy
    const fillWidth = (this.energy / this.maxEnergy) * (this.energyBarWidth - this.energyBarPadding * 2);
    
    // Determine color based on energy level
    let barColor = this.energyBarColor;
    if (this.hungerState === HungerState.Starving) {
      barColor = this.lowEnergyColor;
    } else if (this.hungerState === HungerState.Hungry) {
      // Blend between normal and low energy colors
      barColor = new Color(
        Math.round(this.energyBarColor.r * 0.3 + this.lowEnergyColor.r * 0.7),
        Math.round(this.energyBarColor.g * 0.3 + this.lowEnergyColor.g * 0.7),
        Math.round(this.energyBarColor.b * 0.3 + this.lowEnergyColor.b * 0.7),
        1
      );
    }
    
    // Draw fill only if energy > 0
    if (this.energy > 0) {
      ctx.drawRectangle(
        vec(energyBarX + this.energyBarPadding, energyBarY),
        fillWidth,
        this.energyBarHeight - this.energyBarPadding,
        barColor
      );
    }
  }

  /**
   * Update random movement behavior
   */
  private updateRandomMovement(elapsedMs: number): void {
    // Update timer for direction changes
    this.movementChangeTimer += elapsedMs;

    // Change direction or movement state randomly
    if (this.movementChangeTimer >= this.movementChangeDuration) {
      this.changeRandomMovement();
    }
  }

  /**
   * Change to a random movement direction or state
   */
  private changeRandomMovement(): void {
    // Pick a random direction
    const direction = Random.randomInt(0, 3) as SlimeDirection;
    
    // Determine if slime should move based on hunger state
    let shouldMove = true;
    
    // Satisfied slimes have a chance to stay idle
    if (this.hungerState === HungerState.Satisfied) {
      shouldMove = Random.random() < 0.8; // 80% chance to move
    } 
    // Hungry slimes are more likely to move
    else if (this.hungerState === HungerState.Hungry) {
      shouldMove = Random.random() < 0.95; // 95% chance to move
    }
    // Starving slimes always move
    
    this.moveInDirection(direction, shouldMove);

    // Set a random duration until the next movement change 
    // Hungry slimes change direction more frequently to search for food
    let minDuration = 1000;
    let maxDuration = 5000;
    
    if (this.hungerState === HungerState.Hungry) {
      minDuration = 800;
      maxDuration = 3000;
    } else if (this.hungerState === HungerState.Starving) {
      minDuration = 500;
      maxDuration = 2000;
    }
    
    this.movementChangeDuration = Random.randomRange(minDuration, maxDuration);
    this.movementChangeTimer = 0;
  }

  /**
   * Keep the slime within the world boundaries
   */
  private checkBoundaries(engine: Engine): void {
    const padding = 10; // Padding from the edge
    const effectiveRadius = SLIME_RADIUS * this.scale.x; // Account for scaled size

    // Check right boundary
    if (this.pos.x > engine.drawWidth - padding - effectiveRadius) {
      this.pos.x = engine.drawWidth - padding - effectiveRadius;
      this.moveInDirection(SlimeDirection.Left, true);
      this.movementChangeTimer = 0;
    }

    // Check left boundary
    if (this.pos.x < padding + effectiveRadius) {
      this.pos.x = padding + effectiveRadius;
      this.moveInDirection(SlimeDirection.Right, true);
      this.movementChangeTimer = 0;
    }

    // Check bottom boundary
    if (this.pos.y > engine.drawHeight - padding - effectiveRadius) {
      this.pos.y = engine.drawHeight - padding - effectiveRadius;
      this.moveInDirection(SlimeDirection.Up, true);
      this.movementChangeTimer = 0;
    }

    // Check top boundary
    if (this.pos.y < padding + effectiveRadius) {
      this.pos.y = padding + effectiveRadius;
      this.moveInDirection(SlimeDirection.Down, true);
      this.movementChangeTimer = 0;
    }
  }

  /**
   * Consume food and gain energy
   */
  private consumeFood(food: Food): void {
    // Get nutritional value from food
    const nutritionalValue = food.consume();

    // If food is already being consumed, do nothing
    if (nutritionalValue === 0) {
      return;
    }

    // Apply energy efficiency from DNA
    const efficiency = this.dna.getGeneValue("energyEfficiency");
    const energyGain = nutritionalValue * efficiency;

    // Add energy, capped at max
    this.energy = Math.min(this.maxEnergy, this.energy + energyGain);
  }

  /**
   * Update the slime's energy
   */
  private updateEnergy(elapsedMs: number): void {
    // Decrease energy over time
    this.energy -= this.energyDecreaseRate * elapsedMs;

    // If moving, spend extra energy
    if (this.isMoving) {
      // Speed and movement mode affect energy consumption
      const speedMultiplier = this.dna.getGeneValue("speed");
      let energyConsumptionMultiplier = speedMultiplier * 0.5;
      
      // Apply extra consumption for sprint mode
      if (this.movementMode === MovementMode.Sprint) {
        energyConsumptionMultiplier *= this.sprintEnergyMultiplier;
      }
      
      this.energy -= this.energyDecreaseRate * elapsedMs * energyConsumptionMultiplier;
    }

    // Make sure energy doesn't go below 0
    this.energy = Math.max(0, this.energy);

    // Update hunger state based on energy level
    this.updateHungerState();

    // If energy is 0, slime dies
    if (this.energy === 0 && !this.isDead) {
      this.die();
    }
  }
  
  /**
   * Update the slime's hunger state based on current energy level
   */
  private updateHungerState(): void {
    const energyRatio = this.energy / this.maxEnergy;
    
    if (energyRatio <= this.starvingThreshold) {
      this.hungerState = HungerState.Starving;
    } else if (energyRatio <= this.lowEnergyThreshold) {
      this.hungerState = HungerState.Hungry;
    } else {
      this.hungerState = HungerState.Satisfied;
    }
  }
  
  /**
   * Handle slime death
   */
  private die(): void {
    this.isDead = true;
    this.isMoving = false;
    this.vel = vec(0, 0);
    
    // Fade out the slime
    this.actions.fade(0, 1000).callMethod(() => {
      // Remove from scene if it exists
      if (this.scene) {
        this.scene.remove(this);
      }
      
      // Notify callback if set
      if (this.onDeathCallback) {
        this.onDeathCallback(this);
      }
    });
  }

  /**
   * Set the callback for when this slime dies
   */
  public setDeathCallback(callback: (slime: Slime) => void): void {
    this.onDeathCallback = callback;
  }

  // Method for AI to control slime movement
  public moveInDirection(
    direction: SlimeDirection,
    shouldMove: boolean = true
  ): void {
    const speedMultiplier = this.dna.getGeneValue("speed");
    let velocity = this.baseSpeed * speedMultiplier;
    
    // Apply sprint speed modifier if in sprint mode
    if (this.movementMode === MovementMode.Sprint) {
      velocity *= this.sprintSpeedMultiplier;
    }

    this.currentDirection = direction;
    this.isMoving = shouldMove;

    if (!shouldMove) {
      this.vel = vec(0, 0);
      return;
    }

    switch (direction) {
      case SlimeDirection.Up:
        this.vel = vec(0, -velocity);
        break;
      case SlimeDirection.Right:
        this.vel = vec(velocity, 0);
        break;
      case SlimeDirection.Down:
        this.vel = vec(0, velocity);
        break;
      case SlimeDirection.Left:
        this.vel = vec(-velocity, 0);
        break;
    }
  }
  
  /**
   * Set the movement mode (normal or sprint)
   */
  public setMovementMode(mode: MovementMode): void {
    // Only allow sprint if slime has enough energy
    if (mode === MovementMode.Sprint && this.energy < this.maxEnergy * 0.2) {
      // Not enough energy to sprint
      return;
    }
    
    this.movementMode = mode;
    
    // Update velocity if already moving
    if (this.isMoving) {
      this.moveInDirection(this.currentDirection, true);
    }
  }
  
  /**
   * Toggle sprint mode
   */
  public toggleSprint(): void {
    const newMode = this.movementMode === MovementMode.Normal 
      ? MovementMode.Sprint 
      : MovementMode.Normal;
    this.setMovementMode(newMode);
  }

  // Stop the slime from moving
  public stopMoving(): void {
    this.isMoving = false;
    this.vel = vec(0, 0);
  }

  // Create a new slime by combining DNA with another slime
  public reproduce(other: Slime): Slime {
    const childDNA = SlimeDNA.combine(this.dna, other.getDNA());
    return new Slime(childDNA);
  }

  // Get the slime's current energy level
  public getEnergy(): number {
    return this.energy;
  }

  // Get the slime's maximum energy capacity
  public getMaxEnergy(): number {
    return this.maxEnergy;
  }

  // Get the slime's energy efficiency from DNA
  public getEnergyEfficiency(): number {
    return this.dna.getGeneValue("energyEfficiency");
  }

  // Get the slime's sense radius from DNA
  public getSenseRadius(): number {
    return this.dna.getGeneValue("senseRadius");
  }

  /**
   * Check if slime is dead
   */
  public isDying(): boolean {
    return this.isDead;
  }

  /**
   * Get the slime's current hunger state
   */
  public getHungerState(): HungerState {
    return this.hungerState;
  }
  
  /**
   * Check if slime is hungry or starving
   */
  public isHungry(): boolean {
    return this.hungerState !== HungerState.Satisfied;
  }
}
