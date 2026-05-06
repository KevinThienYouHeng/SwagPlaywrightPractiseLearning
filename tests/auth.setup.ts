import { test as setup, expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  // 1. Navigate to the login page
  await page.goto('https://www.saucedemo.com/');

  
  interface LoginCredentials {
    username: string;
    password: string;
  } 

  const credentials: LoginCredentials = {
    username: 'standard_user',
    password: 'secret_sauce',
  };

  // 2. Fill in credentials (Standard User)
  //await page.locator('[data-test="username"]').fill('standard_user');
  //await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="username"]').fill(credentials.username);
  //await page.locator('[data-test="username"]').fill(credentials.password);
  await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();

  // 3. Verify login was successful (Wait for the inventory page)
  await expect(page).toHaveURL(/.*inventory.html/);

  // 4. Save the storage state (cookies, local storage) to a file
  await page.context().storageState({ path: authFile });
});