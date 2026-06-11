import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './Basepage';

export class Checkout extends BasePage {

readonly firstNameInput: Locator;
readonly lastNameInput: Locator;
readonly postalCodeInput: Locator;
readonly continueButton: Locator;
readonly cancelButtonStepOne: Locator;
readonly errorMessage: Locator;

// Step 2 — Overview
readonly cartItems: Locator;
readonly subtotalLabel: Locator;
readonly taxLabel: Locator;
readonly totalLabel: Locator;
readonly finishButton: Locator;
readonly cancelButtonStepTwo: Locator;
readonly summaryInfoLabel: Locator;
readonly summaryInfoValue: Locator;

// Complete
readonly completeHeader: Locator;
readonly completeText: Locator;
readonly backHomeButton: Locator;
readonly cartBadge: Locator;

 
  constructor(page: Page) {
    super(page);
 
    // Step 1
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButtonStepOne = page.locator('[data-test="cancel"]');
    this.errorMessage = page.locator('[data-test="error"]');
 
    // Step 2
    this.cartItems = page.locator('.cart_item');
    this.subtotalLabel = page.locator('.summary_subtotal_label');
    this.taxLabel = page.locator('.summary_tax_label');
    this.totalLabel = page.locator('.summary_total_label');
    this.finishButton = page.locator('[data-test="finish"]');
    this.cancelButtonStepTwo = page.locator('[data-test="cancel"]');
    this.summaryInfoLabel = page.locator('[data-test="payment-info-value"]');
    this.summaryInfoValue = page.locator('[data-test="shipping-info-value"]');
 
    // Complete
    this.completeHeader = page.locator('.complete-header');
    this.completeText = page.locator('.complete-text');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
    this.cartBadge = page.locator('.shopping_cart_badge');
    
  }
 
  async goToCheckoutStepOne(): Promise<void> {
    const startTime = Date.now();
    await this.navigate('https://www.saucedemo.com/checkout-step-one.html');
    await expect(this.page).toHaveURL(/.*checkout-step-one.html/);
    await this.waitForPageLoad(startTime);
  }

  async goToCheckoutStepTwo(): Promise<void> {
    const startTime = Date.now();
    await this.navigate('https://www.saucedemo.com/checkout-step-two.html');
    await expect(this.page).toHaveURL(/.*checkout-step-two.html/);
    await this.waitForPageLoad(startTime);
  }

  async verifyCheckoutContent(): Promise<void> {
    await expect(this.cartBadge).toBeVisible();
    await expect(this.firstNameInput).toBeVisible()
    await expect(this.firstNameInput).toHaveAttribute('placeholder', 'First Name');
    await expect(this.lastNameInput).toBeVisible();
    await expect(this.lastNameInput).toHaveAttribute('placeholder', 'Last Name');
    await expect(this.postalCodeInput).toBeVisible();
    await expect(this.postalCodeInput).toHaveAttribute('placeholder', 'Zip/Postal Code');
    await expect(this.continueButton).toBeVisible();
    await expect(this.continueButton).toHaveText('Continue');
    await expect(this.cancelButtonStepOne).toBeVisible();
    await expect(this.cancelButtonStepOne).toHaveText('Cancel');
    console.log('Checkout Step One content verified successfully.');
  }

  async verifyInputFieldsEmpty(): Promise<void> {
    //toBeEmpty() only works for input and textarea element
    await expect(this.firstNameInput).toHaveValue('');
    await expect(this.lastNameInput).toHaveValue('');
    await expect(this.postalCodeInput).toHaveValue('');
  }

  async verifyFirstNameInputField(firstName: string): Promise<void> {
    await this.firstNameInput.clear();
    await this.firstNameInput.fill(firstName);
    await expect(this.firstNameInput).toHaveValue(firstName);
    console.log(`First name input field verified with value: ${firstName}`);
  }

  async verifyLastNameInputField(lastName: string): Promise<void> {
    await this.lastNameInput.clear();
    await this.lastNameInput.fill(lastName);
    await expect(this.lastNameInput).toHaveValue(lastName);
    console.log(`Last name input field verified with value: ${lastName}`);
  }

  async verifyPostalCodeInputField(postalCode: string): Promise<void> {
    await this.postalCodeInput.clear();
    await this.postalCodeInput.fill(postalCode);
    await expect(this.postalCodeInput).toHaveValue(postalCode);
    console.log(`Postal code input field verified with value: ${postalCode}`);
  }

  async verifyTabKeyMovesFormFocus(): Promise<void> {
    await this.firstNameInput.focus();
    await this.page.keyboard.press('Tab');
    await expect(this.lastNameInput).toBeFocused();
    await this.page.keyboard.press('Tab');
    await expect(this.postalCodeInput).toBeFocused();
    await this.page.keyboard.press('Tab');
    await expect(this.cancelButtonStepOne).toBeFocused();
    await this.page.keyboard.press('Tab');
    await expect(this.continueButton).toBeFocused();
    console.log('Tab key navigation successfully');
  }

