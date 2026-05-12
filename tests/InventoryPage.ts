import { Page, Locator, expect } from '@playwright/test';

export class InventoryPage {
    readonly page: Page;
    readonly inventoryItems: Locator;
    readonly addToCartButton: Locator;
    readonly cartBadgeLink: Locator;
    readonly cartBadge: Locator;
    readonly burgerButton: Locator;
    readonly productSortContainer: Locator;
    readonly twitterIcon: Locator;
    readonly facebookIcon: Locator;
    readonly linkedinIcon: Locator;
    readonly logoutButton: Locator;
    readonly removeButton: Locator;
    //readonly checkoutButton: Locator;
    //readonly productNames: Locator;
    //readonly productPrices: Locator;

    constructor(page: Page) {
        this.page = page;
        this.inventoryItems = page.locator('.inventory_item');
        this.addToCartButton = page.locator('button', { hasText: 'Add to cart' });
        this.cartBadgeLink = page.locator('[data-test="shopping-cart-link"]');
        this.cartBadge = page.locator('.shopping_cart_badge');
        this.burgerButton = page.getByRole('button', { name: 'Open Menu' });
        this.productSortContainer = page.locator('.product_sort_container');
        this.twitterIcon = page.getByRole('link', { name: 'Twitter' });
        this.facebookIcon = page.getByRole('link', { name: 'Facebook' });
        this.linkedinIcon = page.getByRole('link', { name: 'Linkedin' });
        this.logoutButton = page.locator('[data-test="logout-sidebar-link"]');
        this.removeButton = page.locator('[data-test^="remove"]');
        //this.checkoutButton = page.locator('[data-test="checkout"]');
        //this.productNames = page.locator('.inventory_item_name');
        //this.productPrices = page.locator('.inventory_item_price');
    }

    async addProductToCart(productName: string) {
        const product = this.inventoryItems.locator('.inventory_item_name', { hasText: productName });
        await product.click();
        await this.addToCartButton.click();
    }

    async verifyCartCount(expectedCount: number) {
        if(expectedCount === 0){
            await expect(this.cartBadge).toHaveCount(0);
        }else{
            await expect(this.cartBadge).toBeVisible();
            await expect(this.cartBadge).toHaveText(expectedCount.toString());
        }
    }

    async verifyInventoryPage(){
    
        //await expect(this.addToCartButton).toBeVisible();
        await expect(this.cartBadgeLink).toBeVisible();
        await expect(this.burgerButton).toBeVisible();
        await expect(this.productSortContainer).toBeVisible();
        await expect(this.twitterIcon).toBeVisible();
        await expect(this.facebookIcon).toBeVisible();
        await expect(this.linkedinIcon).toBeVisible();
        //await expect(this.checkoutButton).toBeVisible();
    }

    async verifyInventoryPageItem(){
        
        const product =  this.inventoryItems;
        const allproduct = await product.all();

        for (const item of allproduct) {
            await expect(item).toBeVisible();

            const name = item.locator('.inventory_item_name');
            const price = item.locator('.inventory_item_price');

            await expect(name).not.toBeEmpty();
            console.log(`Verified product name: ${await name.textContent()}`);
            await expect(price).toContainText('$');
            console.log(`Verified product price: ${await price.textContent()}`);
        }
    }
    
    async logoutPage(){
        await this.burgerButton.click();
        await this.logoutButton.click();
    }

    async verifyProductSortContainerAZ(){
        await expect(this.productSortContainer).toBeVisible();
        await this.productSortContainer.selectOption('az');

        const items = this.inventoryItems;
        const firstProductName = await items.locator('.inventory_item_name').first().textContent();
        const lastProductName = await items.locator('.inventory_item_name').last().textContent();

        console.log(`First product name: ${firstProductName}`);
        console.log(`Last product name: ${lastProductName}`);
    }

    async verifyProductContainerZA(){
        await expect(this.productSortContainer).toBeVisible();
        await this.productSortContainer.selectOption('za');

        const items = this.inventoryItems;
        const firstProductName = await items.locator('.inventory_item_name').first().textContent();
        const lastProductName = await items.locator('.inventory_item_name').last().textContent();

        console.log(`First product name: ${firstProductName}`);
        console.log(`Last product name: ${lastProductName}`);
    }

    async verifyProductContainerLowToHigh(){
        await expect(this.productSortContainer).toBeVisible();
        await this.productSortContainer.selectOption('lohi');

        const items = this.inventoryItems;
        const firstPriceName = await items.locator('.inventory_item_price').first().textContent();
        const lastPriceName = await items.locator('.inventory_item_price').last().textContent();

        console.log(`First product name: ${firstPriceName}`);
        console.log(`Last product name: ${lastPriceName}`);
        
    }

    async verifyProductContainerHighToLow(){
        //second version with clean code
        await expect(this.productSortContainer).toBeVisible();
        await this.productSortContainer.selectOption('hilo');

        const items = this.inventoryItems;
        
        const priceLocator = items.locator('.inventory_item_price');
        const productPrices = await priceLocator.allTextContents();

        const parsePrice = (price: string): number => parseFloat(price.replace(/[^0-9.]/g, ''));

        const actualPrices = productPrices.map(parsePrice);
        const expectedPrices = [...actualPrices].sort((a, b) => b - a);

        console.log(`All product prices (sorted): ${actualPrices.join(', ')}`);
        console.log(`Expected product prices (sorted): ${expectedPrices.join(', ')}`);
        expect(actualPrices).toEqual(expectedPrices);
    }

    async addMultiplyItemToCart(){

        const count = await this.addToCartButton.count();
        const item = this.inventoryItems;


        for ( let i = 0; i < count; i ++){

            await this.addToCartButton.first().click();
            await expect(this.cartBadge).toHaveText((i + 1).toString());
            const productName = await item.locator('.inventory_item_name').nth(i).textContent();
            console.log(`Added product ${i + 1} to cart: ${productName}`);
        }
    }

    async removeOneItem(){

        const removeButton = this.removeButton.first();
        await removeButton.click();
        console.log(`Current cart count: ${await this.cartBadge.textContent()}`);
        //await expect(this.cartBadge).toHaveText('0');
    }

    async removeAllItem(){

        const removeButton = this.removeButton;
        const count = await removeButton.count();
        console.log(count);

        for( let i = 0; i < count; i++){
            await removeButton.first().click();
            const remainingCount = count - (i + 1);
            console.log(`Removed product ${i + 1} from cart. Remaining products: ${remainingCount}`);
        }
    }
}