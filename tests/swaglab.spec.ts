import { test, expect } from '@playwright/test';

test('Login and see the products page', async ({ page }) => {
  // Navigation goes straight to the inventory because of the storageState
  await page.goto('https://www.saucedemo.com/inventory.html');
  
  const title = await page.locator('.title');
  await expect(title).toHaveText('Products');
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

    
    await expect(page.locator('[data-test="item-4-img-link"]')).toBeVisible();
    await expect(page.locator('[data-test="item-4-title-link"]')).toBeVisible();
    await expect(page.getByText('carry.allTheThings() with the')).toBeVisible();
    await expect(page.getByText('$29.99')).toBeVisible();
    await expect(page.locator('[data-test="add-to-cart-sauce-labs-backpack"]')).toBeVisible();
    
    
    
    

});