import { test, expect } from '@playwright/test';

test('should see the products page', async ({ page }) => {
  // Navigation goes straight to the inventory because of the storageState
  await page.goto('https://www.saucedemo.com/inventory.html');
  
  const title = await page.locator('.title');
  await expect(title).toHaveText('Products');
});