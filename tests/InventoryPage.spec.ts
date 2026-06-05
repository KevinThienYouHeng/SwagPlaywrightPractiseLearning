
import { LoginPage } from './LoginPage';
import { InventoryPage } from './InventoryPage';
import { test } from './index';


test('User can add item to cart', async ({ loginPage, inventoryPage}) => {
  
  await loginPage.goToLoginPage();
  await loginPage.login('standard_user', 'secret_sauce'); // Not needed because we are using storageState
  await inventoryPage.addOneRandomItemToCart();
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
  await page.close();
});

test('Verify sorting Martix', async ({ loginPage, inventoryPage, page }) => {

  await loginPage.goToLoginPage();
  await loginPage.login('standard_user', 'secret_sauce');
  await inventoryPage.verifyProductSortContainerAZ();
  await inventoryPage.verifyProductContainerZA();
  await inventoryPage.verifyProductContainerLowToHigh();
  await inventoryPage.verifyProductContainerHighToLow();

  await page.close();
});

test('Verify sorting ZA', async ({ loginPage, inventoryPage, page }) => {

  await loginPage.goToLoginPage();
  await loginPage.login('standard_user', 'secret_sauce');
  await inventoryPage.VerifyProductSortZA();

  await page.close();
});

test('Verify sorting LOHI', async ({ loginPage, inventoryPage, page }) => {

  await loginPage.goToLoginPage();
  await loginPage.login('standard_user', 'secret_sauce');
  await inventoryPage.VerifyProductSortLOHI();

  await page.close();
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

  await page.close();


});

test("Verify random item added to cart", async ({ loginPage, inventoryPage, page }) => {
  
  await loginPage.goToLoginPage();
  await loginPage.login('standard_user', 'secret_sauce');
  await inventoryPage.addRandomItemToCart(2);
  await inventoryPage.verifyRemoveButtonVisbilityAfterAddingToCart();
  await inventoryPage.verifyCartCount(2);

  await page.close();

});

test('Click on Product name and add to cart', async ({loginPage, inventoryPage, page}) => {

  await loginPage.goToLoginPage();
  await loginPage.login('standard_user', 'secret_sauce');
  await inventoryPage.clickProductName();
  await inventoryPage.verifyCartCount(1);

  await page.close();
  
})

test('Click on Product image and add to cart', async ({loginPage, inventoryPage, page}) => {

  await loginPage.goToLoginPage();
  await loginPage.login('standard_user', 'secret_sauce');
  await inventoryPage.clickProductImg();
  await inventoryPage.verifyCartCount(1);
  
  await page.close();
})

test('Click on all Product name and add to cart', async ({loginPage, inventoryPage, page}) => {

  await loginPage.goToLoginPage();
  await loginPage.login('standard_user', 'secret_sauce');
  await inventoryPage.addItemToCartFromDetailPage();
  await inventoryPage.verifyCartCount(6);

  await page.close();
  
})

test('Click on all Product images and add to cart', async ({loginPage, inventoryPage, page}) => {

  await loginPage.goToLoginPage();
  await loginPage.login('standard_user', 'secret_sauce');
  await inventoryPage.addImgToCartFromDetailPageByImg();
  await inventoryPage.verifyCartCount(6);

  await page.close();
  
})

test('Login Logout', async ({loginPage, inventoryPage, page}) => {

  await loginPage.goToLoginPage();
  await loginPage.login('standard_user', 'secret_sauce');
  await inventoryPage.logoutSideBar();
  await page.close();
})

test('Login--> About', async ({loginPage, inventoryPage, page}) => {

  await loginPage.goToLoginPage();
  await loginPage.login('standard_user', 'secret_sauce');
  await inventoryPage.aboutSideBar();
  await page.close();
})

test('Verify sorting after adding an item into the cart', async ({loginPage, inventoryPage,page}) => {

  await loginPage.goToLoginPage();
  await loginPage.login('standard_user', 'secret_sauce'); 
  await inventoryPage.addOneRandomItemToCart();
  await inventoryPage.verifyProductContainerZA();
  await page.close();
})

test('Verify sorting after adding an item into the cart from the product detail page', async ({loginPage, inventoryPage, page}) => {

  await loginPage.goToLoginPage();
  await loginPage.login('standard_user', 'secret_sauce'); 
  await inventoryPage.clickProductName();
  await inventoryPage.verifyProductContainerZA();
  await inventoryPage.verifyProductContainerLowToHigh();
  await page.close();
})

test('Verify different image per item', async ({loginPage, inventoryPage, page}) => {

  await loginPage.goToLoginPage();
  await loginPage.login('standard_user', 'secret_sauce'); 
  await inventoryPage.interceptImageRequests();
  await inventoryPage.verifyDifferentImagePerItem();
  await page.close();
})

//This test should failed
test('Verify items name accuracy', async ({loginPage, inventoryPage, page }) => {
   
    await loginPage.goToLoginPage();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.verifyItemsNameInCart();
    await page.close();
    
})

//The cart will become empty but the item will button remain in the cart
test('Verify Reset App state', async ({loginPage, inventoryPage, page}) => {

  await loginPage.goToLoginPage();
  await loginPage.login('standard_user', 'secret_sauce'); 
  await inventoryPage.addOneRandomItemToCart();
  await inventoryPage.verifyCartCount(1);
  await inventoryPage.resetAppState();
  await page.reload();
  await inventoryPage.verifyCartCount(0);
  await page.close();

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
    await page.close();
    
})

test('Get all items name', async ({loginPage, inventoryPage, page }) => {
    
    await loginPage.goToLoginPage();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.displayAllItemsName();
    await page.close();
    
})

test('Get all items prices', async ({loginPage, inventoryPage, page }) => {
    
    await loginPage.goToLoginPage();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.displayAllPricesName();
    await page.close();
    
})

test('Get all items descriptions', async ({loginPage, inventoryPage, page }) => {
    
    await loginPage.goToLoginPage();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.displayAllDescriptionsName();
    await page.close();
    
})