  async clearAllFields(): Promise<void> {
    await this.firstNameInput.clear();
    await this.lastNameInput.clear();
    await this.postalCodeInput.clear();
    console.log('All input fields cleared');
  }
 
  // Step 1 Methods
  async fillCheckoutInfo(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await expect(this.firstNameInput).toHaveValue(firstName);
    await this.lastNameInput.fill(lastName);
    await expect(this.lastNameInput).toHaveValue(lastName);
    await this.postalCodeInput.fill(postalCode);
    await expect(this.postalCodeInput).toHaveValue(postalCode);
  }
 
  async clickContinue(): Promise<void> {
    const startTime = Date.now();
    await this.continueButton.click();
    await this.waitForPageLoad(startTime);
  }
 
  async clickCancelStepOne(): Promise<void> {
    const startTime = Date.now();
    await this.cancelButtonStepOne.click();
    await this.waitForPageLoad(startTime);
  }
 
  // Step 2 Methods
  async clickFinish(): Promise<void> {
    const startTime = Date.now();
    await this.finishButton.click();
    await this.waitForPageLoad(startTime);
  }
 
  async clickCancelStepTwo(): Promise<void> {
    const startTime = Date.now();
    await this.cancelButtonStepTwo.click();
    await this.waitForPageLoad(startTime);
  }
 
  async getSubtotal(): Promise<number> {
    const text = await this.subtotalLabel.innerText();
    return parseFloat(text.replace('Item total: $', ''));
  }
 
  async getTax(): Promise<number> {
    const text = await this.taxLabel.innerText();
    return parseFloat(text.replace('Tax: $', ''));
  }
 
  async getTotal(): Promise<number> {
    const text = await this.totalLabel.innerText();
    return parseFloat(text.replace('Total: $', ''));
  }
 
  // Verify Methods — Step 1
  async verifyErrorMessage(expectedMessage: string): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(expectedMessage);
    console.log(`Error message verified: ${expectedMessage}`);
  }
 
  async verifyOnStepOne(): Promise<void> {
    await expect(this.page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html');
  }
 
  // Verify Methods — Step 2
  async verifyOnStepTwo(): Promise<void> {
    await expect(this.page).toHaveURL('https://www.saucedemo.com/checkout-step-two.html');
  }

 
  async verifyTotalEqualsSubtotalPlusTax(): Promise<void> {
    const subtotal = await this.getSubtotal();
    const tax = await this.getTax();
    const total = await this.getTotal();
    expect(total).toBeCloseTo(subtotal + tax, 2);
  }
 
  async verifyOrderSummaryVisible(): Promise<void> {
    await expect(this.cartItems).toBeVisible();
    await expect(this.subtotalLabel).toBeVisible();
    await expect(this.taxLabel).toBeVisible();
    await expect(this.totalLabel).toBeVisible();
    await expect(this.finishButton).toBeVisible();
    await expect(this.cancelButtonStepTwo).toBeVisible();
    console.log('Order summary content verified successfully.');
  }
 
  // Verify Methods — Complete
  async verifyOnCompletePage(): Promise<void> {
    await expect(this.page).toHaveURL('https://www.saucedemo.com/checkout-complete.html');
  }
 
  async verifySuccessMessage(): Promise<void> {
    await expect(this.completeHeader).toHaveText('Thank you for your order!');
    const header = await this.completeHeader.innerText();
    const text = await this.completeText.innerText();
    console.log(header);
    console.log(text);
  }
  
  async verifyBackHomeButton(): Promise<void> {
    await expect(this.backHomeButton).toBeVisible();
    await this.backHomeButton.click();
  }
  async verifyCartIsCleared(): Promise<void> {
    await expect(this.cartBadge).toHaveCount(0);
  }

  async getOrderSummary(): Promise<void> {
    const summaryProduct = await this.summaryInfoLabel.innerText();
    console.log(`Order summary info: ${summaryProduct}`);
    const shippingInfo = await this.summaryInfoValue.innerText();
    console.log(`Shipping info: ${shippingInfo}`);

    await this.verifyTotalEqualsSubtotalPlusTax();
    const subtotal = await this.getSubtotal();
    const tax = await this.getTax();
    const total = await this.getTotal();

    console.log(`Subtotal: $${subtotal}`);
    console.log(`Tax: $${tax}`);
    console.log(`Total: $${total}`); 

  }

  async getCompleteItemNamesList(): Promise<void> {
    const itemCount = await this.cartItems.count();

    if(itemCount === 0){
      console.log('No items found in the cart.');
      return;
    }

    const itemNames = await this.cartItems.locator('.inventory_item_name').allInnerTexts();


    itemNames.forEach((name, index) => {
      console.log(`Complete page - Item ${index + 1}: ${name}`);
    });

  }

  async getCompleteItemPricesList(): Promise<void> {
    const itemCount = await this.cartItems.count();

    if(itemCount === 0){
      console.log('No items found in the cart.');
      return;
    }

    const itemPrices = await this.cartItems.locator('.inventory_item_price').allInnerTexts();
    itemPrices.forEach((Price, index) => {
      console.log(`Item ${index + 1}: ${Price}`);
    });
  }




}