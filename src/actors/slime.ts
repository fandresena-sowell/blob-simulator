/**
 * Slime actor for the blob simulation.
 * This module defines the main character controlled in the game.
 */
import {
  Actor,
  Animation,
  Engine,
  Sprite,
  SpriteSheet,
  vec
} from "excalibur";
import { Resources } from "../resources";
import { SlimeDNA } from "../genetics/slime-dna";

// Define directions without using keyboard keys
export enum SlimeDirection {
  Up,
  Right,
  Down,
  Left
}

export class Slime extends Actor {
  protected animations: Record<SlimeDirection, Animation>;
  protected idles: Record<SlimeDirection, Sprite>;
  protected currentDirection: SlimeDirection = SlimeDirection.Down;
  protected isMoving = false;
  protected dna: SlimeDNA;
  protected baseSpeed: number = 50;

  constructor(dna?: SlimeDNA) {
    super({
      name: "Slime",
      pos: vec(150, 150),
      width: 24,
      height: 24,
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
  }

  private applyDNATraits() {
    // Apply size based on DNA
    const size = this.dna.getGeneValue('size');
    this.scale = vec(size, size);
    
    // Apply color tint based on DNA
    const dnaColor = this.dna.getColor();
    this.graphics.opacity = 1.0;
    
    // Apply color to all animations and idle sprites
    Object.values(this.animations).forEach(anim => {
      anim.tint = dnaColor;
    });
    
    Object.values(this.idles).forEach(sprite => {
      sprite.tint = dnaColor;
    });
  }

  public getDNA(): SlimeDNA {
    return this.dna;
  }

  override onPreUpdate(_engine: Engine, _elapsedMs: number): void {
    // No longer using keyboard input
  }

  override onPostUpdate(_engine: Engine, _elapsedMs: number): void {
    // Update animations based on current movement state
    if (this.isMoving) {
      this.graphics.use(this.animations[this.currentDirection]);
    } else {
      this.graphics.use(this.idles[this.currentDirection]);
    }
  }

  // Method for AI to control slime movement
  public moveInDirection(direction: SlimeDirection, shouldMove: boolean = true): void {
    const speedMultiplier = this.dna.getGeneValue('speed');
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
  
  // Methods for future energy management
  public getEnergyEfficiency(): number {
    return this.dna.getGeneValue('energyEfficiency');
  }
  
  public getSenseRadius(): number {
    return this.dna.getGeneValue('senseRadius');
  }
}
