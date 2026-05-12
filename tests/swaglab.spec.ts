import { test, expect } from '@playwright/test';
import Axe from '@axe-core/playwright';

test('Login and see the products page', async ({ page }) => {
  // Navigation goes straight to the inventory because of the storageState
  await page.goto('https://www.saucedemo.com/inventory.html');
  
  const title = await page.locator('.title');
  await expect(title).toHaveText('Products');
  
  await page.reload();
  await expect(page.url()).toBe('https://www.saucedemo.com/inventory.html');
  console.log('Successfully logged in and navigated to the products page.');
});

test('Visibility the product details page', async ({ page }) => {

    await page.goto('https://www.saucedemo.com/inventory.html');
    
    //await expect(page.getByRole(icon, '.react-burger-menu-btn')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Open Menu' })).toBeVisible;
    await expect(page.getByText('Swag Labs')).toBeVisible();
    await expect(page.locator('[data-test="shopping-cart-link"]')).toBeVisible();
    //See title of the website
    //await expect(page.locator('[data-test="primary-header"]')).toContainText('Swag Labs');
    //await expect(page.locator('[data-test="primary-header"]')).toMatchAriaSnapshot(`- text: Swag Labs`);
    await page.locator('[data-test="secondary-header"]').click();
    await expect(page.locator('.title')).toHaveText('Products');
    await expect(page.locator('[data-test="product-sort-container"]')).toBeVisible();

    await page.locator('[data-test="inventory-container"]').click();

    
    // await expect(page.locator('[data-test="item-4-img-link"]')).toBeVisible();
    // await expect(page.locator('[data-test="item-4-title-link"]')).toBeVisible();
    // await expect(page.getByText('carry.allTheThings() with the')).toBeVisible();
    // await expect(page.getByText('$29.99')).toBeVisible();
    // await expect(page.locator('[data-test="add-to-cart-sauce-labs-backpack"]')).toBeVisible();
    const products = page.locator('.inventory_item');
    const allProducts = await products.all();

    for (const product of allProducts) {
    // Check that the product card is visible
    await expect(product).toBeVisible();

    // You can even check things INSIDE each product
    const name = product.locator('.inventory_item_name');
    const price = product.locator('.inventory_item_price');

    await expect(name).not.toBeEmpty();
    console.log(`Verified product name: ${await name.textContent()}`);
    await expect(price).toContainText('$');
    console.log(`Verified product price: ${await price.textContent()}`);
  }

  console.log(`Successfully verified ${allProducts.length} products.`);
    
   await expect(page.locator('.social_twitter')).toBeVisible();
   await expect(page.locator('.social_facebook')).toBeVisible();
   await expect(page.locator('.social_linkedin')).toBeVisible();
    
   await expect(page.locator('.footer_copy')).toHaveText('© 2026 Sauce Labs. All Rights Reserved. Terms of Service | Privacy Policy'); 

});

// test.describe('Image test with slow mode', () => {
  
//     test.use({
//       storageState: 'user.json',
//       launchOptions: {
//         slowMo: 500,
//       },
//       headless: false,
//     });

//     test('Verify Image is visible for each item', async ({page}) => {

//       //const page = await browser.newPage();

//       await page.goto('https://www.saucedemo.com/inventory.html');

//       //locate the images html 
//       const products = page.locator('.inventory_item_img img');
//       const allProducts = await products.count(); //Count how many it has
      

//       // Do a loop based on how many products and verify its content one by one
//       for ( let i = 0 ; i< allProducts ; i++){
//         //const image = page.locator('.inventory_item_img').nth(i);
//         const isLoaded = await products.nth(i).evaluate(img => {
//           const image = img as HTMLImageElement;
//           return image.complete && image.naturalWidth > 0;
//         });
        
//         const src = await products.nth(i).getAttribute('src');
//         expect(isLoaded).toBe(true);
//         //await expect(image).toBeVisible();
//         console.log(`Verified product image: ${src}`);
//       }
//           // for (const product of allProducts) {
//           //   // Check that the product card is visible
//           //   await expect(product).toBeVisible();

//           //   // You can even check things INSIDE each product
//           //   const image = product.locator('.inventory_item_img');
//           //   await expect(image).toBeVisible();
//           //   console.log(`Verified product image: ${await image.getAttribute('src')}`);
//           // }
//     });
// });

