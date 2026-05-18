import { expect, test } from '@playwright/test';
import { LoginPage } from './LoginPage';
import { InventoryPage } from './InventoryPage';
import { CartPage } from './CartPage';
import { Checkout } from './CheckoutPage';

test('Verify first checkout page and all its content', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkout = new Checkout(page);

    await loginPage.goToLoginPage();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addOneItemToCart();
    await inventoryPage.goToCartPage();
    await cartPage.proceedToCheckout();
    //await checkout.goToCheckoutStepOne();
    await checkout.verifyInputFieldsEmpty();
    await checkout.verifyCheckoutContent();
})


test('Verify Error message when only first name is entered', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkout = new Checkout(page);

    await loginPage.goToLoginPage();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addOneItemToCart();
    await inventoryPage.goToCartPage();
    await cartPage.proceedToCheckout();
    await checkout.verifyCheckoutContent();
    await checkout.fillCheckoutInfo('Max','','');
    await checkout.clickContinue();
    await checkout.verifyErrorMessage('Last Name is required');
})

test('Verify Error message when only last name is entered', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkout = new Checkout(page);

    await loginPage.goToLoginPage();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addOneItemToCart();
    await inventoryPage.goToCartPage();
    await cartPage.proceedToCheckout();
    await checkout.verifyCheckoutContent();
    await checkout.fillCheckoutInfo('','Leclerc','');
    await checkout.clickContinue();
    await checkout.verifyErrorMessage('First Name is required');
})

test('Verify Error message when only ZipCode is entered', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkout = new Checkout(page);

    await loginPage.goToLoginPage();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addOneItemToCart();
    await inventoryPage.goToCartPage();
    await cartPage.proceedToCheckout();
    await checkout.verifyCheckoutContent();
    await checkout.fillCheckoutInfo('','','16813');
    await checkout.clickContinue();
    await checkout.verifyErrorMessage('First Name is required');
});


[ 
    {firstname: 'Max', lastname: '', postalcode: '', expectedError: 'Last Name is required'},
    {firstname: '', lastname: 'Leclerc', postalcode: '', expectedError: 'First Name is required'},
    {firstname: '', lastname: '', postalcode: '16813', expectedError: 'First Name is required'},
].forEach(({firstname, lastname, postalcode, expectedError}) => {

    test(`Verify error when firstname: "${firstname}" lastname: "${lastname}" postalcode: "${postalcode}"`, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkout = new Checkout(page);

    await loginPage.goToLoginPage();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addOneItemToCart();
    await inventoryPage.goToCartPage();
    await cartPage.proceedToCheckout();
    //await checkout.goToCheckoutStepOne();
    await checkout.verifyCheckoutContent();
    await checkout.fillCheckoutInfo(firstname, lastname, postalcode);
    await checkout.clickContinue();
    await checkout.verifyErrorMessage(expectedError);

    });
});

test('Verify input fields(alphanumeric)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkout = new Checkout(page);

    await loginPage.goToLoginPage();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addOneItemToCart();
    await inventoryPage.goToCartPage();
    await cartPage.proceedToCheckout();
    await checkout.verifyInputFieldsEmpty();
    await checkout.verifyFirstNameInputField('Max');
    await checkout.verifyLastNameInputField('Leclerc');
    await checkout.verifyPostalCodeInputField('33168');
    await checkout.verifyTabKeyMovesFormFocus();
    await checkout.clearAllFields();
    await checkout.verifyFirstNameInputField('33567');
    await checkout.verifyLastNameInputField('33452');
    await checkout.verifyPostalCodeInputField('Verstappen');
    await checkout.clearAllFields();
});

test('Verify Cancel Button and Cart count does not change', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkout = new Checkout(page);

    await loginPage.goToLoginPage();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addOneItemToCart();
    await inventoryPage.goToCartPage();
    await inventoryPage.verifyCartCount(1);
    await cartPage.proceedToCheckout();
    await checkout.clickCancelStepOne();
    await cartPage.getItemNameByIndex(0);
    await cartPage.verifyCartPageUrl();
    await cartPage.verifyCartBadgeCount(1);

});

