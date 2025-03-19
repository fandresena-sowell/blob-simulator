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

const SLIME_RADIUS = 12;
export class Slime extends Actor {
  protected animations: Record<SlimeDirection, Animation>;
  protected idles: Record<SlimeDirection, Sprite>;
  protected currentDirection: SlimeDirection = SlimeDirection.Down;
  protected isMoving = false;
  protected dna: SlimeDNA;
  protected baseSpeed: number = 50;

  // New properties for random movement and energy
  private movementChangeTimer: number = 0;
  private movementChangeDuration: number = 0;
  private energy: number = 50; // Starting energy
  private readonly maxEnergy: number = 100;
  private readonly energyDecreaseRate: number = 0.005; // Energy decrease per ms

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
  }

  override onInitialize() {
    // Apply DNA traits to the slime
    this.applyDNATraits();
    this.graphics.use(this.idles[this.currentDirection]);

    // Add collision handler for food
    this.on("collisionstart", (evt: CollisionStartEvent) => {
      console.log("collisionstart", evt);
      console.log("other owner", evt.other.owner);
      // Check if the collision is with food
      if (evt.other.owner.name === "Food") {
        const food = evt.other.owner as unknown as Food;
        this.consumeFood(food);
      }
    });
  }

  private applyDNATraits() {
    // Apply size based on DNA
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
    // Random movement behavior
    this.updateRandomMovement(elapsedMs);

    // Update energy
    this.updateEnergy(elapsedMs);

    // Check for world boundaries
    this.checkBoundaries(engine);
  }

  override onPostUpdate(_engine: Engine, _elapsedMs: number): void {
    // Update animations based on current movement state
    if (this.isMoving) {
      this.graphics.use(this.animations[this.currentDirection]);
    } else {
      this.graphics.use(this.idles[this.currentDirection]);
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
    this.moveInDirection(direction, true);

    // Set a random duration until the next movement change (1-5 seconds)
    this.movementChangeDuration = Random.randomRange(1000, 5000);
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
      // Speed affects energy consumption
      const speedMultiplier = this.dna.getGeneValue("speed");
      this.energy -=
        this.energyDecreaseRate * elapsedMs * speedMultiplier * 0.5;
    }

    // Make sure energy doesn't go below 0
    this.energy = Math.max(0, this.energy);

    // Future: If energy is 0, slime could die or enter a dormant state
  }

  // Method for AI to control slime movement
  public moveInDirection(
    direction: SlimeDirection,
    shouldMove: boolean = true
  ): void {
    const speedMultiplier = this.dna.getGeneValue("speed");
    const velocity = this.baseSpeed * speedMultiplier;

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
}
