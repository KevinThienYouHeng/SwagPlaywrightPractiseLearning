import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './Basepage';

export class CartPage extends BasePage {
    readonly cartItems: Locator;
    readonly cartItemNames: Locator;
    readonly cartItemPrices: Locator;
    readonly cartItemDescriptions: Locator;
    readonly removeButtons: Locator;
    readonly continueShoppingButton: Locator;
    readonly checkoutButton: Locator;
    readonly cartBadge: Locator;
    readonly cartTitle: Locator;
    readonly cartDescLabel: Locator;
    readonly cartQtyLabel: Locator;
 
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
    this.cartDescLabel = page.locator('[data-test="cart-desc-label"]');
    this.cartQtyLabel = page.locator('[data-test="cart-qty-label"]');
    this.cartItemDescriptions = page.locator('.inventory_item_desc');
  }
 
  async goToCartPage(): Promise<void> {
    const startTime = Date.now();
    await this.navigate('https://www.saucedemo.com/cart.html');
    await expect(this.page).toHaveURL(/.*cart.html/);
    await expect(this.cartTitle).toHaveText('Your Cart');
    await expect(this.cartDescLabel).toBeVisible();
    await expect(this.cartQtyLabel).toBeVisible();
    await this.waitForPageLoad(startTime);
  }
  
  //Remove item based on index
  async removeItemByIndex(index: number): Promise<void> {
    const startTime = Date.now();
    await expect(this.removeButtons.nth(index)).toBeVisible();
    await this.removeButtons.nth(index).click();
    await this.waitForPageLoad(startTime);
  }
 
  async continueShopping(): Promise<void> {
    const startTime = Date.now();
    await expect(this.continueShoppingButton).toBeVisible();
    await this.continueShoppingButton.click();
    await this.waitForPageLoad(startTime);
  }
 
  async proceedToCheckout(): Promise<void> {
    const startTime = Date.now();
    await expect(this.checkoutButton).toBeVisible();
    await this.checkoutButton.click();
    await this.waitForPageLoad(startTime);
    await expect(this.page).toHaveURL(/.*checkout-step-one.html/)
  }
 
  async getCartItemCount(): Promise<number> {
    return await this.cartItems.count();
  }
  
  //Get item based on index/position in the cart
  async getItemNameByIndex(index: number): Promise<string> {
    await expect(this.cartItemNames.nth(index)).toBeVisible();
    return await this.cartItemNames.nth(index).innerText();
  }

  async getItemDescriptionByIndex(index: number): Promise<string> {
    await expect(this.cartItemDescriptions.nth(index)).toBeVisible();
    return await this.cartItemDescriptions.nth(index).innerText();
  }

  //Get all items in the cart
  async getAllCurrentNamesInCart(): Promise<string[]> {
    const names = await this.cartItemNames.allInnerTexts();

    names.forEach((name, index) => {
      console.log(`Items ${index + 1}: ${name}`);
    })
    return names;
  }
  
  //Get price based on index in the cart
  async getItemPriceByIndex(index: number): Promise<string> {
    await expect(this.cartItemPrices.nth(index)).toBeVisible();
    return await this.cartItemPrices.nth(index).innerText();
  }

  async getAllCurrentPricesInCart(): Promise<string[]> {
    
    const prices = await this.cartItemPrices.allInnerTexts();

    prices.forEach((price, index) => {
      console.log(`Items ${index + 1}: ${price}`);
    })
    return prices;
  }

  async getAllCurrentDescriptionsInCart(): Promise<string[]> {
    
    const descriptions = await this.cartItemDescriptions.allInnerTexts();

    descriptions.forEach((desc, index) => {
      console.log(`Items ${index + 1}: ${desc}`);
    })
    return descriptions;
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

  async removeAllItemsFromCart(): Promise<void> {
    const itemCount = await this.getCartItemCount();
    for(let i = 0; i < itemCount; i++){
      await this.removeItemByIndex(0);
    }
  }

  //Remove based on index not randomly
  async removeCertainNumberofItemsFromCart(numberOfItems: number): Promise<number> {
    const itemCount = await this.getCartItemCount();
    for(let i = 0; i < Math.min(numberOfItems, itemCount); i++){
      //Get the name and price of the item being removed
      const name = await this.getItemNameByIndex(0);
      const price = await this.getItemPriceByIndex(0);

      await this.removeItemByIndex(0);
      console.log(`Removed item ${i + 1}: ${name} with price ${price}`);
    }
    return await this.getCartItemCount();
  }

  async removeSpecificItemFromCart(productName:string): Promise<void> {
   const allNames = await this.cartItemNames.allInnerTexts();

  expect(allNames).toContain(productName);

  const itemIndex = allNames.indexOf(productName);
  const price = await this.getItemPriceByIndex(itemIndex);

  console.log(`Removing ${productName} with price ${price}`);

  await this.cartItems
    .filter({ hasText: productName })
    .locator('.cart_button')
    .click();

  const remainingNames = await this.cartItemNames.allInnerTexts();
  expect(remainingNames).not.toContain(productName);
  }

  async verifyCartPageUrl(): Promise<void> {
    await expect(this.page).toHaveURL(/.*cart.html/);
  }

  async verifyCartRequiresLogin(): Promise<void> {
    await this.navigate('https://www.saucedemo.com/cart.html');
    await expect(this.page).toHaveURL("https://www.saucedemo.com/");
    //await expect(this.errorMessage).toHaveText('Epic sadface: You must login to continue.');
  }
}