test('Verify Image is visible for each item', async ({page}) => {

      //const page = await browser.newPage();

      await page.goto('https://www.saucedemo.com/inventory.html');

      //locate the images html 
      const products = page.locator('.inventory_item_img img');
      const allProducts = await products.count(); //Count how many it has
      

      // Do a loop based on how many products and verify its content one by one
      for ( let i = 0 ; i< allProducts ; i++){
        //const image = page.locator('.inventory_item_img').nth(i);
        const isLoaded = await products.nth(i).evaluate(img => {
          const image = img as HTMLImageElement;
          return image.complete && image.naturalWidth > 0;
        });
        
        const src = await products.nth(i).getAttribute('src');
        expect(isLoaded).toBe(true);
        //await expect(image).toBeVisible();
        console.log(`Verified product image: ${src}`);
      }
          // for (const product of allProducts) {
          //   // Check that the product card is visible
          //   await expect(product).toBeVisible();

          //   // You can even check things INSIDE each product
          //   const image = product.locator('.inventory_item_img');
          //   await expect(image).toBeVisible();
          //   console.log(`Verified product image: ${await image.getAttribute('src')}`);
          // }
    });

test('Dropdown Name(A to Z) and compare the first and last product', async ({ page }) => {


  await page.goto('https://www.saucedemo.com/inventory.html');
  await expect(page.locator('[data-test="product-sort-container"]')).toBeVisible();
  await page.locator('[data-test="product-sort-container"]').selectOption('az');

  const firstProductName = await page.locator('.inventory_item_name').first().textContent();
  const lastProductName = await page.locator('.inventory_item_name').last().textContent();

  console.log(`First product name: ${firstProductName}`);
  console.log(`Last product name: ${lastProductName}`);
  expect(firstProductName).toBe('Sauce Labs Backpack');
  expect(lastProductName).toBe('Test.allTheThings() T-Shirt (Red)');
});

test('Dropdown Name(Z to A) and compare the first and last product', async ({ page }) => {

  await page.goto('https://www.saucedemo.com/inventory.html');
  await expect(page.locator('[data-test="product-sort-container"]')).toBeVisible();
  await page.locator('[data-test="product-sort-container"]').selectOption('za');
  //Another way to select the dropdown option
  //await page.selectOption('[data-test="product-sort-container"]', 'za');

  const firstProductName = await page.locator('.inventory_item_name').first().textContent();
  const lastProductName = await page.locator('.inventory_item_name').last().textContent();

  console.log(`First product name: ${firstProductName}`);
  console.log(`Last product name: ${lastProductName}`);
  expect(firstProductName).toBe('Test.allTheThings() T-Shirt (Red)');
  expect(lastProductName).toBe('Sauce Labs Backpack');
});

test('Dropdown Name(Z to A) and compare all products', async ({ page }) => {

  await page.goto('https://www.saucedemo.com/inventory.html');
  await expect(page.locator('[data-test="product-sort-container"]')).toBeVisible();
  await page.selectOption('[data-test="product-sort-container"]', 'za');
  const productNames = await page.locator('.inventory_item_name').allTextContents();
  const expectedProductNames = [...productNames].sort().reverse();

  console.log('Product names on the page:', productNames);
  console.log('Expected product names (sorted Z to A):', expectedProductNames);

  expect(productNames).toEqual(expectedProductNames);

});

test('Dropdown Price(Low to High) and compare first and last products', async ({ page }) => {

  await page.goto('https://www.saucedemo.com/inventory.html');
  await expect(page.locator('[data-test="product-sort-container"]')).toBeVisible();
  await page.selectOption('[data-test="product-sort-container"]', 'lohi');
  const firstProductPrice = await page.locator('.inventory_item_price').first().textContent();
  const lastProductPrice = await page.locator('.inventory_item_price').last().textContent();

  console.log(`First product price: ${firstProductPrice}`);
  console.log(`Last product price: ${lastProductPrice}`);

});

test('Dropdown Price(High to Low) and compare first and last products', async ({ page }) => {

  await page.goto('https://www.saucedemo.com/inventory.html');
  await expect(page.locator('[data-test="product-sort-container"]')).toBeVisible();
  await page.selectOption('[data-test="product-sort-container"]', 'hilo');
  //Get the name and price of the first and last product
  const firstProductName = await page.locator('.inventory_item_name').first().textContent();
  const lastProductName = await page.locator('.inventory_item_name').last().textContent();
  const firstProductPrice = await page.locator('.inventory_item_price').first().textContent();
  const lastProductPrice = await page.locator('.inventory_item_price').last().textContent();

  console.log(`First product name: ${firstProductName}, price: ${firstProductPrice}`);
  console.log(`Last product name: ${lastProductName}, price: ${lastProductPrice}`);

});

test('Dropdown Price(High to Low) and compare all products', async ({ page }) => {
  //first version with rough idea of what to do
  await page.goto('https://www.saucedemo.com/inventory.html');
  await expect(page.locator('[data-test="product-sort-container"]')).toBeVisible();
  await page.selectOption('[data-test="product-sort-container"]', 'hilo');
  //await expect(page.locator('.inventory_item')).toBeVisible({timeout: 5000});
  //console.log('Wait for 5 seconds to ensure prices are loaded');
  const productPrices = await page.locator('.inventory_item_price').allTextContents();
  const expectedProductPrices = [...productPrices].sort((a, b) => parseFloat(b.replace('$', '')) - parseFloat(a.replace('$', '')));
  console.log(`All product prices (sorted): ${productPrices.join(', ')}`);
  console.log(`Expected product prices (sorted): ${expectedProductPrices.join(', ')}`);
  expect(productPrices).toEqual(expectedProductPrices);
});

