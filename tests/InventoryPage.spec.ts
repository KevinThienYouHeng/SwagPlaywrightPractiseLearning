import { test } from '@playwright/test';
import { LoginPage } from './LoginPage';
import { InventoryPage } from './InventoryPage';


test('User can add item to cart using POM', async ({ page }) => {
  // 1. Initialize Pages
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);

  // 2. Perform actions using our page classes
  await loginPage.goToLoginPage();
  await loginPage.login('standard_user', 'secret_sauce'); // Not needed because we are using storageState

  //await inventoryPage.addProductToCart('Sauce Labs Backpack');
  await inventoryPage.addOneItemToCart();
  await inventoryPage.verifyRemoveButtonVisbilityAfterAddingToCart();
  await inventoryPage.goToCartPage();
  await inventoryPage.verifyCartCount(1);
  //await inventoryPage.removeOneItem();
  //await inventoryPage.verifyCartCount(0);
});

test('Verify content in inventory page using POM', async ({ page }) => {

  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);

  await loginPage.goToLoginPage();
  await loginPage.login('standard_user', 'secret_sauce');
  await inventoryPage.verifyInventoryPageItem();
  await inventoryPage.verifyImagePerItem(); 
  await inventoryPage.verifyInventoryPage();
  await inventoryPage.verifyCartCount(0);
  await inventoryPage.logoutPage();

  await page.close();
});

test('Verify sorting Martix', async ({ page }) => {

  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);

  await loginPage.goToLoginPage();
  await inventoryPage.verifyProductSortContainerAZ();
  await inventoryPage.verifyProductContainerZA();
  await inventoryPage.verifyProductContainerLowToHigh();
  await inventoryPage.verifyProductContainerHighToLow();

  await page.close();
});

test('Add multiply item into the cart', async ({ page }) => {

  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);

  await loginPage.goToLoginPage();
  await loginPage.login('standard_user', 'secret_sauce');
  await inventoryPage.verifyCartCount(0); 
  await inventoryPage.addMultiplyItemToCart();
  await inventoryPage.verifyRemoveButtonVisbilityAfterAddingToCart();
  await inventoryPage.verifyCartCount(6);
  //await inventoryPage.removeOneItem();
  await inventoryPage.removeAllItem();
  await inventoryPage.verifyCartCount(0); 

  await page.close();


});

test("Verify random item added to cart", async ({ page }) => {
  
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);

  await loginPage.goToLoginPage();
  await loginPage.login('standard_user', 'secret_sauce');
  await inventoryPage.addRandomItemToCart(2);
  await inventoryPage.verifyRemoveButtonVisbilityAfterAddingToCart();
  await inventoryPage.verifyCartCount(2);

  await page.close();

});

test('Click on Product name', async ({page}) => {

  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);

  await loginPage.goToLoginPage();
  //await inventoryPage.clickProductName();
  //await inventoryPage.verifyCartCount(1);
  //await inventoryPage.clickProductImg();
  //await inventoryPage.addItemToCartFromDetailPage();
  await inventoryPage.addAllItemsFromDetailPage('image');
  await inventoryPage.verifyCartCount(6);
  await inventoryPage.resetAppState();
  await inventoryPage.verifyCartCount(0);
  //await inventoryPage.addItemToCartFromDetailPage();
  
})

test('Login Logout', async ({page}) => {

  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);

  await loginPage.goToLoginPage();
  await inventoryPage.logoutSideBar();
})

test('Login--> About', async ({page}) => {

  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);

  await loginPage.goToLoginPage();
  await inventoryPage.aboutSideBar();
})

test('Verify sorting after adding an item into the cart', async ({page}) => {

  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);

  await loginPage.goToLoginPage();
  await loginPage.login('standard_user', 'secret_sauce'); 
  await inventoryPage.addOneItemToCart();
  await inventoryPage.verifyProductContainerZA();
})

test('Verify sorting after adding an item into the cart from the product detail page', async ({page}) => {

  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);

  await loginPage.goToLoginPage();
  await loginPage.login('standard_user', 'secret_sauce'); 
  await inventoryPage.clickProductName();
  await inventoryPage.verifyProductContainerZA();
  await inventoryPage.verifyProductContainerLowToHigh();
})

test('Verify different image per item', async ({page}) => {

  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);

  await loginPage.goToLoginPage();
  await loginPage.login('standard_user', 'secret_sauce'); 
  await inventoryPage.verifyDifferentImagePerItem();
})

//This test should failed
test('Verify items name accuracy', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.goToLoginPage();
    await loginPage.login('standard_user', 'secret_sauce');
    await loginPage.verifyLoginSuccess();
    await inventoryPage.verifyItemsNameInCart();
    await page.close();
    
})

//The cart will become empty but the item will button remain in the cart
test('Verify Rest App state', async ({page}) => {

  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);

  await loginPage.goToLoginPage();
  await loginPage.login('standard_user', 'secret_sauce'); 
  await inventoryPage.addOneItemToCart();
  await inventoryPage.verifyCartCount(1);
  await inventoryPage.resetAppState();
  await page.reload();
  await inventoryPage.verifyCartCount(0);

})