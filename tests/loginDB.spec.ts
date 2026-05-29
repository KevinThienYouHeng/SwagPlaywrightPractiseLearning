import { test } from '@playwright/test';
import { LoginPage } from './LoginPage';
import { DBhelper } from '../db/database';


const dbHelper = new DBhelper();
const testUsers = dbHelper.getAllUsers();
dbHelper.close();


console.log(`Loaded ${testUsers.length} test users from database`);

test.describe('Login tests with data from DB', () => {
    let loginPage: LoginPage;
    //const loginPage = new LoginPage(page);

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.goToLoginPage();
    });


    testUsers.forEach(user => {
        test(`Login test - ${user.username}`, async ({}) => {
    
            await loginPage.login(user.username, user.password);


            if (user.expected_error) {
                await loginPage.verifyErroMessage(user.expected_error);
            }else
                {
                await loginPage.verifyLoginSuccess();
            }
            
    
        });
    });
});
