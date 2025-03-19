import { test, expect } from '@playwright/test';

// Visual verification that slimes have random traits
test('slimes should have varied appearances', async ({ page }) => {
  // Navigate to the game page with a seed parameter to get consistent randomness
  await page.goto('http://localhost:4173/?seed=test-seed-123');
  
  // Start the game
  await page.click('#excalibur-play');
  
  // Wait for the game to initialize
  await page.waitForTimeout(2000);
  
  // Take screenshot for verification of trait variation
  await expect(page).toHaveScreenshot('slime-variety.png');
});
 