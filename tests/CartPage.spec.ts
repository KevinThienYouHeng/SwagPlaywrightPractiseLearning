import { test } from '@playwright/test';
import { LoginPage } from './LoginPage';
import { InventoryPage } from './InventoryPage';
import { CartPage } from './CartPage';
import { Checkout } from './CheckoutPage';

test('Verify cart page with 0 items', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await loginPage.goToLoginPage();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.goToCartPage();
    await cartPage.verifyCartBadgeCount(0);
    await cartPage.verifyCartIsEmpty();
    const cart = await cartPage.getCartItemCount();
    console.log(`Cart item count: ${cart}`);

    await page.close();
})

test('Verify cart page with 1 items', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await loginPage.goToLoginPage();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addOneItemToCart();
    await inventoryPage.goToCartPage();
    await cartPage.verifyCartBadgeCount(1);
    const cartName = await cartPage.getItemNameByIndex(0);
    const cartPrice = await cartPage.getItemPriceByIndex(0);
    const cartDesc = await cartPage.getItemDescriptionByIndex(0);
    console.log(`Cart item name: ${cartName} & Cart item price: ${cartPrice}`);
    console.log(`Cart item description ${cartDesc}`);
    const cart = await cartPage.getCartItemCount();
    console.log(`Cart item count: ${cart}`);

    await page.close();
    
})

test('Verify cart page with 1 items and continue shopping', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await loginPage.goToLoginPage();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addOneItemToCart();
    await inventoryPage.goToCartPage();
    await cartPage.verifyCartBadgeCount(1);
    await cartPage.continueShopping();
    await inventoryPage.verifyInventoryPageUrl();

    await page.close();
    
})

test('Verify cart page with 1 items and checkout button', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkout = new Checkout(page);

    await loginPage.goToLoginPage();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addOneItemToCart();
    await inventoryPage.goToCartPage();
    await cartPage.verifyCartBadgeCount(1);
    await cartPage.proceedToCheckout();
    await checkout.goToCheckoutStepOne();

    await page.close();
    
})

test('Verify cart page with 1 items and browser back button', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
   

    await loginPage.goToLoginPage();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addOneItemToCart();
    await inventoryPage.goToCartPage();
    await page.reload(); // Reload or refresh the page
    await cartPage.verifyCartBadgeCount(1);
    //await cartPage.proceedToCheckout();
    await page.goBack();

    //await page.close();
    
})


test('Verify cart page with random number items', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await loginPage.goToLoginPage();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addRandomItemToCart(2);
    await inventoryPage.goToCartPage();
    await cartPage.verifyCartBadgeCount(2);
    await cartPage.getAllCurrentNamesInCart();
    await cartPage.getAllCurrentPricesInCart();
    await cartPage.getAllCurrentDescriptionsInCart();
    const cart = await cartPage.getCartItemCount();
    console.log(`Cart item count: ${cart}`);

    await page.close();
    
})

test('Verify cart page with all items', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await loginPage.goToLoginPage();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addMultiplyItemToCart();
    await inventoryPage.goToCartPage();
    await cartPage.verifyCartBadgeCount(6);
    const cart = await cartPage.getCartItemCount();
    console.log(`Cart item count: ${cart}`);
    await cartPage.getAllCurrentNamesInCart();
    await cartPage.getAllCurrentPricesInCart();
    await cartPage.getAllCurrentDescriptionsInCart();
    

    await page.close();
    
})

test('Verify cart page with 1 items and Remove button', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await loginPage.goToLoginPage();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addOneItemToCart();
    await inventoryPage.goToCartPage();
    await cartPage.verifyCartBadgeCount(1);
    await cartPage.removeItemByIndex(0);
    await cartPage.verifyCartBadgeCount(0);
    await cartPage.verifyCartIsEmpty();

    await page.close();
    
})

test('Verify cart page with all items and remove all', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await loginPage.goToLoginPage();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addMultiplyItemToCart();
    await inventoryPage.goToCartPage();
    await cartPage.verifyCartBadgeCount(6);
    const cart = await cartPage.getCartItemCount();
    console.log(`Cart item count: ${cart}`);
    await cartPage.getAllCurrentNamesInCart();
    await cartPage.getAllCurrentPricesInCart();
    await cartPage.getAllCurrentDescriptionsInCart();
    await cartPage.removeAllItemsFromCart();
    await cartPage.verifyCartBadgeCount(0);
    await cartPage.verifyCartIsEmpty();
    await page.close();
    
})

test('Verify cart page with all items and remove 3 items', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await loginPage.goToLoginPage();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addMultiplyItemToCart();
    await inventoryPage.goToCartPage();
    await cartPage.verifyCartBadgeCount(6);
    const cart = await cartPage.getCartItemCount();
    console.log(`Cart item count: ${cart}`);
    await cartPage.getAllCurrentNamesInCart();
    await cartPage.getAllCurrentPricesInCart();
    await cartPage.getAllCurrentDescriptionsInCart();
    await cartPage.removeCertainNumberofItemsFromCart(3);
    await cartPage.verifyCartBadgeCount(3);
    await page.close();
    
})

test('Verify cart page with 1 items from detail page using name', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await loginPage.goToLoginPage();
    await loginPage.login('standard_user', 'secret_sauce');
    //await inventoryPage.addItemToCartFromDetailPage();
    await inventoryPage.clickProductName();
    await inventoryPage.goToCartPage();
    await cartPage.verifyCartBadgeCount(1);
    const cartName = await cartPage.getItemNameByIndex(0);
    const cartPrice = await cartPage.getItemPriceByIndex(0);
    console.log(`Cart item name: ${cartName}`);
    console.log(`Cart item price: ${cartPrice}`);
    await page.close();
    
})

test('Verify cart page with 1 items from detail page using img', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await loginPage.goToLoginPage();
    await loginPage.login('standard_user', 'secret_sauce');
    //await inventoryPage.addItemToCartFromDetailPage();
    await inventoryPage.clickProductImg();
    await inventoryPage.goToCartPage();
    await cartPage.verifyCartBadgeCount(1);
    const cartName = await cartPage.getItemNameByIndex(0);
    const cartPrice = await cartPage.getItemPriceByIndex(0);
    console.log(`Cart item name: ${cartName}`);
    console.log(`Cart item price: ${cartPrice}`);
    await page.close();
    
})

test('Verify cart page with All items and remove one specific item with name', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await loginPage.goToLoginPage();
    await loginPage.login('standard_user', 'secret_sauce');
    //await inventoryPage.addItemToCartFromDetailPage();
    await inventoryPage.addMultiplyItemToCart();
    await inventoryPage.goToCartPage();
    await cartPage.verifyCartBadgeCount(6);
    await cartPage.removeSpecificItemFromCart('Sauce Labs Backpack');
    await cartPage.verifyCartBadgeCount(5);
    await cartPage.removeItemByIndex(1);
    await cartPage.verifyCartBadgeCount(4);
    //await page.close();
    
})
