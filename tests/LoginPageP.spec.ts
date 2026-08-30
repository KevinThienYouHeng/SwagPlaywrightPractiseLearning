//import { test } from '@playwright/test';
import { LoginPage } from './LoginPage';
import { InventoryPage } from './InventoryPage';
import { BasePage } from './Basepage';
import { test } from './index';

//test.describe.configure({mode: 'parallel'});

//Below are hardcoded tests
test('@smoke Verify Login page', async ({ basePage, loginPage, page, context}) => {
    
    await basePage.checkStatusURL();
    await loginPage.goToLoginPage();
    await loginPage.verifyLoginPage();
    await basePage.getCurrentCookies();
    await basePage.findIframes();
    await page.close();
})

test('@smoke Verify fast Login page', async ({ basePage, loginPage, page}) => {
    
    await loginPage.goToLoginPage();
    await loginPage.fastlogin('standard_user', 'secret_sauce');
    await loginPage.verifyLoginSuccess();
    await page.close();
})

test('@smoke Verify normal Login page', async ({ basePage, loginPage, page}) => {
    
    await loginPage.goToLoginPage();
    await loginPage.login('standard_user', 'secret_sauce');
    await loginPage.verifyLoginSuccess();
    await page.close();
})

test('@smoke Dark mode CSS inject Login page', async ({ basePage, loginPage, page}) => {
    
    await basePage.checkStatusURL();
    await loginPage.goToLoginPage();
    await basePage.injectCssScript();
    await page.close();
})

test('@smoke Login Page with API intercept', async ({ basePage, loginPage, page }) => {
    
    await loginPage.routeApiSetup();
    await loginPage.goToLoginPage();
    await loginPage.login('standard_user', 'secret_sauce');
    await loginPage.verifyLoginSuccess();
    await basePage.interceptLoginState();
    await page.close();
})

test('@smoke Login Page with no username ', async ({ loginPage, page }) => {
    
    await loginPage.routeApiSetup();
    await loginPage.goToLoginPage();
    await loginPage.login('', 'secret_sauce');
    await loginPage.verifyErroMessage('Epic sadface: Username is required');
    await page.close();
})

test('@smoke Login Page with no password', async ({ loginPage, page }) => {
    
    await loginPage.goToLoginPage();
    await loginPage.login('standard_user', '');
    await loginPage.verifyErroMessage('Epic sadface: Password is required');
    await page.close();
})

test('@smoke Login Page with no username and no password', async ({loginPage, page }) => {
    
    await loginPage.goToLoginPage();
    await loginPage.login('', '');
    await loginPage.verifyErroMessage('Epic sadface: Username is required');
    await page.close();
})

test('@smoke Login Page with invalid credentials', async ({ loginPage, page }) => {

    await loginPage.goToLoginPage();
    await loginPage.login('Max', 'Lestappen');
    await loginPage.verifyErroMessage('Epic sadface: Username and password do not match any user in this service');
    await page.close();
})

test('@smoke Login Page with username locked_out_user', async ({ loginPage, page }) => {
    
    await loginPage.goToLoginPage();
    await loginPage.login('locked_out_user', 'secret_sauce');
    await loginPage.verifyErroMessage('Epic sadface: Sorry, this user has been locked out.');
    await page.close();
})

//For problem_user, the login will be successful but the problem is the image of all the items will be all dogs
test('@smoke Login Page with username problem_user', async ({loginPage, page }) => {

    await loginPage.goToLoginPage();
    await loginPage.login('problem_user', 'secret_sauce');
    await loginPage.verifyLoginSuccess();
    await page.close();
})

//This user test the time taken to load the page, it will be around 3 - 5 seconds
test('@smoke Login Page with username performance_glitch_user', async ({basePage, loginPage, page }) => {
    
    const starttime = Date.now();
    await loginPage.goToLoginPage();
    await loginPage.login('performance_glitch_user', 'secret_sauce');
    await basePage.waitForPageLoad(starttime);
    await loginPage.verifyLoginSuccess();
    await page.close();
})

//Page login successful and this user is used for visual testing
test('@smoke Login Page with visual_user', async ({ loginPage, page }) => {
    
    await loginPage.goToLoginPage();
    await loginPage.login('visual_user', 'secret_sauce');
    await loginPage.verifyLoginSuccess();
    await page.close();
})

test('@smoke Do two user at the same time with two browsers', async ({browser}) => {

    
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

test('@smoke different user two tabs', async ({browser}) => {

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

});

[
    {username: 'standard_user', password: 'secret_sauce'},
    {username: 'problem_user', password: 'secret_sauce'},
    {username: 'performance_glitch_user', password: 'secret_sauce'},
    {username: 'visual_user', password: 'secret_sauce'},
    {username: 'locked_out_user', password: 'secret_sauce'},
    {username: 'error_user', password: 'secret_sauce'}, 
].forEach(({username, password}) => {
    
    test(`Different users - ${username}`, async({loginPage, page}) => {

        await loginPage.goToLoginPage();

        try {
            await loginPage.login(username, password);
            await loginPage.verifyLoginSuccess();
            await page.close();
        } catch (error) {
            console.log('Login failed');
            await page.close();
            throw error;
        }
        
        
    });
});

test('@smoke Visual test', async ({ loginPage, page }) => {
    await loginPage.visualLoginPageCheck();
    await page.close();
})

test('@smoke Performance test', async ({ loginPage, basePage, page }) => {
    await loginPage.goToLoginPage();
    await basePage.loadPerformanceMetrics();
    await page.close();
})

test('@smoke Endpoint test', async ({ loginPage, page }) => {
    
    await loginPage.goToLoginPageEndPoint();
    await page.close();
})

test.describe.parallel('Measure Test',  () => {
    test.beforeAll(async () => {
        const startPer = performance.now();
        const startTime = Date.now();
    })
    test('Loading test', async ({ loginPage }) => {
        await loginPage.goToLoginPage();
    })
    test('EndPoint describe Test', async ({ loginPage }) => {
        await loginPage.goToLoginPageEndPoint();
    })
})

test('AI generated test cases for SauceDemo', async ({ basePage, loginPage, page}) => {
    
    await loginPage.goToLoginPage();
    const pageHTML = await page.content();
    const testCases = await basePage.generateTestCases(pageHTML);
    console.log(testCases);

})