test('Add to cart and check the cart badge', async ({ page }) => {

    await page.goto('https://www.saucedemo.com/inventory.html');
    await expect(page.locator('[data-test="add-to-cart-sauce-labs-backpack"]')).toBeVisible();
    //await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    const cartBadge = page.locator('.shopping_cart_badge');
    await expect(cartBadge).toHaveText('1');
    console.log('Successfully added product to cart and verified the cart badge.');

});

/*
Click nth(0) (1st item). It changes to "Remove". Now there are only 5 "Add to cart" buttons left.

Click nth(1) (Originally the 2nd item, but now it's the new 2nd button).

By the time you get to i = 3, you have already changed 3 buttons to "Remove." There might only be 3 buttons left that say "Add to cart." Asking for nth(3) (the 4th one) results in an empty search.
*/
//Never fix this code for learning purpose, this is to show the importance of using the first() method when clicking on the "Add to cart" buttons in a loop. If we use nth(i) instead of first(), we will end up with an empty search after a few iterations because the buttons change to "Remove" and there are fewer "Add to cart" buttons available. Using first() ensures that we always target the next available "Add to cart" button, regardless of how many have been clicked already.
test.skip('Add multiple products to cart and check the cart badge', async ({ page }) => {

    await page.goto('https://www.saucedemo.com/inventory.html');
    await page.setViewportSize({ width: 1280, height: 1600 });
    //Using loop to add all product one by one and console log the name of the product added to cart
    const addToCartButtons = page.getByRole('button', { name: 'Add to cart' });
    const buttonCount = await addToCartButtons.all();
    console.log(buttonCount.length);
    
    for(const button of buttonCount) {
        //const productName = await button.locator('..').locator('.inventory_item_name').textContent();
        //await button.scrollIntoViewIfNeeded();
        await button.first().click({force: true});
        //await expect(button).toHaveText('Remove');
        //console.log(`Added product to cart: ${productName}`);
    }


});

test('Add multiple products to cart and check the cart badge 2', async ({ page }) => {

  await page.goto('https://www.saucedemo.com/inventory.html');

  const buttonSelector = 'button:has-text("Add to cart")';
  
  // Find out how many buttons exist total
  const count = await page.locator(buttonSelector).count();

  //Looping for adding all products into the cart
  for (let i = 0; i < count; i++) {
    // We always target the FIRST available "Add to cart" button.
    // As buttons change to "Remove", the "first" one will always be the next available item.
    await page.locator(buttonSelector).first().click();
    const cartBadge = page.locator('.shopping_cart_badge');
    const productName = await page.locator('.inventory_item_name').nth(i).textContent();
    console.log(`Added product ${i + 1} to cart: ${productName}`);
    await expect(cartBadge).toHaveText((i + 1).toString());
  }

  //Do the remove part
  await expect(page.locator('.shopping_cart_badge')).toHaveText(count.toString());

  const removeButtons = page.getByRole('button', { name: 'Remove' });
  const removeCount = await removeButtons.count();
  console.log(`Total "Remove" buttons after adding to cart: ${removeCount}`);
  await expect(removeButtons).toHaveCount(count);

  for (let i = 0; i < removeCount; i++) {
    await removeButtons.first().click();
    const cartBadge = page.locator('.shopping_cart_badge');
    const remainingCount = removeCount - (i + 1);
    console.log(`Removed product ${i + 1} from cart. Remaining products: ${remainingCount}`);
    //await expect(cartBadge).toHaveText(remainingCount > 0 ? remainingCount.toString() : '');
  }


});

test('Click on the product and see the details page', async ({ page }) => {

    await page.goto('https://www.saucedemo.com/inventory.html');
    await page.locator('.inventory_item_name').first().click();
    await expect(page.locator('.inventory_details_name')).toHaveText('Sauce Labs Backpack');
    await expect(page.locator('.inventory_details_desc')).toHaveText('carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.');
    await expect(page.locator('.inventory_details_price')).toHaveText('$29.99');
    await page.locator('button', { hasText: 'Add to cart' }).click();
    const cartBadge = page.locator('.shopping_cart_badge');
    await expect(cartBadge).toHaveText('1');
    console.log('Successfully added product to cart and verified the cart badge.');

    await page.locator('button', { hasText: 'Back to products' }).click();
    const removeButtons = page.getByRole('button', { name: 'Remove' });
    await expect(removeButtons).toBeVisible();


});

