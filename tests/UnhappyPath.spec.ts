import { LoginPage } from './LoginPage';
import { InventoryPage } from './InventoryPage';
import { BasePage } from './Basepage';
import { CartPage } from './CartPage';
import { Checkout } from './CheckoutPage';
import { test } from './index';

test('Direct login using button', async ({ loginPage, page }) => {
    
    await loginPage.goToLoginPage();
    await loginPage.clickLoginButton();
    await loginPage.verifyErroMessage('Epic sadface: Username is required');
    await page.close();
    
})


test('Login Page with username problem_user', async ({ loginPage, page }) => {
    
    await loginPage.goToLoginPage();
    await loginPage.login('problem_user', 'secret_sauce');
    await loginPage.verifyLoginSuccess();
    await page.close();
    
})

test('Login Page with username error_user', async ({ loginPage, basePage,page }) => {
   
    await basePage.routeApiSetup();
    await loginPage.goToLoginPage();
    await loginPage.login('error_user', 'secret_sauce');
    await loginPage.verifyLoginSuccess();
    await page.close();
    
})

//Should failed
test('Login Page with username problem_user and verify image content', async ({ loginPage, inventoryPage, basePage, page }) => {
    
    await loginPage.goToLoginPage();
    await loginPage.login('problem_user', 'secret_sauce');

    try {
        await inventoryPage.verifyDifferentImagePerItem();
    }catch(error) {
        await basePage.takeScreenshot('image-verification-failed.png');
        console.log('Same Image detected for different items');
        throw error; //Make sure the test fails, if not test will pass even the image verification failed
    }

    await page.close();
    
})

//Should failed
//for problem_user, there is a bug where some items cannot be added to the cart, so we will verify that and take screenshot for the failed test
test('Login Page with username problem_user and verify multiply item added', async ({ loginPage, inventoryPage, basePage, page }) => {
    
    await loginPage.goToLoginPage();
    await loginPage.login('problem_user', 'secret_sauce');

    try {
        //await inventoryPage.addMultiplyItemToCart();
        await inventoryPage.getItemThatDidNotGetAddedToCart();
    }catch (error)  {
        await basePage.takeScreenshot('item-addition-failed.png');
        console.log('Some items cannot be added to the cart');
        throw error; //Make sure the test fails, if not test will pass even the image verification failed
    }
    
})

test('Login Page with username problem_user and verify checkout process', async ({ loginPage, inventoryPage, basePage, cartPage, checkoutPage, page }) => {
 
    await loginPage.goToLoginPage();
    await loginPage.login('problem_user', 'secret_sauce');
    await loginPage.verifyLoginSuccess();
    await inventoryPage.addOneRandomItemToCart();
    await inventoryPage.goToCartPage();
    await cartPage.proceedToCheckout();

    try {
        await checkoutPage.fillCheckoutInfo('Max', 'Lestappen', '12345');
        await checkoutPage.clickContinue();
    } catch (error) {
        await basePage.takeScreenshot('checkout-failed.png');
        console.log('Unable to fill in the last name field');
        throw error;
    }
    await page.close();
    
})

test('Verify details first item between inventory page and detail page', async ({ loginPage, inventoryPage, page }) => {
    
    await loginPage.goToLoginPage();
    await loginPage.login('problem_user', 'secret_sauce');
    await inventoryPage.compareInventoryPageInfoAndDetailPageInfo(0);
    await inventoryPage.compareInventoryPageInfoAndDetailPageInfo(1);
    await inventoryPage.compareInventoryPageInfoAndDetailPageInfo(2);
    await inventoryPage.compareInventoryPageInfoAndDetailPageInfo(3);
    await inventoryPage.compareInventoryPageInfoAndDetailPageInfo(4);
    await inventoryPage.compareInventoryPageInfoAndDetailPageInfo(5); 
    await page.close();

})

test('Verify direct link to checkout page one', async ({ loginPage, checkoutPage, page }) => {
    
    await checkoutPage.verifyCheckoutRequiresLogin();
    await loginPage.verifyErroMessage("Epic sadface: You can only access '/cart.html' when you are logged in.");
  
})

test('Verify direct link to checkout page two', async ({ loginPage, checkoutPage, page }) => {
    
    try{
        await checkoutPage.goToCheckoutStepOne();
    } catch (error) {
        await loginPage.verifyErroMessage("Epic sadface: You can only access '/checkout-step-one.html' when you are logged in.");
        console.log("Unable to direct open checkout page");
        throw error;
    }
     await page.close();
    
})

