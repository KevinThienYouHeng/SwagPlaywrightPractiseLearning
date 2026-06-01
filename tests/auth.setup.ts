import { test as setup, expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
 
  await page.goto('https://www.saucedemo.com/');

  interface LoginCredentials {
    username: string;
    password: string;
  } 

  const credentials: LoginCredentials = {
    username: 'standard_user',
    password: 'secret_sauce',
  };

  await page.locator('[data-test="username"]').fill(credentials.username);
  await page.locator('[data-test="password"]').fill(credentials.password);
  await page.locator('[data-test="login-button"]').click();
  await expect(page).toHaveURL(/.*inventory.html/);
  await page.context().storageState({ path: authFile });
});