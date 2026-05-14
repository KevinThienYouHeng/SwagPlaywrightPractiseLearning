import { test } from '@playwright/test';
import { LoginPage } from './LoginPage';
import { InventoryPage } from './InventoryPage';
import { CartPage } from './CartPage';

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
    console.log(`Cart item name: ${cartName} & Cart item price: ${cartPrice}`);
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

    await page.close();
    
})

test('Verify cart page with 1 items and checkout button', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await loginPage.goToLoginPage();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addOneItemToCart();
    await inventoryPage.goToCartPage();
    await cartPage.verifyCartBadgeCount(1);
    await cartPage.proceedToCheckout();

    await page.close();
    
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
    

    await page.close();
    
})

