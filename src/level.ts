import {
  DefaultLoader,
  Engine,
  ExcaliburGraphicsContext,
  Scene,
  SceneActivationContext,
  vec,
} from "excalibur";
import { Slime } from "./actors/slime";
import { SlimeDNA } from "./genetics/slime-dna";
import { Random } from "./utils/random";

export class MyLevel extends Scene {
  private slimes: Slime[] = [];

  override onInitialize(engine: Engine): void {
    // Create slimes with random DNA
    for (let i = 0; i < 20; i++) {
      let validPosition = false;
      let randomX, randomY;

      // Keep trying positions until we find one with no collisions
      while (!validPosition) {
        randomX =
          Random.random() * engine.drawWidth * 0.8 + engine.drawWidth * 0.1;
        randomY =
          Random.random() * engine.drawHeight * 0.8 + engine.drawHeight * 0.1;

        // Check distance from all existing slimes
        validPosition = true;
        for (const existingSlime of this.slimes) {
          const dx = existingSlime.pos.x - randomX;
          const dy = existingSlime.pos.y - randomY;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // If too close to another slime, try a new position
          if (distance < 30) {
            // minimum distance between slimes
            validPosition = false;
            break;
          }
        }
      }
      const slime = new Slime(SlimeDNA.createRandom());
      slime.pos = vec(randomX!, randomY!);

      // All slimes are idle by default
      slime.stopMoving();
      this.slimes.push(slime);
      this.add(slime);
    }
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
    // Future AI behavior will be implemented here
    // Currently, slimes don't move on their own
  }

  override onPreDraw(ctx: ExcaliburGraphicsContext, elapsedMs: number): void {
    // Called before Excalibur draws to the screen
  }

  override onPostDraw(ctx: ExcaliburGraphicsContext, elapsedMs: number): void {
    // Called after Excalibur draws to the screen
  }
}