test('Verify Continue Button', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkout = new Checkout(page);

    await loginPage.goToLoginPage();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addOneItemToCart();
    await inventoryPage.goToCartPage();
    await cartPage.proceedToCheckout();
    await checkout.fillCheckoutInfo('Max','Leclerc','16331');
    await checkout.clickContinue();
    await checkout.verifyOnStepTwo();

});

test('Verify Continue Button and checkout-two contents', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkout = new Checkout(page);

    await loginPage.goToLoginPage();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addOneItemToCart();
    await inventoryPage.goToCartPage();
    await cartPage.proceedToCheckout();
    await checkout.fillCheckoutInfo('Max','Leclerc','16331');
    await checkout.clickContinue();
    await checkout.verifyOnStepTwo();
    await checkout.verifyOrderSummaryVisible();
    await checkout.getCompleteItemNamesList();
    await checkout.verifyTotalEqualsSubtotalPlusTax();
    await checkout.getOrderSummary();

});

test('Verify all items at checkout-two page', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkout = new Checkout(page);

    await loginPage.goToLoginPage();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addMultiplyItemToCart();
    await inventoryPage.goToCartPage();
    await cartPage.proceedToCheckout();
    await checkout.fillCheckoutInfo('Max','Leclerc','16331');
    await checkout.clickContinue();
    await checkout.getCompleteItemNamesList();
    await checkout.getCompleteItemPricesList();
    await checkout.verifyTotalEqualsSubtotalPlusTax();
    await checkout.getOrderSummary();

});

test('Verify random items at checkout-two page', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkout = new Checkout(page);

    await loginPage.goToLoginPage();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addRandomItemToCart(3);
    await inventoryPage.goToCartPage();
    await cartPage.proceedToCheckout();
    await checkout.fillCheckoutInfo('Max','Leclerc','16331');
    await checkout.clickContinue();
    await checkout.getCompleteItemNamesList();
    await checkout.getCompleteItemPricesList();
    await checkout.verifyTotalEqualsSubtotalPlusTax();
    await checkout.getOrderSummary();

});

test('Verify Cancel Part 2 Button', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkout = new Checkout(page);

    await loginPage.goToLoginPage();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addOneItemToCart();
    await inventoryPage.goToCartPage();
    await cartPage.proceedToCheckout();
    await checkout.fillCheckoutInfo('Max','Leclerc','16331');
    await checkout.clickContinue();
    await checkout.verifyOnStepTwo();
    await checkout.clickCancelStepTwo();
    await inventoryPage.verifyInventoryPageUrl();
    await inventoryPage.verifyCartCount(1);
    //await inventoryPage.verifyInventoryPageItem();
});

test('Verify Finish Button and complete page content', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkout = new Checkout(page);

    await loginPage.goToLoginPage();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addOneItemToCart();
    await inventoryPage.goToCartPage();
    await cartPage.proceedToCheckout();
    await checkout.fillCheckoutInfo('Max','Leclerc','16331');
    await checkout.clickContinue();
    await checkout.verifyOnStepTwo();
    await checkout.clickFinish();
    await checkout.verifyOnCompletePage();
    await checkout.verifySuccessMessage();
    await checkout.verifyCartIsCleared();

});

test('Verify back button ', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkout = new Checkout(page);

    await loginPage.goToLoginPage();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addOneItemToCart();
    await inventoryPage.goToCartPage();
    await cartPage.proceedToCheckout();
    await checkout.fillCheckoutInfo('Max','Leclerc','16331');
    await checkout.clickContinue();
    await checkout.verifyOnStepTwo();
    await checkout.clickFinish();
    await checkout.verifyOnCompletePage();
    await checkout.verifySuccessMessage();
    await checkout.verifyBackHomeButton();
    await inventoryPage.verifyInventoryPageUrl();
    await inventoryPage.verifyCartCount(0);

});