test('Remove product from cart and check the cart badge', async ({ page }) => {


  await page.goto('https://www.saucedemo.com/inventory.html');

  const buttonSelector = 'button:has-text("Add to cart")';
  
  // Find out how many buttons exist total
  const count = await page.locator(buttonSelector).count();

  for (let i = 0; i < count; i++) {
    // We always target the FIRST available "Add to cart" button.
    // As buttons change to "Remove", the "first" one will always be the next available item.
    await page.locator(buttonSelector).first().click();
    const cartBadge = page.locator('.shopping_cart_badge');
    const productName = await page.locator('.inventory_item_name').nth(i).textContent();
    console.log(`Added product ${i + 1} to cart: ${productName}`);
    await expect(cartBadge).toHaveText((i + 1).toString());
  }

  await expect(page.locator('.shopping_cart_badge')).toHaveText(count.toString());

  await page.locator('.shopping_cart_badge').click();

  const removeButtons = page.getByRole('button', { name: 'Remove' });
  const removeCount = await removeButtons.count();

  for (let i = 0; i < removeCount; i++) {
    await removeButtons.first().click();
    //const cartBadge = page.locator('.shopping_cart_badge');
    const remainingCount = removeCount - (i + 1);
    console.log(`Removed product ${i + 1} from cart. Remaining products: ${remainingCount}`);
    //console.log(`Cart badge text: ${await cartBadge.textContent()}`);
    //await expect(cartBadge).toHaveText(remainingCount > 0 ? remainingCount.toString() : '');
  }

  //await page.locator('.continue_shopping').click();
  // const back = await page.getByRole('button', {name : 'Continue Shopping'});
  // await page(back).click();
  await page.locator('[data-test="continue-shopping"]').click();
  
});



test('Add one product and checkout', async ({ page }) => {
  
  await page.goto('https://www.saucedemo.com/inventory.html');
  await page.locator('.inventory_item_name').first().click();
  await page.locator('button', { hasText: 'Add to cart' }).click();
  const cartBadge = page.locator('.shopping_cart_badge');
  await cartBadge.click();
  await page.locator('[data-test="checkout"]').click();
  await page.locator('#first-name').fill('John');
  await page.locator('#last-name').fill('Leclerc');
  await page.locator('#postal-code').fill('81000');
  await page.locator('[data-test="continue"]').click();
  await page.locator('[data-test="finish"]').click();
  await page.locator('[data-test="back-to-products"]').click();
  const cartBadge1 = page.locator('.shopping_cart_badge');
  await expect(cartBadge1).toBeHidden();
  console.log('Cart badge is hidden');


  // if( cartBadge === cartBadge1){
  //   await expect(cartBadge).toHaveText('0');
  //   console.log('Cart badge is 0');
  // }
  //await expect(cartBadge).toHaveText('0');

});

test('Add two products and checkout', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/inventory.html');
  await page.locator('.inventory_item_name').first().click();
  await page.locator('button', { hasText: 'Add to cart' }).click();
  await page.getByRole('button', { name: 'Back to products' }).click();
  await page.locator('.inventory_item_name').nth(1).click();
  await page.locator('button', { hasText: 'Add to cart' }).click();
  const cartBadge = page.locator('.shopping_cart_badge');
  await cartBadge.click();
  await page.locator('[data-test="checkout"]').click();
  await page.locator('#first-name').fill('John');
  await page.locator('#last-name').fill('Leclerc');
  await page.locator('#postal-code').fill('81000');
  await page.locator('[data-test="continue"]').click();

  const currentCartBadge = await page.locator('.shopping_cart_badge').textContent();
  const cartCount = currentCartBadge ? parseInt(currentCartBadge, 10) : 0;
  

  for(let i = 0; i < cartCount; i++){
    console.log('Current item in Checkout')
    const productName = await page.locator('.inventory_item_name').nth(i).textContent();
    console.log(productName);
    const productPrice = await page.locator('.inventory_item_price').nth(i).textContent();
    console.log(productPrice);
  }

  const payment =await page.locator('[data-test="payment-info-value"]').textContent();
  console.log(payment);

  const shipping = await page.locator('[data-test="shipping-info-value"]').textContent();
  console.log(shipping);

  const price = await page.locator('[data-test="subtotal-label"]').textContent();
  console.log(price);

  const tax = await page.locator('[data-test="tax-label"]').textContent();
  console.log(tax);
  
  const totalPrice = await page.locator('[data-test="total-label"]').textContent();
  console.log(totalPrice);


  await page.locator('[data-test="finish"]').click();
  await page.locator('[data-test="back-to-products"]').click();
  const cartBadge1 = page.locator('.shopping_cart_badge');
  await expect(cartBadge1).toBeHidden();
  console.log('Cart badge is hidden');
});

test('Accesibility test', async ({ page }) => {
  
  await page.goto('https://www.saucedemo.com/inventory.html');
  const accessibilityScanResults = await new Axe({ page }).analyze();
  console.log('Accessibility Violations:', accessibilityScanResults.violations);
});

