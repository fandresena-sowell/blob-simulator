import {
  Actor,
  Animation,
  Collider,
  CollisionContact,
  Engine,
  Keys,
  Side,
  Sprite,
  SpriteSheet,
  vec,
} from "excalibur";
import { Resources } from "../resources";

type Direction = Keys.Up | Keys.Right | Keys.Down | Keys.Left;

export class Slime extends Actor {
  protected animations: Record<Direction, Animation>;
  protected idles: Record<Direction, Sprite>;
  protected currentDirection: Direction = Keys.Down;
  protected isSprinting = false;
  constructor() {
    super({
      name: "Slime",
      pos: vec(150, 150),
      width: 24,
      height: 24,
      scale: vec(1, 1),
    });

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
      [Keys.Up]: upAnim,
      [Keys.Right]: rightAnim,
      [Keys.Down]: downAnim,
      [Keys.Left]: leftAnim,
    };

    const rightIdle = sheet.getSprite(0, 1);
    const leftIdle = rightIdle.clone();
    leftIdle.flipHorizontal = true;
    this.idles = {
      [Keys.Up]: sheet.getSprite(0, 0),
      [Keys.Right]: rightIdle,
      [Keys.Down]: sheet.getSprite(0, 2),
      [Keys.Left]: leftIdle,
    };
  }

  override onInitialize() {
    this.graphics.use(this.idles[this.currentDirection]);
  }

  override onPreUpdate(engine: Engine, elapsedMs: number): void {
    this.vel = vec(0, 0);
    this.isSprinting = engine.input.keyboard.isHeld(Keys.Space);
  }

  override onPostUpdate(engine: Engine, elapsedMs: number): void {
    const velocity = this.isSprinting ? 100 : 50;
    if (engine.input.keyboard.isHeld(Keys.Up)) {
      this.currentDirection = Keys.Up;
      this.vel = vec(0, -velocity);
    }
    if (engine.input.keyboard.isHeld(Keys.Right)) {
      this.currentDirection = Keys.Right;
      this.vel = vec(velocity, 0);
    }
    if (engine.input.keyboard.isHeld(Keys.Down)) {
      this.currentDirection = Keys.Down;
      this.vel = vec(0, velocity);
    }
    if (engine.input.keyboard.isHeld(Keys.Left)) {
      this.currentDirection = Keys.Left;
      this.vel = vec(-velocity, 0);
    }
    if (this.vel.x !== 0 || this.vel.y !== 0) {
      this.graphics.use(this.animations[this.currentDirection]);
    } else {
      this.graphics.use(this.idles[this.currentDirection]);
    }
  }

  override onPreCollisionResolve(
    self: Collider,
    other: Collider,
    side: Side,
    contact: CollisionContact
  ): void {
    // Called before a collision is resolved, if you want to opt out of this specific collision call contact.cancel()
  }

  override onPostCollisionResolve(
    self: Collider,
    other: Collider,
    side: Side,
    contact: CollisionContact
  ): void {
    // Called every time a collision is resolved and overlap is solved
  }

  override onCollisionStart(
    self: Collider,
    other: Collider,
    side: Side,
    contact: CollisionContact
  ): void {
    // Called when a pair of objects are in contact
  }

  override onCollisionEnd(
    self: Collider,
    other: Collider,
    side: Side,
    lastContact: CollisionContact
  ): void {
    // Called when a pair of objects separates
  }
}
