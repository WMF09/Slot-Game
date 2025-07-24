import { test, expect, request } from '@playwright/test';

test('Test Cyber Egypt Slot', async ({ page }) => {
  await page.goto('https://www.just-slots.com/');
  await expect(page.getByText('Before you proceed, please verify that you are 18 years of age or olderI am 18')).toBeVisible();
  await expect(page.locator('#age_popup')).toContainText('Before you proceed, please verify that you are 18 years of age or older');
  await expect(page.locator('#yes-btn')).toContainText('I am 18 years of age or older');
  await expect(page.locator('#age_popup')).toContainText('By continuing to explore our website, you agree to our Privacy Statement and Terms of Use.');
  await page.getByRole('link', { name: 'I am 18 years of age or older' }).click();
  await expect(page.locator('#cookie_notice')).toContainText('We use cookies to improve your site experience. For more information, please read our Cookie Policy');
  await page.getByRole('link', { name: 'I Accept' }).click();
  await page.getByRole('article').locator('div').first().click();
  await page.getByRole('link', { name: 'Games Games' }).click();
  await expect(page.getByRole('heading')).toContainText('All Games');
  await page.locator('div').filter({ hasText: /^Cyber Egypt$/ }).getByRole('link').first().click();
  await expect(page.locator('.header-cyber')).toBeVisible();
  await expect(page.getByRole('heading')).toContainText('Decode the reels in Cyber Egypt!');
  await expect(page.getByText('Play DemoMarketing PackGame').first()).toBeVisible();
  await page.getByRole('link', { name: 'Play Demo' }).click();
  //await expect(page.locator('#popup_game-item img')).toBeVisible({ timeout: 10_000 });
  await page.waitForLoadState('domcontentloaded');

  await page.locator('#gameIframe').contentFrame().locator('canvas').click({
    position: {
      x: 441,
      y: 370
    }
  });

  //await page.waitForTimeout(30_000);
  
  await page.locator('#gameIframe').contentFrame().locator('canvas').click({
    position: {
      x: 213,
      y: 424
    }
  });
  await page.locator('#gameIframe').contentFrame().locator('canvas').click({
    position: {
      x: 797,
      y: 402
    }
  });
  await page.locator('#gameIframe').contentFrame().locator('canvas').click({
    position: {
      x: 436,
      y: 426
    }
  });
  await page.locator('#popup_game-item img').click();
});