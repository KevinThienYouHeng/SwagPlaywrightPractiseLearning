import { test } from '@playwright/test';
import { LoginPage } from './LoginPage';
import { InventoryPage } from './InventoryPage';

test('Login Page', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goToLoginPage();
    await loginPage.login('standard_user', 'secret_sauce');
    await loginPage.verifyLoginSuccess();
    await page.close();
})

test('Login Page with no username ', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goToLoginPage();
    await loginPage.login('', 'secret_sauce');
    await loginPage.verifyErroMessage('Epic sadface: Username is required');
    await page.close();
})

test('Login Page with no password', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goToLoginPage();
    await loginPage.login('standard_user', '');
    await loginPage.verifyErroMessage('Epic sadface: Password is required');
    await page.close();
})

test('Login Page with no username and no password', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goToLoginPage();
    await loginPage.login('', '');
    await loginPage.verifyErroMessage('Epic sadface: Username is required');
    await page.close();
})

test('Login Page with invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goToLoginPage();
    await loginPage.login('Max', 'Lestappen');
    await loginPage.verifyErroMessage('Epic sadface: Username and password do not match any user in this service');
    await page.close();
})

test('Login Page with username locked_out_user', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goToLoginPage();
    await loginPage.login('locked_out_user', 'secret_sauce');
    await loginPage.verifyErroMessage('Epic sadface: Sorry, this user has been locked out.');
    await page.close();
})

//For problem_user, the login will be successful but the problem is the image of all the items will be all dogs
test('Login Page with username problem_user', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goToLoginPage();
    await loginPage.login('problem_user', 'secret_sauce');
    await loginPage.verifyLoginSuccess();
    await page.close();
})

//This user test the time taken to load the page, it will be around 5 seconds
test('Login Page with username performance_glitch_user', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goToLoginPage();
    await loginPage.login('performance_glitch_user', 'secret_sauce');
    await loginPage.verifyLoginSuccess();
    await page.close();
})

//Page login successful and this user is used for visual testing
test('Login Page with visual_user', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goToLoginPage();
    await loginPage.login('visual_user', 'secret_sauce');
    await loginPage.verifyLoginSuccess();
    await page.close();
})

