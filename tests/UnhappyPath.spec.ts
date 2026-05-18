import { expect, test } from '@playwright/test';
import { LoginPage } from './LoginPage';
import { InventoryPage } from './InventoryPage';

test('Login Page with username problem_user', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.goToLoginPage();
    await loginPage.login('problem_user', 'secret_sauce');
    await loginPage.verifyLoginSuccess();
    await page.close();
    
})

//Should failed
test('Login Page with username problem_user and verify image content', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.goToLoginPage();
    await loginPage.login('problem_user', 'secret_sauce');
    await inventoryPage.verifyDifferentImagePerItem();
    
})