test('Verify added items appear in cart with correct name and price', async ({ page }) => {

  await page.goto('https://www.saucedemo.com/inventory.html');
  await page.getByRole('button', { name: 'Add to cart' }).first().click();
  await page.locator('.shopping_cart_badge').click();
  const cartItemName = await page.locator('.inventory_item_name').textContent();
  const cartItemPrice = await page.locator('.inventory_item_price').textContent();
  const cartItemContainer = await page.locator('.cart_item'); //Best method to verify if inventory is presence or gone
  await expect(cartItemName).toContain('Sauce Labs Backpack');
  await expect(cartItemPrice).toContain('$29.99');
  await page.getByRole('button', { name: 'Remove' }).click();
  await expect(cartItemContainer).toHaveCount(0);
});


//Test one item per time
const itemIndex = [2,4]; //Change this variable to test what kind of number of items
for (const i of itemIndex) {
  test(`Verify added item ${i} appears in cart with correct name and price`, async ({ page }) => {
    await page.goto('https://www.saucedemo.com/inventory.html');

    const expectedItemName = await page.locator('.inventory_item_name').nth(i).textContent();
    const expectedItemPrice = await page.locator('.inventory_item_price').nth(i).textContent();

    await page.getByRole('button', { name: 'Add to cart' }).nth(i).click();
    await page.locator('.shopping_cart_badge').click();

    const cartItemName = await page.locator('.inventory_item_name').textContent();
    const cartItemPrice = await page.locator('.inventory_item_price').textContent();
    const cartItemContainer = await page.locator('.cart_item'); //Best method to verify if inventory is presence or gone

    await expect(cartItemName).toContain(expectedItemName);
    await expect(cartItemPrice).toContain(expectedItemPrice);

    await page.getByRole('button', { name: 'Remove' }).click();
    await expect(cartItemContainer).toHaveCount(0);

  });
}

//Verify number of items
test(`Verify items ${itemIndex.map(i => i + 1).join(', ')} appear in cart with correct name and price`, async ({ page }) => {
  
  await page.goto('https://www.saucedemo.com/inventory.html');

  const expectedItems = await Promise.all(
    itemIndex.map(async (index) => ({
      name: await page.locator('.inventory_item_name').nth(index).textContent(),
      price: await page.locator('.inventory_item_price').nth(index).textContent()
    }))
  );

  // for (const index of itemIndex) {
  //   await page.getByRole('button', { name: 'Add to cart' }).nth(index).click();
  // }

  for (const index of itemIndex) {
    await page.locator('.inventory_item').nth(index).getByRole('button', { name: 'Add to cart' }).click();
  }

  await page.locator('.shopping_cart_badge').click();
  await expect(page.locator('.cart_item')).toHaveCount(itemIndex.length);
  console.log(`Current number of items in cart ${itemIndex.length}`);

  //alltextcontents returns an array
  const cartNames = await page.locator('.inventory_item_name').allTextContents();
  const cartPrices = await page.locator('.inventory_item_price').allTextContents();

  // for (const [index, { name, price }] of expectedItems.entries()) {
  //   expect(cartNames[index]).toContain(name);
  //   expect(cartPrices[index]).toContain(price);
  // }
  for (const { name, price } of expectedItems) {
    expect(cartNames).toContain(name);
    expect(cartPrices).toContain(price);
  }

  for (const _ of itemIndex) {
    await page.getByRole('button', { name: 'Remove' }).first().click();
  }
  await expect(page.locator('.cart_item')).toHaveCount(0);
});

test('Verify added all items into the cart and verify empty cart', async ({ page }) => {

  await page.goto('https://www.saucedemo.com/inventory.html');
  const buttonSelector = 'button:has-text("Add to cart")';
  
  // Find out how many buttons exist total
  const count = await page.locator(buttonSelector).count();

  for (let i = 0; i < count; i++) {
    // We always target the FIRST available "Add to cart" button.
    // As buttons change to "Remove", the "first" one will always be the next available item.
    await page.locator(buttonSelector).first().click();
    const cartBadge = page.locator('.shopping_cart_badge');
    const productName = await page.locator('.inventory_item_name').nth(i).textContent();
    console.log(`Added product ${i + 1} to cart: ${productName}`);
    await expect(cartBadge).toHaveText((i + 1).toString());
  }

    await page.locator('.shopping_cart_badge').click();
    await page.waitForSelector('.cart_item', { timeout: 5000 });


    //My code
    // const removeCartButton = await page.getByRole('button', { name: 'Remove' });  
    // const allcartbadge = await removeCartButton.count();
    // console.log(`Number of items in cart: ${allcartbadge}`);

    // for (let i = 0; i < allcartbadge; i++) {
    //   await removeCartButton.first().click();
    //   const cartBadge = page.locator('.shopping_cart_badge');
    //   //const productName = await page.locator('.inventory_item_name').nth(i).textContent();
    //   const cartItems = await page.locator('.cart_item');
    //   const productName =  await cartItems.first().locator('.inventory_item_name').textContent();

    //   const cartItemContainer = await page.locator('.cart_item').count();
    //   console.log(`Removed product ${i + 1} from cart: ${productName}`);
    //   console.log(`Number of items in cart : ${cartItemContainer}`);
    //   //await expect(cartBadge).toHaveText((i).toString());
    // }

  //AI version and understand it
    for (let i = 0; ; i++) {
    // Check how many Remove buttons remain
            const removeButtons = page.getByRole('button', { name: 'Remove' });
            const remainingCount = await removeButtons.count();

            if (remainingCount === 0) break; // Exit the loop if there are no more Remove buttons

            // Get product name from cart item (not inventory_item_name on inventory page)
            const cartItems = page.locator('.cart_item');
            const productName = await cartItems.first().locator('.inventory_item_name').textContent();

            await removeButtons.first().click();

            // Wait for DOM to update after removal
            const expectedCartItems = remainingCount - 1;
            if (expectedCartItems > 0) {
              await expect(page.locator('.cart_item')).toHaveCount(expectedCartItems);
            } else {
              // Last item removed — cart badge should disappear
              await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
            }

            const cartItemContainer = await page.locator('.cart_item').count();
            console.log(`Removed product ${i + 1} from cart: ${productName}`);
            console.log(`Number of items in cart: ${cartItemContainer}`);
          }
  });


  //Understand the continue shopping using manual test
