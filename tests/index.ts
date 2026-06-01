//Fixture in this file
import { test as base} from '@playwright/test';
import { LoginPage } from './LoginPage';
import { InventoryPage } from './InventoryPage';
import { CartPage } from './CartPage';
import { Checkout } from './CheckoutPage';

type MyFixtures = {
    loginPage: LoginPage;
    inventoryPage: InventoryPage;
    cartPage: CartPage;
    checkoutPage: Checkout;
    standardUser: LoginPage;

}

export const test = base.extend<MyFixtures>({

    loginPage: async ({ page}, use) => {
        const loginPage = new LoginPage(page);
        await use(loginPage);
    },
    inventoryPage: async ({ page}, use) => {
        const inventoryPage = new InventoryPage(page);
        await use(inventoryPage);
    },
    cartPage: async ({ page}, use) => {
        const cartPage = new CartPage(page);
        await use(cartPage);
    },
    checkoutPage: async ({ page}, use) => {
        const checkoutPage = new Checkout(page);
        await use(checkoutPage);
    },
    standardUser: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await loginPage.goToLoginPage();
        await loginPage.login('standard_user', 'secret_sauce');
        await use(loginPage);
    }

});

export {expect} from '@playwright/test';