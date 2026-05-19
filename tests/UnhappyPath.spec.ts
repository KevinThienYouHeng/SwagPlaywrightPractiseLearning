import { expect, test } from '@playwright/test';
import { LoginPage } from './LoginPage';
import { InventoryPage } from './InventoryPage';
import { BasePage } from './Basepage';
import { CartPage } from './CartPage';
import { Checkout } from './CheckoutPage';

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
    const basePage = new BasePage(page);

    await loginPage.goToLoginPage();
    await loginPage.login('problem_user', 'secret_sauce');

    try {
        await inventoryPage.verifyDifferentImagePerItem();
    }catch (error) {
        await basePage.takeScreenshot('image-verification-failed.png');
        console.log('Same Image detected for different items');
        throw error; //Make sure the test fails, if not test will pass even the image verification failed
    }
    
})

//Should failed
//for problem_user, there is a bug where some items cannot be added to the cart, so we will verify that and take screenshot for the failed test
test('Login Page with username problem_user and verify multiply item added', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const basePage = new BasePage(page);

    await loginPage.goToLoginPage();
    await loginPage.login('problem_user', 'secret_sauce');

    try {
        //await inventoryPage.addMultiplyItemToCart();
        await inventoryPage.getItemThatDidNotGetAddedToCart();
    }catch (error) {
        await basePage.takeScreenshot('item-addition-failed.png');
        console.log('Some items cannot be added to the cart');
        throw error; //Make sure the test fails, if not test will pass even the image verification failed
    }
    
})

test('Login Page with username problem_user and verify checkout process', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkout = new Checkout(page);
    const basePage = new BasePage(page);

    await loginPage.goToLoginPage();
    await loginPage.login('problem_user', 'secret_sauce');
    await loginPage.verifyLoginSuccess();
    await inventoryPage.addOneItemToCart();
    await inventoryPage.goToCartPage();
    await cartPage.proceedToCheckout();

    try {
        await checkout.fillCheckoutInfo('Max', 'Lestappen', '12345');
        await checkout.clickContinue();
    } catch (error) {
        await basePage.takeScreenshot('checkout-failed.png');
        console.log('Unable to fill in the last name field');
        throw error;
    }
    
    
})