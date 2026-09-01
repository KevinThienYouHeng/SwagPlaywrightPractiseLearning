import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { Checkout } from '../../pages/CheckoutPage';
import { test } from '../../pages/index';

const TestConfig = {
    username: 'standard_user',
    password: 'secret_sauce'
}

test('Verify first checkout page and all its content', async ({loginPage, inventoryPage, cartPage, checkoutPage, page }) => {
    
    await loginPage.goToLoginPage();
    await loginPage.login(TestConfig.username, TestConfig.password);
    await inventoryPage.addOneRandomItemToCart();
    await inventoryPage.goToCartPage();
    await cartPage.proceedToCheckout();
    await checkoutPage.verifyOnStepOne();
    await checkoutPage.verifyInputFieldsEmpty();
    await checkoutPage.verifyCheckoutContent();
    await page.close();
})

test('Verify first checkout page and input content', async ({loginPage, inventoryPage, cartPage, checkoutPage, page }) => {
    
    await loginPage.goToLoginPage();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addOneRandomItemToCart();
    await inventoryPage.goToCartPage();
    await cartPage.proceedToCheckout();
    await checkoutPage.verifyFirstNameInputField('Charles');
    await checkoutPage.verifyLastNameInputField('Piastri');
    await checkoutPage.verifyPostalCodeInputField('44444');
    await checkoutPage.clearAllFields();
    await checkoutPage.verifyTabKeyMovesFormFocus();
    await page.close();
})


test('Verify Error message when only first name is entered', async ({ loginPage, inventoryPage, cartPage, checkoutPage, page }) => {
    
    await loginPage.goToLoginPage();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addOneRandomItemToCart();
    await inventoryPage.goToCartPage();
    await cartPage.proceedToCheckout();
    await checkoutPage.fillCheckoutInfo('Max','','');
    await checkoutPage.clickContinue();
    await checkoutPage.verifyErrorMessage('Last Name is required');
    await page.close();
})

test('Verify Error message when only last name is entered', async ({ loginPage, inventoryPage, cartPage, checkoutPage, page }) => {
    
    await loginPage.goToLoginPage();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addOneRandomItemToCart();
    await inventoryPage.goToCartPage();
    await cartPage.proceedToCheckout();
    await checkoutPage.verifyCheckoutContent();
    await checkoutPage.fillCheckoutInfo('','Leclerc','');
    await checkoutPage.clickContinue();
    await checkoutPage.verifyErrorMessage('First Name is required');
    await page.close();
})

test('Verify Error message when only ZipCode is entered', async ({ loginPage, inventoryPage, cartPage, checkoutPage, page }) => {
    
    await loginPage.goToLoginPage();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addOneRandomItemToCart();
    await inventoryPage.goToCartPage();
    await cartPage.proceedToCheckout();
    await checkoutPage.verifyCheckoutContent();
    await checkoutPage.fillCheckoutInfo('','','16813');
    await checkoutPage.clickContinue();
    await checkoutPage.verifyErrorMessage('First Name is required');
    await page.close();
});


[ 
    {firstname: 'Max', lastname: '', postalcode: '', expectedError: 'Last Name is required'},
    {firstname: '', lastname: 'Leclerc', postalcode: '', expectedError: 'First Name is required'},
    {firstname: '', lastname: '', postalcode: '16813', expectedError: 'First Name is required'},
].forEach(({firstname, lastname, postalcode, expectedError}) => {

    test(`Verify error when firstname: "${firstname}" lastname: "${lastname}" postalcode: "${postalcode}"`, 
        async ({ loginPage, inventoryPage, cartPage, checkoutPage, page }) => {
    

    await loginPage.goToLoginPage();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addOneRandomItemToCart();
    await inventoryPage.goToCartPage();
    await cartPage.proceedToCheckout();
    await checkoutPage.verifyCheckoutContent();
    await checkoutPage.fillCheckoutInfo(firstname, lastname, postalcode);
    await checkoutPage.clickContinue();
    await checkoutPage.verifyErrorMessage(expectedError);
    await page.close();

    });
});

