
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { test } from '../../pages/index';


test('User can add item to cart', async ({ loginPage, inventoryPage}) => {
  
  await loginPage.goToLoginPage();
  await loginPage.login('standard_user', 'secret_sauce'); // Not needed because we are using storageState
  //await inventoryPage.addOneRandomItemToCart();
  //await inventoryPage.addProductToCart('Sauce Labs Backpack');
  await inventoryPage.addProductFromInventoryPage('Sauce Labs Backpack');
  await inventoryPage.verifyRemoveButtonVisbilityAfterAddingToCart();
  await inventoryPage.goToCartPage();
  await inventoryPage.verifyCartCount(1);
  
});

test('Verify content in inventory page', async ({ loginPage, inventoryPage, page }) => {

  await inventoryPage.interceptImageRequests();
  await loginPage.goToLoginPage();
  await loginPage.login('standard_user', 'secret_sauce');
  await inventoryPage.verifyInventoryPageItem();
  await inventoryPage.verifyImagePerItem(); 
  await inventoryPage.verifyInventoryPage();
  await inventoryPage.verifyCartCount(0);
  await inventoryPage.logoutPage();
  
});

test('Verify sorting Martix', async ({ loginPage, inventoryPage, page }) => {

  await loginPage.goToLoginPage();
  await loginPage.login('standard_user', 'secret_sauce');
  await inventoryPage.verifyProductSortContainerAZ();
  await inventoryPage.verifyProductContainerZA();
  await inventoryPage.verifyProductContainerLowToHigh();
  await inventoryPage.verifyProductContainerHighToLow();

});

test('Verify sorting ZA', async ({ loginPage, inventoryPage, page }) => {

  await loginPage.goToLoginPage();
  await loginPage.login('standard_user', 'secret_sauce');
  await inventoryPage.VerifyProductSortZA();

});

test('Verify sorting LOHI', async ({ loginPage, inventoryPage, page }) => {

  await loginPage.goToLoginPage();
  await loginPage.login('standard_user', 'secret_sauce');
  await inventoryPage.VerifyProductSortLOHI();

});

test('Add multiply item into the cart', async ({ loginPage, inventoryPage, page }) => {

  await loginPage.goToLoginPage();
  await loginPage.login('standard_user', 'secret_sauce');
  await inventoryPage.verifyCartCount(0); 
  await inventoryPage.addMultiplyItemToCart();
  await inventoryPage.verifyRemoveButtonVisbilityAfterAddingToCart();
  await inventoryPage.verifyCartCount(6);
  await inventoryPage.removeAllItem();
  await inventoryPage.verifyCartCount(0); 

});

test("Verify random item added to cart", async ({ loginPage, inventoryPage, page }) => {
  
  await loginPage.goToLoginPage();
  await loginPage.login('standard_user', 'secret_sauce');
  //await inventoryPage.addRandomItemToCart(2);
  await inventoryPage.addProductFromInventoryPage('Sauce Labs Backpack');
  await inventoryPage.addProductFromInventoryPage('Sauce Labs Bike Light');
  await inventoryPage.verifyRemoveButtonVisbilityAfterAddingToCart();
  await inventoryPage.verifyCartCount(2);

});

test('Click on Product name and add to cart', async ({loginPage, inventoryPage, page}) => {

  await loginPage.goToLoginPage();
  await loginPage.login('standard_user', 'secret_sauce');
  //await inventoryPage.clickProductName();
  await inventoryPage.addProductFromDetailPage('Sauce Labs Backpack');
  await inventoryPage.verifyCartCount(1);
})

test('Click on Product image and add to cart', async ({loginPage, inventoryPage, page}) => {

  await loginPage.goToLoginPage();
  await loginPage.login('standard_user', 'secret_sauce');
  await inventoryPage.clickProductImg();
  await inventoryPage.verifyCartCount(1);

})

test('Click on all Product name and add to cart', async ({loginPage, inventoryPage, page}) => {

  await loginPage.goToLoginPage();
  await loginPage.login('standard_user', 'secret_sauce');
  await inventoryPage.addItemToCartFromDetailPage(); //All Items
  await inventoryPage.verifyCartCount(6);

})

test('Click on all Product images and add to cart', async ({loginPage, inventoryPage, page}) => {

  await loginPage.goToLoginPage();
  await loginPage.login('standard_user', 'secret_sauce');
  await inventoryPage.addImgToCartFromDetailPageByImg(); //All Items
  await inventoryPage.verifyCartCount(6);

})