test('Login Page with username performance_glitch_user', async ({ loginPage, page }) => {
    
    await loginPage.goToLoginPage();
    await loginPage.login('performance_glitch_user', 'secret_sauce');
    await loginPage.verifyLoginSuccess();
    await page.close();
    
})

test('Verify sorting does not break with problem_user', async ({ loginPage, inventoryPage, page }) => {
   
    await loginPage.goToLoginPage();
    await loginPage.login('problem_user', 'secret_sauce');
    await inventoryPage.VerifyProductSortZA();
    await inventoryPage.verifyProductContainerZA();
    await inventoryPage.verifyProductContainerLowToHigh();
    await inventoryPage.verifyProductContainerHighToLow();
    await inventoryPage.verifyProductSortContainerAZ();
    await page.close();
    
    
})

test('Verify error sorting LOHI with problem_user', async ({ loginPage, inventoryPage, page }) => {
   
    await loginPage.goToLoginPage();
    await loginPage.login('problem_user', 'secret_sauce');
    await inventoryPage.VerifyProductSortLOHI();
    await page.close();
})

test('Verify error sorting ZtoA with problem_user', async ({ loginPage, inventoryPage, page }) => {
    
    await loginPage.goToLoginPage();
    await loginPage.login('problem_user', 'secret_sauce');
    await inventoryPage.VerifyProductSortZA();
    await page.close();
    
})

test('Verify error sorting HIOL with problem_user', async ({ loginPage, inventoryPage, page }) => {
   
    await loginPage.goToLoginPage();
    await loginPage.login('problem_user', 'secret_sauce');
    await inventoryPage.verifyProductContainerHighToLow();
    await page.close();
    
})

test('Standard user with emulate network (slow2g)', async ({ basePage, loginPage, inventoryPage, page }) => {
   
    await basePage.emulateNetwork('slow2g');
    await loginPage.goToLoginPage();
    await loginPage.login('standard_user', 'secret_sauce');
    await page.close();
    
})

test('Standard user with emulate network (offline)', async ({ basePage, loginPage, inventoryPage, page }) => {
   
    await basePage.emulateNetwork('offline');
    await loginPage.goToLoginPage();
    await loginPage.login('standard_user', 'secret_sauce');
    await page.close();
    
})

test('Standard user with emulate network (2g)', async ({ basePage, loginPage, inventoryPage, page }) => {
   
    await basePage.emulateNetwork('2g');
    await loginPage.goToLoginPage();
    await loginPage.login('standard_user', 'secret_sauce');
    await page.close();
    
})

test('Standard user with emulate network (3g)', async ({ basePage, loginPage, inventoryPage, page }) => {
   
    await basePage.emulateNetwork('3g');
    await loginPage.goToLoginPage();
    await loginPage.login('standard_user', 'secret_sauce');
    await page.close();
    
})

test('Standard user with emulate network (4g)', async ({ basePage, loginPage, inventoryPage, page }) => {
   
    await basePage.emulateNetwork('4g');
    await loginPage.goToLoginPage();
    await loginPage.login('standard_user', 'secret_sauce');
    await page.close();
    
})

test('Standard user with emulate network (wifi)', async ({ basePage, loginPage, inventoryPage, page }) => {
   
    await basePage.emulateNetwork('wifi');
    await loginPage.goToLoginPage();
    await loginPage.login('standard_user', 'secret_sauce');
    await page.close();
    
})

test('Standard user with emulate network (fast)', async ({ basePage, loginPage, inventoryPage, page }) => {
   
    await basePage.emulateNetwork('fast');
    await loginPage.goToLoginPage();
    await loginPage.login('standard_user', 'secret_sauce');
    await page.close();
    
})

test('Standard user with emulate network (normal)', async ({ basePage, loginPage, inventoryPage, page }) => {
   
    await basePage.emulateNetwork('normal');
    await loginPage.goToLoginPage();
    await loginPage.login('standard_user', 'secret_sauce');
    await page.close();
    
})

test('Standard user with emulate performance network (2g)', async ({ basePage, loginPage, inventoryPage, page }) => {
   
    await basePage.emulateNetwork('2g');
    await loginPage.goToLoginPagePerformance();
    await loginPage.login('standard_user', 'secret_sauce');
    await page.close();
    
})