test('Verify input fields(alphanumeric)', async ({ loginPage, inventoryPage, cartPage, checkoutPage, page }) => {
    
    await loginPage.goToLoginPage();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addOneRandomItemToCart();
    await inventoryPage.goToCartPage();
    await cartPage.proceedToCheckout();
    await checkoutPage.verifyInputFieldsEmpty();
    await checkoutPage.verifyFirstNameInputField('Max');
    await checkoutPage.verifyLastNameInputField('Leclerc');
    await checkoutPage.verifyPostalCodeInputField('33168');
    await checkoutPage.verifyTabKeyMovesFormFocus();
    await checkoutPage.clearAllFields();
    await checkoutPage.verifyFirstNameInputField('33567');
    await checkoutPage.verifyLastNameInputField('33452');
    await checkoutPage.verifyPostalCodeInputField('Verstappen');
    await checkoutPage.clearAllFields();
    await page.close();
});

test('Verify Cancel Button and Cart count does not change', async ({ loginPage, inventoryPage, cartPage, checkoutPage, page }) => {
    

    await loginPage.goToLoginPage();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addOneRandomItemToCart();
    await inventoryPage.goToCartPage();
    await cartPage.verifyCartItemCount(1);
    await cartPage.verifyCartBadgeCount(1);
    await cartPage.proceedToCheckout();
    await checkoutPage.clickCancelStepOne();
    const itemName = await cartPage.getItemNameByIndex(0);
    console.log(itemName);
    await cartPage.verifyCartPageUrl();
    await cartPage.verifyCartBadgeCount(1);
    await page.close();

});

test('Verify Continue Button', async ({ loginPage, inventoryPage, cartPage, checkoutPage, page }) => {
    
    await loginPage.goToLoginPage();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addOneRandomItemToCart();
    await inventoryPage.goToCartPage();
    await cartPage.proceedToCheckout();
    await checkoutPage.fillCheckoutInfo('Max','Leclerc','16331');
    await checkoutPage.clickContinue();
    await checkoutPage.verifyOnStepTwo();
    await page.close();

});

test('Verify Continue Button and checkout-two contents', async ({ loginPage, inventoryPage, cartPage, checkoutPage, page }) => {
    
    await loginPage.goToLoginPage();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addOneRandomItemToCart();
    await inventoryPage.goToCartPage();
    await cartPage.proceedToCheckout();
    await checkoutPage.fillCheckoutInfo('Max','Leclerc','16331');
    await checkoutPage.clickContinue();
    await checkoutPage.verifyOnStepTwo();
    await checkoutPage.verifyOrderSummaryVisible();
    await checkoutPage.getCompleteItemNamesList();
    await checkoutPage.verifyTotalEqualsSubtotalPlusTax();
    await checkoutPage.getOrderSummary();
    await page.close();

});

test('Verify all items at checkout-two page', async ({ loginPage, inventoryPage, cartPage, checkoutPage, page }) => {
    

    await loginPage.goToLoginPage();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addMultiplyItemToCart();
    await inventoryPage.goToCartPage();
    await cartPage.proceedToCheckout();
    await checkoutPage.fillCheckoutInfo('Max','Leclerc','16331');
    await checkoutPage.clickContinue();
    await checkoutPage.getCompleteItemNamesList();
    await checkoutPage.getCompleteItemPricesList();
    await checkoutPage.verifyTotalEqualsSubtotalPlusTax();
    await checkoutPage.getOrderSummary();
    await page.close();

});

test('Verify random items at checkout-two page', async ({ loginPage, inventoryPage, cartPage, checkoutPage, page }) => {
    
    await loginPage.goToLoginPage();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addRandomItemToCart(3);
    await inventoryPage.goToCartPage();
    await cartPage.proceedToCheckout();
    await checkoutPage.fillCheckoutInfo('Max','Leclerc','16331');
    await checkoutPage.clickContinue();
    await checkoutPage.getCompleteItemNamesList();
    await checkoutPage.getCompleteItemPricesList();
    await checkoutPage.verifyTotalEqualsSubtotalPlusTax();
    await checkoutPage.getOrderSummary();
    await page.close();

});