test('Login Logout', async ({loginPage, inventoryPage, page}) => {

  await loginPage.goToLoginPage();
  await loginPage.login('standard_user', 'secret_sauce');
  await inventoryPage.logoutSideBar();
  
})

test('Login--> About', async ({loginPage, inventoryPage, page, basePage}) => {

  await loginPage.goToLoginPage();
  await loginPage.login('standard_user', 'secret_sauce');
  await inventoryPage.aboutSideBar();
  await basePage.getCurrentCookies();
})

test('Login--> About(New Tab)', async ({loginPage, inventoryPage, page}) => {

  await loginPage.goToLoginPage();
  await loginPage.login('standard_user', 'secret_sauce');
  const newTab = await inventoryPage.middleClickForNewTabAboutSideBar();
  await newTab.close();
})

test('Verify sorting after adding an item into the cart', async ({loginPage, inventoryPage,page}) => {

  await loginPage.goToLoginPage();
  await loginPage.login('standard_user', 'secret_sauce'); 
  //await inventoryPage.addOneRandomItemToCart();
  await inventoryPage.addProductFromDetailPage('Sauce Labs Backpack');
  await inventoryPage.verifyProductContainerZA();
  
})

test('Verify sorting after adding an item into the cart from the product detail page', async ({loginPage, inventoryPage, page}) => {

  await loginPage.goToLoginPage();
  await loginPage.login('standard_user', 'secret_sauce'); 
  await inventoryPage.clickProductName();
  await inventoryPage.verifyProductContainerZA();
  await inventoryPage.verifyProductContainerLowToHigh();
  
})

test('Verify different image per item', async ({loginPage, inventoryPage, page}) => {

  await loginPage.goToLoginPage();
  await loginPage.login('standard_user', 'secret_sauce'); 
  await inventoryPage.interceptImageRequests();
  await inventoryPage.verifyDifferentImagePerItem();

})

//This test should failed
test('Verify items name accuracy', async ({loginPage, inventoryPage, page }) => {
   
    await loginPage.goToLoginPage();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.verifyItemsNameInCart();

})

//The cart will become empty but the item will button remain in the cart
test('Verify Reset App state', async ({loginPage, inventoryPage, page}) => {

  await loginPage.goToLoginPage();
  await loginPage.login('standard_user', 'secret_sauce'); 
  //await inventoryPage.addOneRandomItemToCart();
  await inventoryPage.addProductFromInventoryPage('Sauce Labs Backpack');
  await inventoryPage.verifyCartCount(1);
  await inventoryPage.resetAppState();
  await page.reload();
  await inventoryPage.verifyCartCount(0);
})

test('Verify details first item between inventory page and detail page', async ({loginPage, inventoryPage, page }) => {
    
    await loginPage.goToLoginPage();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.compareInventoryPageInfoAndDetailPageInfo(0);
    await inventoryPage.compareInventoryPageInfoAndDetailPageInfo(1);
    await inventoryPage.compareInventoryPageInfoAndDetailPageInfo(2);
    await inventoryPage.compareInventoryPageInfoAndDetailPageInfo(3);
    await inventoryPage.compareInventoryPageInfoAndDetailPageInfo(4);
    await inventoryPage.compareInventoryPageInfoAndDetailPageInfo(5); 
    
})

test('Get all items name', async ({loginPage, inventoryPage, page }) => {
    
    await loginPage.goToLoginPage();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.displayAllItemsName();
})

test('Get all items prices', async ({loginPage, inventoryPage, page }) => {
    
    await loginPage.goToLoginPage();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.displayAllPricesName();
})

test('Get all items descriptions', async ({loginPage, inventoryPage, page }) => {
    
    await loginPage.goToLoginPage();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.displayAllDescriptionsName();

})

test('Stress Test Add product to cart', async ({loginPage, inventoryPage, page }) => {
    
    await loginPage.goToLoginPage();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.stressUIaddProductToCart('Backpack',10);
    await inventoryPage.stressUIaddProductToCart('Bike Light',15);
    await inventoryPage.stressUIaddProductToCart('Bolt T-shirt',20);
    await inventoryPage.stressUIaddProductToCart('Fleece Jacket',30);
    await inventoryPage.stressUIaddProductToCart('Onesie',40);
    await inventoryPage.stressUIaddProductToCart('T-shirt (Red)',50);
})

test('Stress Test Add Multiple product to cart', async ({loginPage, inventoryPage, page }) => {
    
    await loginPage.goToLoginPage();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.stressUIaddMultipleProductToCart(5);
})