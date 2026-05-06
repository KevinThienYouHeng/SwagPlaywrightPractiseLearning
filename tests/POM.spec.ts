import { test } from '@playwright/test';
import { LoginPage } from './LoginPage';
import { InventoryPage } from './InventoryPage';

test('User can add item to cart using POM', async ({ page }) => {
  // 1. Initialize Pages
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);

  // 2. Perform actions using our page classes
  await loginPage.goToLoginPage();
  //await loginPage.login('standard_user', 'secret_sauce'); // Not needed because we are using storageState

  await inventoryPage.addProductToCart('Sauce Labs Backpack');
  
  // 3. Assert result
  await inventoryPage.verifyCartCount('1');
});