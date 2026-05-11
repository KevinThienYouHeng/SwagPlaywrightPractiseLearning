import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './Basepage';

export class CartPage extends BasePage {
    readonly cartItems: Locator;
  readonly cartItemNames: Locator;
  readonly cartItemPrices: Locator;
  readonly removeButtons: Locator;
  readonly continueShoppingButton: Locator;
  readonly checkoutButton: Locator;
  readonly cartBadge: Locator;
 
  constructor(page: Page) {
    super(page);
    this.cartItems = page.locator('.cart_item');
    this.cartItemNames = page.locator('.inventory_item_name');
    this.cartItemPrices = page.locator('.inventory_item_price');
    this.removeButtons = page.locator('.cart_button');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.cartBadge = page.locator('.shopping_cart_badge');
  }
 
  async goToCartPage(): Promise<void> {
    await this.navigate('https://www.saucedemo.com/cart.html');
    await this.waitForPageLoad();
  }
 
  async removeItemByIndex(index: number): Promise<void> {
    await this.removeButtons.nth(index).click();
    await this.waitForPageLoad();
  }
 
  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
    await this.waitForPageLoad();
  }
 
  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
    await this.waitForPageLoad();
  }
 
  async getCartItemCount(): Promise<number> {
    return await this.cartItems.count();
  }
 
  async getItemNameByIndex(index: number): Promise<string> {
    return await this.cartItemNames.nth(index).innerText();
  }
 
  async getItemPriceByIndex(index: number): Promise<string> {
    return await this.cartItemPrices.nth(index).innerText();
  }
 
  async verifyCartItemCount(expectedCount: number): Promise<void> {
    await expect(this.cartItems).toHaveCount(expectedCount);
  }
 
  async verifyCartIsEmpty(): Promise<void> {
    await expect(this.cartItems).toHaveCount(0);
  }
 
  async verifyCartBadgeCount(expectedCount: string): Promise<void> {
    await expect(this.cartBadge).toHaveText(expectedCount);
  }
 
  async verifyCartBadgeNotVisible(): Promise<void> {
    await expect(this.cartBadge).toHaveCount(0);
  }
 
  async verifyItemNameInCart(expectedName: string): Promise<void> {
    await expect(this.cartItemNames.first()).toHaveText(expectedName);
  }
 
  async verifyItemPriceInCart(expectedPrice: string): Promise<void> {
    await expect(this.cartItemPrices.first()).toHaveText(expectedPrice);
  }

}