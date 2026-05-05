import { Page, Locator, expect } from '@playwright/test';

export class InventoryPage {
    readonly page: Page;
    readonly inventoryItems: Locator;
    readonly addToCartButton: Locator;
    readonly cartBadge: Locator;
    readonly checkoutButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.inventoryItems = page.locator('.inventory_item');
        this.addToCartButton = page.locator('button', { hasText: 'Add to cart' });
        this.cartBadge = page.locator('.shopping_cart_badge');
        this.checkoutButton = page.locator('[data-test="checkout"]');
    }

    async addProductToCart(productName: string) {
        const product = this.inventoryItems.locator('.inventory_item_name', { hasText: productName });
        await product.click();
        await this.addToCartButton.click();
    }

    async verifyCartCount(expectedCount: string) {
    await expect(this.cartBadge).toHaveText(expectedCount);
  }

}