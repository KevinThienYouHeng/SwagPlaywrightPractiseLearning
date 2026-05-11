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
 
    // Complete
    this.completeHeader = page.locator('.complete-header');
    this.completeText = page.locator('.complete-text');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
    this.cartBadge = page.locator('.shopping_cart_badge');
  }
 
  async goToCheckoutStepOne(): Promise<void> {
    await this.navigate('https://www.saucedemo.com/checkout-step-one.html');
    await this.waitForPageLoad();
  }
 
  // Step 1 Methods
  async fillCheckoutInfo(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }
 
  async clickContinue(): Promise<void> {
    await this.continueButton.click();
    await this.waitForPageLoad();
  }
 
  async clickCancelStepOne(): Promise<void> {
    await this.cancelButtonStepOne.click();
    await this.waitForPageLoad();
  }
 
  // Step 2 Methods
  async clickFinish(): Promise<void> {
    await this.finishButton.click();
    await this.waitForPageLoad();
  }
 
  async clickCancelStepTwo(): Promise<void> {
    await this.cancelButtonStepTwo.click();
    await this.waitForPageLoad();
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
  }
 
  // Verify Methods — Complete
  async verifyOnCompletePage(): Promise<void> {
    await expect(this.page).toHaveURL('https://www.saucedemo.com/checkout-complete.html');
  }
 
  async verifySuccessMessage(): Promise<void> {
    await expect(this.completeHeader).toHaveText('Thank you for your order!');
  }
 
  async verifyCartIsCleared(): Promise<void> {
    await expect(this.cartBadge).toHaveCount(0);
  }
}