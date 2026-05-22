import { expect, test } from '@playwright/test';
import { LoginPage } from './LoginPage';
import { InventoryPage } from './InventoryPage';
import { BasePage } from './Basepage';
import { CartPage } from './CartPage';
import { Checkout } from './CheckoutPage';

test('Direct login using button', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goToLoginPage();
    await loginPage.clickLoginButton();
    await loginPage.verifyErroMessage('Epic sadface: Username is required');
    
})


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

test('Verify details first item between inventory page and detail page', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);


    await loginPage.goToLoginPage();
    await loginPage.login('problem_user', 'secret_sauce');
    await inventoryPage.compareInventoryPageInfoAndDetailPageInfo(0);
    await inventoryPage.compareInventoryPageInfoAndDetailPageInfo(1);
    await inventoryPage.compareInventoryPageInfoAndDetailPageInfo(2);
    await inventoryPage.compareInventoryPageInfoAndDetailPageInfo(3);
    await inventoryPage.compareInventoryPageInfoAndDetailPageInfo(4);
    await inventoryPage.compareInventoryPageInfoAndDetailPageInfo(5); 
    
})

test('Verify direct link to checkout page one', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    try {
        await cartPage.goToCartPage();
    } catch (error) {
        await loginPage.verifyErroMessage("Epic sadface: You can only access '/cart.html' when you are logged in.");
        console.log("Unable to direct open cart page");
        throw error;
    }
    
    
})

test('Verify direct link to checkout page two', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkout = new Checkout(page);

    try{
        await checkout.goToCheckoutStepOne();
    } catch (error) {
        await loginPage.verifyErroMessage("Epic sadface: You can only access '/checkout-step-one.html' when you are logged in.");
        console.log("Unable to direct open checkout page");
        throw error;
    }
     
    
})

test('Login Page with username performance_glitch_user', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.goToLoginPage();
    await loginPage.login('performance_glitch_user', 'secret_sauce');
    await loginPage.verifyLoginSuccess();
    await page.close();
    
})

test('Verify sorting does not break with problem_user', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.goToLoginPage();
    await loginPage.login('problem_user', 'secret_sauce');
    await inventoryPage.VerifyProductSortZA();
    await inventoryPage.verifyProductContainerZA();
    await inventoryPage.verifyProductContainerLowToHigh();
    await inventoryPage.verifyProductContainerHighToLow();
    await inventoryPage.verifyProductSortContainerAZ();
    
    
})

test('Verify error sorting LOHI with problem_user', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.goToLoginPage();
    await loginPage.login('problem_user', 'secret_sauce');
    await inventoryPage.VerifyProductSortLOHI();
    
})

test('Verify error sorting ZtoA with problem_user', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.goToLoginPage();
    await loginPage.login('problem_user', 'secret_sauce');
    await inventoryPage.VerifyProductSortZA();
    
})

test('Verify error sorting HIOL with problem_user', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.goToLoginPage();
    await loginPage.login('problem_user', 'secret_sauce');
    await inventoryPage.verifyProductContainerHighToLow();
    
})