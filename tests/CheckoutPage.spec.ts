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

test('Verify Cancel Button', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkout = new Checkout(page);

    await loginPage.goToLoginPage();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addOneItemToCart();
    await inventoryPage.goToCartPage();
    await cartPage.proceedToCheckout();
    await checkout.clickCancelStepOne();
    await cartPage.verifyCartPageUrl();

});