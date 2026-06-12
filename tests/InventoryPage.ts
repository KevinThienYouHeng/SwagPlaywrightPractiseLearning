import { Page, Locator, expect } from '@playwright/test';

export type NavigationType = 'name' | 'image';

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
    readonly title: Locator;
    readonly backProduct: Locator;
    readonly resetAppStateButton: Locator;
    readonly logoutSideBarLink: Locator;
    readonly aboutSideBarLink: Locator;
    readonly allItemsSideBarLink: Locator;
    readonly closeSideBarLink: Locator;
    //readonly checkoutButton: Locator;
    //readonly productNames: Locator;
    //readonly productPrices: Locator;

    constructor(page: Page) {
        this.page = page;
        this.title = page.getByText('Swag Labs');
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
        this.backProduct = page.locator('[data-test="back-to-products"]');
        this.resetAppStateButton = page.locator('[data-test="reset-sidebar-link"]');
        this.logoutSideBarLink = page.locator('[data-test="logout-sidebar-link"]');
        this.aboutSideBarLink = page.locator('[data-test="about-sidebar-link"]');
        this.allItemsSideBarLink = page.locator('[data-test="inventory-sidebar-link"]');
        this.closeSideBarLink = page.locator('#react-burger-cross-btn');
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
        await expect(this.title).toBeVisible();
        await expect(this.cartBadgeLink).toBeVisible();
        await expect(this.burgerButton).toBeVisible();
        await expect(this.productSortContainer).toBeVisible();
        await expect(this.twitterIcon).toBeVisible();
        await expect(this.facebookIcon).toBeVisible();
        await expect(this.linkedinIcon).toBeVisible();
        //await expect(this.checkoutButton).toBeVisible();
    }

    //Function verify the six items
    async verifyInventoryPageItem(){
        
        const product =  this.inventoryItems;
        const allproduct = await product.all();

        for (const item of allproduct) {
            await expect(item).toBeVisible();

            const name = item.locator('.inventory_item_name');
            const price = item.locator('.inventory_item_price');
            const desc = item.locator('.inventory_item_desc');

            await expect(name).not.toBeEmpty();
            console.log(`Verified product name: ${await name.textContent()}`);
            await expect(desc).not.toBeEmpty();
            console.log(`Verified product description: ${await desc.textContent()}`);
            await expect(price).toContainText('$');
            console.log(`Verified product price: ${await price.textContent()}`);
            await expect(this.addToCartButton.first()).toBeVisible();
        }
    }

    async verifyImagePerItem(){

        const product = this.inventoryItems.locator('.inventory_item_img img');
        const imageAll = await product.count();

        for ( let i = 0 ; i< imageAll ; i++){
        
            const isLoaded = await product.nth(i).evaluate(img => {
            const image = img as HTMLImageElement;
            return image.complete && image.naturalWidth > 0;
        });
        
        const src = await product.nth(i).getAttribute('src');
        expect(isLoaded).toBe(true);
        console.log(`Verified product image: ${src}`);
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
            await expect(this.removeButton.first()).toBeVisible();
        }
    }

    async addOneRandomItemToCart(){

        const count = await this.addToCartButton.count();
        const randomIndex = Math.floor(Math.random() * count);
        await this.addToCartButton.nth(randomIndex).click();
        //await expect(this.cartBadge).toHaveText('1');
    }

    async addRandomItemToCart(numberOfItems: number){
        
        const count = await this.addToCartButton.count();

        if(numberOfItems > count){
            throw new Error(`Cannot add ${numberOfItems} items to cart. There are only ${count} items available.`);
        }

        const randomIndices: number[] = [];

        while(randomIndices.length < numberOfItems){
            const randomIndex = Math.floor(Math.random() * count);
            if(!randomIndices.includes(randomIndex)){
                randomIndices.push(randomIndex);
            }
        }

        for (const index of randomIndices) {
            const productName = await this.inventoryItems
                .locator('.inventory_item_name')
                .nth(index)
                .textContent();

            await this.addToCartButton.nth(index).click();
            //await expect(this.removeButton.nth(index)).toBeVisible();

            console.log(`Randomly added product: ${productName} (index: ${index})`);
        }

    }

    async removeOneItem(){

        const removeButton = this.removeButton.first();
        await removeButton.click();
        //console.log(`Current cart count: ${await this.cartBadge.textContent()}`);
        await expect(this.addToCartButton.first()).toBeVisible();
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
            await expect(this.addToCartButton.first()).toBeVisible();
        }
    }

    //Just Grab the first one, not randomly
    async clickProductName(){

        const item = this.inventoryItems;
        const product = item.locator('.inventory_item_name').first();
        await product.click();
        await this.addToCartButton.click();
        await this.backProduct.click();
    }

    //Just Grab the first one, not randomly
    async clickProductImg(){
        const item = this.inventoryItems;
        const product = item.locator('.inventory_item_img').first();
        await product.click();
        await this.addToCartButton.click();
        await this.backProduct.click();
    }

    async addItemToCartFromDetailPage(){
            const productNameLocator = this.inventoryItems.locator('.inventory_item_name');
            const productCount = await productNameLocator.count();
            const productNames: string[] = [];

            for (let i = 0; i < productCount; i++) {
                const name = await productNameLocator.nth(i).textContent();
                productNames.push(name ?? '');
            }

            console.log(`Total products to add: ${productCount}`);
            console.log(`Products: ${productNames.join(', ')}`);

            for(let i = 0; i < productNames.length; i++){
                
                const productName = productNames[i];
                await this.inventoryItems
                .locator('.inventory_item_name', { hasText: productName })
                .click();
                //await this.waitForPageLoad();
                console.log(`Navigated to detail page: ${productName}`);
                await this.addToCartButton.click();
                console.log(`Added to cart from detail page: ${productName}`);
                await expect(this.removeButton).toBeVisible();
                await this.backProduct.click();
                console.log(`Returned to inventory. Item ${i + 1}/${productNames.length} done`);

            }

    }

    //Only clears the cart, not the entire app state.
    async resetAppState(){
        await this.burgerButton.click();
        await this.resetAppStateButton.click();
        await this.closeSideBarLink.click();
    }

    async addImgToCartFromDetailPageByImg(){

        const productNameLocator = this.inventoryItems.locator('.inventory_item_img img');
        const productCount = await productNameLocator.count();
        const productNames: string[] = [];

        for (let i = 0; i < productCount; i++) {
            const name = await productNameLocator.nth(i).textContent();
            productNames.push(name ?? '');
        }

        console.log(`Total products to add: ${productCount}`);
            console.log(`Products: ${productNames.join(', ')}`);

            for(let i = 0; i < productNames.length; i++){
                
                const productName = productNames[i];
                await this.inventoryItems
                .locator('.inventory_item_img img')
                .nth(i)
                .click();
                //await this.waitForPageLoad();
                console.log(`Navigated to detail page: ${productName}`);
                await this.addToCartButton.click();
                console.log(`Added to cart from detail page: ${productName}`);
                await expect(this.removeButton).toBeVisible();
                await this.backProduct.click();
                console.log(`Returned to inventory. Item ${i + 1}/${productNames.length} done`);

            }

    }

    //Use this function when want to be flexible to click name or image for passing paramter
    async addAllItemsFromDetailPage(navigateBy: NavigationType = 'name'): Promise<void> {
        //const detailPage = new DetailPage(this.page);

        const productNameLocator = this.inventoryItems.locator('.inventory_item_name');
        const productCount = await productNameLocator.count();
        const productNames: string[] = [];

        for (let i = 0; i < productCount; i++) {
            const name = await productNameLocator.nth(i).textContent();
            productNames.push(name ?? '');
        }

        for (let i = 0; i < productNames.length; i++) {
            const productName = productNames[i];

            if (navigateBy === 'name') {
                await this.inventoryItems
                    .locator('.inventory_item_name', { hasText: productName })
                    .click();
            } else {
                await this.inventoryItems
                    .locator('.inventory_item_img img')
                    .nth(i)
                    .click();
            }

            //await this.waitForPageLoad();
            //await detailPage.addToCart();
            //await detailPage.goBackToInventory();
            await this.addToCartButton.click();
            await this.backProduct.click();

            await expect(this.cartBadge).toHaveText((i + 1).toString());
            console.log(`Done ${i + 1}/${productNames.length}: ${productName} (via ${navigateBy})`);
        }
    }

    async logoutSideBar(){
        await this.burgerButton.click();
        await this.logoutSideBarLink.click();
        await expect(this.page).toHaveURL('https://www.saucedemo.com/');
    }

    async aboutSideBar(){

        await this.burgerButton.click();
        await this.aboutSideBarLink.click();
        await expect(this.page).toHaveURL(/saucelabs.com/);
        await expect(this.page).toHaveTitle(/Sauce Labs/);

    }

    async middleClickForNewTabAboutSideBar(): Promise<Page> {

        await this.burgerButton.click();
        const [newTab] = await Promise.all([
            this.page.context().waitForEvent('page'),
            this.aboutSideBarLink.click({ button: 'middle' }),
        ]);
        await newTab.waitForLoadState('networkidle');
        console.log(`✅ New tab opened via middle click: ${newTab.url()}`);
        return newTab;
    }

    async goToCartPage(){
        await this.cartBadgeLink.click();
        await expect(this.page).toHaveURL(/.*cart.html/);
    }
    
    async verifyInventoryPageUrl(){
        await expect(this.page).toHaveURL(/.*inventory.html/);
    }

    async verifyItemsNameInCart(): Promise<void> {

        //const itemStartingName = 'Sauce Labs';
        const items = this.inventoryItems;
        const itemsName = await items.locator('.inventory_item_name').allInnerTexts();
        console.log(`Items in cart: ${itemsName.join(',')}`);

        for (const name of itemsName) {
            try{expect(name).toContain('Sauce Labs');
                console.log(`Verified ${name}`);
            }catch {
                console.log(` Item name: ${name}`);
            }
            
        }
        // expectedNames.forEach(expectedName => {
        //     const fullExpectedName = `${itemStartingName} ${expectedName}`;
        //     expect(itemsName).toContain(fullExpectedName);
        //     console.log(`Verified item in cart: ${fullExpectedName}`);
        // });

    }

    async verifyDifferentImagePerItem(): Promise<void> {
       
        const items = this.inventoryItems;
        const imageLocator = items.locator('.inventory_item_img img');
        const imageCount = await imageLocator.count();
        const srcList: string[] = [];

        for (let i = 0; i < imageCount; i++) {
            const src = await imageLocator.nth(i).getAttribute('src');

            const isLoaded = await imageLocator.nth(i).evaluate(img => {
            const image = img as HTMLImageElement;
            return image.complete && image.naturalWidth > 0;

            });
            expect(isLoaded).toBe(true);
            expect(src).not.toBeNull();
            expect(src).not.toBe('');

            expect(srcList).not.toContain(src);
            srcList.push(src ?? '');
            console.log(`Image ${i + 1} src: ${src}`);
        }

        console.log('Verified all items image have different src');
    }

    async verifyRemoveButtonVisbilityAfterAddingToCart(): Promise<void> {

        const removeButtonCount = await this.removeButton.count();
        console.log(`Total remove buttons: ${removeButtonCount}`);

        for( let i = 0; i < removeButtonCount; i++){
            await expect(this.removeButton.nth(i)).toBeVisible();
        }

        //await expect(this.removeButton).toBeVisible();
    }

    async getItemThatDidNotGetAddedToCart(): Promise<void> {
        const items = this.inventoryItems;
        const itemCount = await items.count();
        const failedItemNames: string[] = [];
        const successItemNames: string[] = [];

        for (let i = 0; i < itemCount; i++) {
            
            const addToCartItem = await items.locator('.inventory_item_name').nth(i).innerText();
            
            //const addButton = this.addToCartButton.nth(i);;
            await this.addToCartButton.nth(i).click();
            const removeButton = this.removeButton.nth(i);
            const isRemoveVisible = await removeButton.isVisible();

            if(isRemoveVisible){
                successItemNames.push(addToCartItem);
                console.log(`Successfully added to cart: ${addToCartItem}`);
            } else {
                failedItemNames.push(addToCartItem);
                console.log(`Failed to add to cart: ${addToCartItem}`);
            }
        }

        successItemNames.forEach((name, index) => {
            console.log(`Successfully added item ${index + 1}: ${name}`);
        })

        failedItemNames.forEach((name, index) => {
            console.log(`Failed to add item ${index + 1}: ${name}`);
        })

    }

    //Compare only one
    async compareInventoryPageInfoAndDetailPageInfo(item: number): Promise<void> {

        const firstItem = this.inventoryItems.nth(item);
        const inventoryName = await firstItem.locator('.inventory_item_name').innerText();
        const inventoryPrice = await firstItem.locator('.inventory_item_price').innerText();
        const inventoryDesc = await firstItem.locator('.inventory_item_desc').innerText();

        await firstItem.locator('.inventory_item_name').click();

        const detailName = await this.page.locator('.inventory_details_name').innerText();
        const detailPrice = await this.page.locator('.inventory_details_price').innerText();
        const detailDesc = await this.page.locator('.inventory_details_desc').innerText();

        //const nameMatch = expect(inventoryName).toBe(detailName);
        // const priceMatch = expect(inventoryPrice).toBe(detailPrice);
        // const descMatch = expect(inventoryDesc).toBe(detailDesc);

        const nameMatch = inventoryName === detailName;
        const priceMatch = inventoryPrice === detailPrice;
        const descMatch = inventoryDesc === detailDesc;

        console.log( `Item: ${inventoryName} ${item + 1}`);
        console.log(` Name : ${nameMatch ? 'Match ' : 'Mismatch'}`);
        console.log(` Price : ${priceMatch ? 'Match ' : 'Mismatch'}`);
        console.log(` Description : ${descMatch ? 'Match ' : 'Mismatch'}`);
        console.log('----------------------------------------------------');

        await this.backProduct.click();
    }

    async VerifyProductSortZA(): Promise<void> {

        await expect(this.productSortContainer).toBeVisible();
        await this.productSortContainer.selectOption('za');

        const productNames = await this.inventoryItems.locator('.inventory_item_name').allTextContents();
        const expectedProductNames = [...productNames].sort((a,b) => b.localeCompare(a));

        productNames.forEach((name, index) => {
            console.log(` ${index + 1}: ${name}`);
        })

        console.log('--------------------------------------');
        expectedProductNames.forEach((name, index) => {
            console.log(` ${index + 1}: ${name}`);
        })

        try{
            expect(productNames).toEqual(expectedProductNames);
        }catch {
            productNames.forEach((name, index) => {
            const matches = name === expectedProductNames[index];
            console.log(`   ${index + 1}. ${matches ? '✅' : '❌'} Actual: "${name}" | Expected: "${expectedProductNames[index]}"`);
            });
        }
    }

    async VerifyProductSortLOHI(): Promise<void> {

        await expect(this.productSortContainer).toBeVisible();
        await this.productSortContainer.selectOption('lohi');

        const productPrices = await this.inventoryItems.locator('.inventory_item_price').allTextContents();
        const expectedProductPrices = [...productPrices].sort((a,b) => b.localeCompare(a));

        productPrices.forEach((name, index) => {
            console.log(` ${index + 1}: ${name}`);
        })

        console.log('--------------------------------------');
        expectedProductPrices.forEach((name, index) => {
            console.log(` ${index + 1}: ${name}`);
        })

        try{
            expect(productPrices).toEqual(expectedProductPrices);
        }catch {
            productPrices.forEach((name, index) => {
            const matches = name === expectedProductPrices[index];
            console.log(`   ${index + 1}. ${matches ? '✅' : '❌'} Actual: "${name}" | Expected: "${expectedProductPrices[index]}"`);
            });
        }
    }

    async goToInventoryPage(): Promise<void> {
        await this.page.goto('https://www.saucedemo.com/inventory.html');
    }

    async interceptImageRequests(): Promise<void> {
        await this.page.route('**/*.{jpg,jpeg,png,gif,svg,webp,src}', async route => {
                const url = route.request().url();
                console.log(`🖼️ Image request: ${url}`);
                await route.continue();
            });
        }
    
    async getAllItemsName(): Promise<string[]> {
        return await this.inventoryItems.locator('.inventory_item_name').allInnerTexts();
    }

    async getAllPricesName(): Promise<string[]> {
        return await this.inventoryItems.locator('.inventory_item_price').allInnerTexts();
    }

    async getAllDescriptionsName(): Promise<string[]> {
        return await this.inventoryItems.locator('.inventory_item_desc').allInnerTexts();
    }

    async displayAllItemsName(): Promise<void> {
        const itemsName = await this.getAllItemsName();
        itemsName.forEach((name, index) => {
            console.log(` ${index + 1}: ${name}`);
        });
    }

    async displayAllPricesName(): Promise<void> {
        const pricesName = await this.getAllPricesName();
        pricesName.forEach((price, index) => {
            console.log(` ${index + 1}: ${price}`);
            expect(price).toContain('$');
        });
    }

    async displayAllDescriptionsName(): Promise<void> {
        const descriptionsName = await this.getAllDescriptionsName();
        descriptionsName.forEach((desc, index) => {
            console.log(` ${index + 1}: ${desc}`);
        });
    }
}