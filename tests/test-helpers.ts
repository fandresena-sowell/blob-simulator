/**
 * Helper functions for Playwright tests to stabilize visual comparisons
 * by pausing and resuming the Excalibur game engine.
 */
import { Page } from '@playwright/test';

// Include the global type augmentation
declare global {
  interface Window {
    blobSimGame?: any; // Using 'any' since we won't import Excalibur types here
  }
}

/**
 * Pauses the game engine to freeze all animations and physics
 * for stable screenshot comparisons
 */
export const pauseGameEngine = async (page: Page): Promise<void> => {
  await page.evaluate(() => {
    // Access the globally exposed game engine
    const game = window.blobSimGame;
    if (game) {
      // Pause the engine which halts the update loop
      game.clock.stop();
      console.log('Game engine paused for screenshot');
      
      // Optionally, we could also freeze any active timers, animations, etc.
      // that might still be running even when the engine is paused
      return true;
    }
    console.warn('Game engine not found - unable to pause');
    return false;
  });
};

/**
 * Resumes the game engine after taking screenshots
 */
export const resumeGameEngine = async (page: Page): Promise<void> => {
  await page.evaluate(() => {
    const game = window.blobSimGame;
    if (game) {
      // Resume the engine
      game.clock.start();
      console.log('Game engine resumed');
      return true;
    }
    console.warn('Game engine not found - unable to resume');
    return false;
  });
};

/**
 * Stabilizes all on-screen elements by pausing the game engine
 * and optionally freezing any other animations/elements
 */
export const stabilizeForScreenshot = async (page: Page): Promise<void> => {
  // Pause the game engine first
  await pauseGameEngine(page);
  
  // Wait a short time for any visual transitions to complete
  await page.waitForTimeout(100);
  
  // Additional stabilization if needed for specific game elements
  await page.evaluate(() => {
    // Example: Freeze any CSS animations that might still be running
    document.querySelectorAll('*').forEach((el) => {
      const element = el as HTMLElement;
      if (element.style) {
        element.style.animationPlayState = 'paused';
        element.style.transitionDuration = '0s';
      }
    });
    
    // If there are any canvas animations not controlled by the engine
    // they could be paused here as well
    
    return true;
  });
}; 