test('Verify Cancel Part 2 Button', async ({ loginPage, inventoryPage, cartPage, checkoutPage, page }) => {
    
    await loginPage.goToLoginPage();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addOneRandomItemToCart();
    await inventoryPage.goToCartPage();
    await cartPage.proceedToCheckout();
    await checkoutPage.fillCheckoutInfo('Max','Leclerc','16331');
    await checkoutPage.clickContinue();
    await checkoutPage.verifyOnStepTwo();
    await checkoutPage.clickCancelStepTwo();
    await inventoryPage.verifyInventoryPageUrl();
    await inventoryPage.verifyCartCount(1);
    await page.close();
    
});

test('Verify Finish Button and complete page content', async ({loginPage, inventoryPage, cartPage, checkoutPage, page }) => {
   
    await loginPage.goToLoginPage();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addOneRandomItemToCart();
    await inventoryPage.goToCartPage();
    await cartPage.proceedToCheckout();
    await checkoutPage.fillCheckoutInfo('Max','Leclerc','16331');
    await checkoutPage.clickContinue();
    await checkoutPage.verifyOnStepTwo();
    await checkoutPage.clickFinish();
    await checkoutPage.verifyOnCompletePage();
    await checkoutPage.verifySuccessMessage();
    await checkoutPage.verifyCartIsCleared();
    await page.close();

});

test('Verify back button ', async ({ loginPage, inventoryPage, cartPage, checkoutPage,page }) => {
    
    await loginPage.goToLoginPage();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addOneRandomItemToCart();
    await inventoryPage.goToCartPage();
    await cartPage.proceedToCheckout();
    await checkoutPage.fillCheckoutInfo('Max','Leclerc','16331');
    await checkoutPage.clickContinue();
    await checkoutPage.verifyOnStepTwo();
    await checkoutPage.clickFinish();
    await checkoutPage.verifyOnCompletePage();
    await checkoutPage.verifySuccessMessage();
    await checkoutPage.verifyBackHomeButton();
    await inventoryPage.verifyInventoryPageUrl();
    await inventoryPage.verifyCartCount(0);
    await page.close();

});

test('Verify empty checkout checkout-two page', async ({ loginPage, inventoryPage, cartPage, checkoutPage, page }) => {
    
    await loginPage.goToLoginPage();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.goToCartPage();
    await cartPage.proceedToCheckout();
    await checkoutPage.fillCheckoutInfo('Max','Leclerc','16331');
    await checkoutPage.clickContinue();
    await checkoutPage.getCompleteItemNamesList();
    await checkoutPage.getCompleteItemPricesList();
    await checkoutPage.verifyTotalEqualsSubtotalPlusTax();
    await checkoutPage.getOrderSummary();
    await page.close();

});

test('Verify Browser back Button', async ({ loginPage, inventoryPage, cartPage, checkoutPage, page }) => {
    
    await loginPage.goToLoginPage();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addOneRandomItemToCart();
    await inventoryPage.goToCartPage();
    await cartPage.proceedToCheckout();
    await checkoutPage.fillCheckoutInfo('Max','Leclerc','16331');
    await checkoutPage.clickContinue();
    await checkoutPage.verifyOnStepTwo();
    await page.goBack();
    await checkoutPage.verifyOnStepOne();
    await page.close();

});

test('Verify Browser back Button with API request', async ({ basePage, loginPage, inventoryPage, cartPage, checkoutPage,  page }) => {
    
    await basePage.routeApiSetup();
    await loginPage.goToLoginPage();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addOneRandomItemToCart();
    await inventoryPage.goToCartPage();
    await cartPage.proceedToCheckout();
    await checkoutPage.fillCheckoutInfo('Max','Leclerc','16331');
    await checkoutPage.clickContinue();
    await checkoutPage.verifyOnStepTwo();
    await page.goBack();
    await checkoutPage.verifyOnStepOne();
    await page.close();

});