test('Verify Continue Shopping button', async ({ page}) => {

  await page.goto('https://www.saucedemo.com/inventory.html');

  //Add First Item
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="shopping-cart-link"]').click();

  //Verify First Item
  await expect(page).toHaveURL(/.*cart/);
  await expect(page.locator('[data-test="inventory-item"]')).toBeVisible();

  //Verify Continue Shopping button
  await page.locator('[data-test="continue-shopping"]').click();
  await expect(page).toHaveURL(/.*inventory/);
  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

  //Click on the second item
  await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
  await page.locator('[data-test="shopping-cart-link"]').click();

  //Verify Second Item
  await page.locator('[data-test="continue-shopping"]').click();
  await expect(page.locator('.shopping_cart_badge')).toHaveText('2');

  //Click on the third item
  await page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();
  await page.locator('[data-test="shopping-cart-link"]').click();
  await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(3);
  await expect(page.locator('.shopping_cart_badge')).toHaveText('3');


  // await expect(page.getByText('1Sauce Labs Backpackcarry.')).toBeVisible();
  // await expect(page.getByText('1Sauce Labs Bike LightA red')).toBeVisible();
  // await expect(page.getByText('1Sauce Labs Bolt T-ShirtGet')).toBeVisible();

});

test('Verify continue shopping button with multyple items', async ({ page }) => {
  
  await page.goto('https://www.saucedemo.com/inventory.html');

  //List current items in the cart
  // const items = [
  //   'add-to-cart-sauce-labs-backpack',
  //   'add-to-cart-sauce-labs-bike-light',
  //   'add-to-cart-sauce-labs-bolt-t-shirt',
  // ];

  // Grab all "Add to cart" data-test attributes directly from page
  const allButtons = await page.locator('[data-test^="add-to-cart"]').all();
  const allDataTests = await Promise.all(
    allButtons.map(btn => btn.getAttribute('data-test'))
  );

  const howMany = 3;
  const items = allDataTests
    .sort(() => Math.random() - 0.5)
    .slice(0, howMany);

  console.log('Testing items:', items);

  for (let i = 0; i < items.length; i++) {
  // Add item to cart
  await page.locator(`[data-test="${items[i]}"]`).click();
  await page.locator('[data-test="shopping-cart-link"]').click();

  // Verify we are on cart page
  await expect(page).toHaveURL(/.*cart/);

  if (i < items.length - 1) {
    // Not the last item — click Continue Shopping and verify it goes back
    await page.locator('[data-test="continue-shopping"]').click();
    await expect(page).toHaveURL(/.*inventory/);
    await expect(page.locator('.shopping_cart_badge')).toHaveText((i + 1).toString());
  } else {
    // Last item — verify all items are in cart
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(items.length);
    await expect(page.locator('.shopping_cart_badge')).toHaveText(items.length.toString());
  }
}

});

test('Verify checkout button and visiblity of checkout page', async ({page}) => {

  await page.goto('https://www.saucedemo.com/inventory.html');

  //Add First Item
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="shopping-cart-link"]').click();

  //Verify First Item
  await expect(page).toHaveURL(/.*cart/);
  await expect(page.locator('[data-test="inventory-item"]')).toBeVisible();

  //Verify Checkout button
  await page.locator('[data-test="checkout"]').click();
  await expect(page).toHaveURL(/.*checkout-step-one.html/);

  await expect(page.locator('.checkout_info')).toBeVisible();
  
  await expect(page.locator('[data-test="firstName"]')).toBeVisible();
  await expect(page.locator('[data-test="lastName"]')).toBeVisible();
  await expect(page.locator('[data-test="postalCode"]')).toBeVisible();


  await expect(page.locator('[data-test="cancel"]')).toBeVisible();
  await expect(page.locator('[data-test="continue"]')).toBeVisible();
  
});

