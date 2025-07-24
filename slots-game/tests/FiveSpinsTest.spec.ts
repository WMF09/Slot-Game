import { test, expect } from '@playwright/test';

test('Test Slot Local - Repeated Click', async ({ page }) => {
  // Navigate to the page
  await page.goto('http://localhost:9000/');

  // Define the position to click (using the first position from your original test)
  const clickPosition = { x: 639, y: 587 };
  
  // Click the same position 5 times
  for (let i = 0; i < 5; i++) {
    await page.locator('canvas').click({
      position: clickPosition,
      delay: 4500 // Adding a small delay between clicks for more realistic interaction
    });
    
    // Optional: Add a brief wait between clicks if needed
    await page.waitForTimeout(200);
  }

  // Verify canvas is still visible after all clicks
  await expect(page.locator('canvas')).toBeVisible();

  // Optional: Add a screenshot for visual verification
  await page.screenshot({ path: 'after-clicks.png' });

  await page.close();

});