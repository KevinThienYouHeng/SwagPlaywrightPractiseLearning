//Learning with AI as i want to understood the fundemental of API Testing
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { BasePage } from '../../pages/Basepage';
import Database from 'better-sqlite3';
import path from 'path';

test('intercept SauceDemo requests', async ({ page }) => {
  // Intercept any request to saucedemo
  await page.route('**/*.json', async route => {
    console.log('Intercepted:', route.request().url());
    await route.continue(); // let it continue normally
  });

  await page.goto('https://www.saucedemo.com');
});

test('Learn Route Continue', async ({ page }) => {
  const loginpage = new LoginPage(page);
   
  await page.route('**/*', async route => {
    const url = route.request().url();
    const method = route.request().method();
    const resource = route.request().resourceType();
    
    console.log(`📮 Request: ${method} → ${url}`);
    console.log(`   Resource Type: ${resource}`);
    await route.continue(); 
  });

  await page.goto('https://www.saucedemo.com');
  await loginpage.login('standard_user', 'secret_sauce');
  await page.close();
  //await loginpage.clickLoginButton();
});


test('mock product list', async ({ page }) => {
  // Intercept and return fake products
  await page.route('**/inventory*', async route => {
    await route.fulfill({
      status: 200,
      body: 'Fake product page content'
    });
  });

  await page.goto('https://www.saucedemo.com/inventory.html');
});

test('Learn Route fulfill', async ({ page}) => {

    const loginpage = new LoginPage(page);
    const inventorypage = new InventoryPage(page);
    const basepage = new BasePage(page);

        // Intercept ALL image requests
    await page.route('**/*.jpg', async route => {
        // FAKE a failed image response
        await route.fulfill({
            status: 404,  // image not found!
            body: ''      // empty — no image data
        });
        // Real server never gets the request!
    });

  await loginpage.goToLoginPage();
  await loginpage.login('standard_user', 'secret_sauce');
  //await loginpage.clickLoginButton();
  await inventorypage.verifyInventoryPageUrl();
  await basepage.takeScreenshot('inventory-page.png');
  //await inventorypage.verifyItemsNameInCart();
  
})

test('shows error when page fails to load', async ({ page }) => {

    const loginpage = new LoginPage(page);
    const inventorypage = new InventoryPage(page);
  // Intercept the inventory page request
  await page.route('**/inventory.html', async route => {
    // Fake a server crash!
    await route.fulfill({
      status: 500,
      contentType: 'text/html',
      body: '<h1>Server Error</h1><p>Something went wrong!</p>'
    });
  });

//   await loginpage.goToLoginPage();
//   await loginpage.login('standard_user', 'secret_sauce');
//   await loginpage.clickLoginButton();
//   await inventorypage.verifyInventoryPageUrl();
  await inventorypage.goToInventoryPage();
  // Verify error page shows
  await expect(page.getByText('Server Error')).toBeVisible();
});

test('Verify Sauce Demo is reachable', async ({ page }) => {
  
    const basePage = new BasePage(page);
    await basePage.validatePageIsReachable('https://www.saucedemo.com/');
    await page.close();

});