test('Verify checkout page threws an error and click "continue" button', async ({page}) => {

  await page.goto('https://www.saucedemo.com/inventory.html');
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="shopping-cart-link"]').click();

  //Verify First Item
  await expect(page).toHaveURL(/.*cart/);
  await expect(page.locator('[data-test="inventory-item"]')).toBeVisible();

  //Verify Checkout button
  await page.locator('[data-test="checkout"]').click();
  await expect(page).toHaveURL(/.*checkout-step-one.html/);


  await page.locator('[data-test="continue"]').click();


  // await expect(page.locator('path').first()).toBeVisible();
  // await expect(page.locator('svg').nth(1)).toBeVisible();
  // await expect(page.locator('path').nth(2)).toBeVisible();
  // await expect(page.locator('div').filter({ hasText: /^Error: First Name is required$/ }).nth(1)).toBeVisible();
  await expect(page.locator('[data-test="error"]')).toBeVisible();
  await expect(page.locator('[data-test="error"]')).toContainText('First Name is required');
  console.log('Form threw an error');
});

const errorScenarios = [
  {
    firstName: '',
    lastName: 'Leclerc',
    postalCode: '81000',
    expectedError: 'First Name is required',
  },
  {
    firstName: 'John',
    lastName: '',
    postalCode: '81000',
    expectedError: 'Last Name is required',
  },
  {
    firstName: 'John',
    lastName: 'Leclerc',
    postalCode: '',
    expectedError: 'Postal Code is required',
  },
]

for ( const { firstName, lastName, postalCode, expectedError} of errorScenarios){
  test(`Checkout Page with checkout Error: ${expectedError}`, async ({ page }) => {

    await page.goto('https://www.saucedemo.com/inventory.html');
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();

    if (firstName) await page.locator('[data-test="firstName"]').fill(firstName);
    if (lastName) await page.locator('[data-test="lastName"]').fill(lastName);
    if (postalCode) await page.locator('[data-test="postalCode"]').fill(postalCode);

    await page.locator('[data-test="continue"]').click();

    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText(expectedError);
    console.log(`Verified checkout error: ${expectedError}`);
  });
}

test('Verify checkout page threws an error and click "cancel" button', async ({page}) => {

  await page.goto('https://www.saucedemo.com/inventory.html');
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="shopping-cart-link"]').click();

  //Verify First Item
  await expect(page).toHaveURL(/.*cart/);
  await expect(page.locator('[data-test="inventory-item"]')).toBeVisible();

  //Verify Checkout button
  await page.locator('[data-test="checkout"]').click();
  await expect(page).toHaveURL(/.*checkout-step-one.html/);


  await page.locator('[data-test="continue"]').click();


  // await expect(page.locator('path').first()).toBeVisible();
  // await expect(page.locator('svg').nth(1)).toBeVisible();
  // await expect(page.locator('path').nth(2)).toBeVisible();
  // await expect(page.locator('div').filter({ hasText: /^Error: First Name is required$/ }).nth(1)).toBeVisible();
  await expect(page.locator('[data-test="error"]')).toBeVisible();
  await expect(page.locator('[data-test="error"]')).toContainText('First Name is required');
  console.log('Form threw an error');

  await page.locator('[data-test="cancel"]').click();
  await expect(page).toHaveURL(/.*cart/);
});

