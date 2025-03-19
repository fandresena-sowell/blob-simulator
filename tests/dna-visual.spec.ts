import { test, expect } from '@playwright/test';
import { stabilizeForScreenshot, resumeGameEngine } from './test-helpers';

// Visual verification that slimes have random traits
test('slimes should have varied appearances', async ({ page }) => {
  // Navigate to the game page with a seed parameter to get consistent randomness
  await page.goto('http://localhost:4173/?seed=test-seed-123');
  
  // Start the game
  await page.click('#excalibur-play');
  
  // Wait for the game to initialize
  await page.waitForTimeout(750);
  
  // Stabilize the game by pausing the engine and animations before taking the screenshot
  await stabilizeForScreenshot(page);
  
  try {
    // Take screenshot for verification of trait variation
    await expect(page).toHaveScreenshot('slime-variety.png');
  } finally {
    // Always resume the game engine, even if the screenshot comparison fails
    await resumeGameEngine(page);
  }
});
 