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

test('Do two user at the same time with two browsers', async ({browser}) => {

    
    const user1 = await browser.newContext();
    const page1 = await user1.newPage();

    const user2 = await browser.newContext();
    const page2 = await user2.newPage();

    const loginPage1 = new LoginPage(page1);
    const loginPage2 = new LoginPage(page2);

    await Promise.all([
        loginPage1.goToLoginPage(),
        loginPage2.goToLoginPage(),
    ]);

    await loginPage1.login('standard_user', 'secret_sauce');
    await loginPage2.login('problem_user', 'secret_sauce');
    await loginPage1.verifyLoginSuccess();
    await loginPage2.verifyLoginSuccess();
    await page1.close();
    await page2.close();
});

test('Same user two tabs', async ({browser}) => {

    const context = await browser.newContext();

    const tab1 = await context.newPage();
    const tab2 = await context.newPage();

    const loginPage1 = new LoginPage(tab1);
    const loginPage2 = new LoginPage(tab2); 
    const inventoryPage1 = new InventoryPage(tab1);
    const inventoryPage2 = new InventoryPage(tab2);

    await loginPage1.goToLoginPage();
    await loginPage1.login('standard_user', 'secret_sauce');
    await loginPage1.verifyLoginSuccess();

    await loginPage2.goToLoginPage();
    await loginPage2.login('problem_user', 'secret_sauce');
    await loginPage2.verifyLoginSuccess();

    await inventoryPage1.verifyInventoryPageUrl();
    await inventoryPage2.verifyInventoryPageUrl();

})