test('Verify step 2 overview page', async ({page}) => {

  
  await page.goto('https://www.saucedemo.com/inventory.html', {timeout: 60000});
  //await page.waitForLoadState('networkidle');
  // await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  

  const buttonSelector = 'button:has-text("Add to cart")';
  
  // Find out how many buttons exist total
  const count = await page.locator(buttonSelector).count();

  for (let i = 0; i < count; i++) {
    // We always target the FIRST available "Add to cart" button.
    // As buttons change to "Remove", the "first" one will always be the next available item.
    await page.locator(buttonSelector).first().click();
    const cartBadge = page.locator('.shopping_cart_badge');
    const productName = await page.locator('.inventory_item_name').nth(i).textContent();
    console.log(`Added product ${i + 1} to cart: ${productName}`);
    await expect(cartBadge).toHaveText((i + 1).toString());
  }

  await page.locator('[data-test="shopping-cart-link"]').click();
  await expect(page).toHaveURL(/.*cart/);
  //await expect(page.locator('[data-test="inventory-item"]')).toBeVisible();

  //Verify Checkout button
  await page.locator('[data-test="checkout"]').click();
  await expect(page).toHaveURL(/.*checkout-step-one.html/);

  
  await page.locator('[data-test="firstName"]').fill('Max');
  await page.locator('[data-test="lastName"]').fill('Leclerc');
  await page.locator('[data-test="postalCode"]').fill('81000');
  await page.locator('[data-test="continue"]').click();

  await expect(page).toHaveURL(/.*checkout-step-two.html/);
  //await expect(page.locator('[data-test="checkout_summary_container"]')).toBeVisible();
  //await expect(page.locator('[data-test="inventory-item"]')).toBeVisible();
  await expect(page.locator('[data-test="cart-list"]')).toBeVisible();
  const itemTitle = page.locator('[data-test="inventory-item-name"]');
  const allitemTitle = await itemTitle.count();
  for (let i = 0; i < allitemTitle; i++) {
    const itemTitleText = await itemTitle.nth(i).textContent();
    console.log(`Item Title: ${itemTitleText}`);
  }

  const paymentInfo = await page.locator('[data-test="payment-info-value"]').textContent();
  console.log(`Payment Information: ${paymentInfo}`);

  const shippingInfo = await page.locator('[data-test="shipping-info-value"]').textContent();
  console.log(`Shipping Information: ${shippingInfo}`);

  const priceTotal = await page.locator('[data-test="subtotal-label"]').textContent();
  console.log(`Item Total: ${priceTotal}`);

  const tax = await page.locator('[data-test="tax-label"]').textContent();
  console.log(`Item Total: ${tax}`);

  const total =await page.locator('[data-test="total-label"]').textContent();
  console.log(`Total: ${total}`);

});

test('Verify Finish button', async ({page}) => {


  await page.goto('https://www.saucedemo.com/inventory.html', {timeout: 60000});
  
  const buttonSelector = 'button:has-text("Add to cart")';
  
  // Find out how many buttons exist total
  const count = await page.locator(buttonSelector).count();

  for (let i = 0; i < count; i++) {
    // We always target the FIRST available "Add to cart" button.
    // As buttons change to "Remove", the "first" one will always be the next available item.
    await page.locator(buttonSelector).first().click();
    const cartBadge = page.locator('.shopping_cart_badge');
    const productName = await page.locator('.inventory_item_name').nth(i).textContent();
    console.log(`Added product ${i + 1} to cart: ${productName}`);
    await expect(cartBadge).toHaveText((i + 1).toString());
  }

  await page.locator('[data-test="shopping-cart-link"]').click();
  await expect(page).toHaveURL(/.*cart/);
  //await expect(page.locator('[data-test="inventory-item"]')).toBeVisible();

  //Verify Checkout button
  await page.locator('[data-test="checkout"]').click();
  await expect(page).toHaveURL(/.*checkout-step-one.html/);

  
  await page.locator('[data-test="firstName"]').fill('Max');
  await page.locator('[data-test="lastName"]').fill('Leclerc');
  await page.locator('[data-test="postalCode"]').fill('81000');
  await page.locator('[data-test="continue"]').click();

  await expect(page).toHaveURL(/.*checkout-step-two.html/);
  //await expect(page.locator('[data-test="checkout_summary_container"]')).toBeVisible();
  //await expect(page.locator('[data-test="inventory-item"]')).toBeVisible();
  await expect(page.locator('[data-test="cart-list"]')).toBeVisible();
  const itemTitle = page.locator('[data-test="inventory-item-name"]');
  const allitemTitle = await itemTitle.count();
  for (let i = 0; i < allitemTitle; i++) {
    const itemTitleText = await itemTitle.nth(i).textContent();
    console.log(`Item Title: ${itemTitleText}`);
  }

  await expect(page.locator('[data-test="finish"]')).toBeVisible();
  await page.locator('[data-test="finish"]').click();
  await expect(page).toHaveURL(/.*checkout-complete.html/);
  await expect(page.locator('[data-test="pony-express"]')).toBeVisible();
  await expect(page.locator('[data-test="complete-header"]')).toBeVisible();
  await expect(page.locator('[data-test="complete-text"]')).toBeVisible();
  await expect(page.locator('[data-test="back-to-products"]')).toBeVisible();
  await page.locator('[data-test="back-to-products"]').click();
  await page.close();
  console.log('Test End to End Complete');
});

test('Verify burger Menu (About Button)', async ({page}) => {

  await page.goto('https://www.saucedemo.com/inventory.html');
  await page.getByRole('button', { name: 'Open Menu' }).click();
  await page.locator('[data-test="about-sidebar-link"]').click();
  await expect(page).toHaveURL('https://saucelabs.com/');

});

test('Verify burger Menu (Logout Button)', async ({page}) => {

  await page.goto('https://www.saucedemo.com/inventory.html');
  await page.getByRole('button', { name: 'Open Menu' }).click();
  await page.locator('[data-test="logout-sidebar-link"]').click();
  await expect(page).toHaveURL('https://www.saucedemo.com/');
  await page.close();

});


  


  



