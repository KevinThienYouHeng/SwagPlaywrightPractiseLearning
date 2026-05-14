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
  readonly cartTitle: Locator;
 
  constructor(page: Page) {
    super(page);
    this.cartItems = page.locator('.cart_item');
    this.cartItemNames = page.locator('.inventory_item_name');
    this.cartItemPrices = page.locator('.inventory_item_price');
    this.removeButtons = page.locator('.cart_button');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartTitle = page.locator('.title');
  }
 
  async goToCartPage(): Promise<void> {
    await this.navigate('https://www.saucedemo.com/cart.html');
    await expect(this.page).toHaveURL(/.*cart.html/);
    await expect(this.cartTitle).toHaveText('Your Cart');
    await this.waitForPageLoad();
  }
  
  //Remove item based on index
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
    await expect(this.page).toHaveURL(/.*checkout-step-one.html/)
  }
 
  async getCartItemCount(): Promise<number> {
    return await this.cartItems.count();
  }
  
  //Get item based on index/position in the cart
  async getItemNameByIndex(index: number): Promise<string> {
    return await this.cartItemNames.nth(index).innerText();
  }

  //Get all items in the cart
  async getAllCurrentNamesInCart(): Promise<string[]> {
    const names = await this.cartItemNames.allInnerTexts();

    names.forEach((name, index) => {
      console.log(`Items ${index + 1}: name ${name}`);
    })
    return names;
  }
  
  //Get price based on index in the cart
  async getItemPriceByIndex(index: number): Promise<string> {
    return await this.cartItemPrices.nth(index).innerText();
  }

  async getAllCurrentPricesInCart(): Promise<string[]> {
    
    const prices = await this.cartItemPrices.allInnerTexts();

    prices.forEach((price, index) => {
      console.log(`Items ${index + 1}: price ${price}`);
    })
    return prices;
  }

 
  async verifyCartItemCount(expectedCount: number): Promise<void> {
    await expect(this.cartItems).toHaveCount(expectedCount);
  }
 
  async verifyCartIsEmpty(): Promise<void> {
    await expect(this.cartItems).toHaveCount(0);
  }
 
  async verifyCartBadgeCount(expectedCount: number): Promise<void> {
    //await expect(this.cartBadge).toHaveText(expectedCount);
     if(expectedCount === 0){
            await expect(this.cartBadge).toHaveCount(0);
        }else{
            await expect(this.cartBadge).toBeVisible();
            await expect(this.cartBadge).toHaveText(expectedCount.toString());
        }
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