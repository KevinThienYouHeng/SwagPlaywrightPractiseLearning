//Learning what does Optical Character Recognition(OCR) or Intelligent document processing
import { test, expect } from '@playwright/test';
import { createWorker } from 'tesseract.js';


test('My First OCR Test - Reading Text From an Image', async ({ page }) => {

    await page.goto('https://playwright.dev/docs/trace-viewer');

    const targetImage = page.getByRole('img', { name: 'Playwright logo' });
    await targetImage.waitFor({ state: 'visible' });

    console.log('📸 Capturing image element screenshot...');
    const imageBuffer: Buffer = await targetImage.screenshot();

    console.log('🤖 Initializing Tesseract OCR engine...');
    const worker = await createWorker('eng');

    console.log('🔍 Extracting text from pixels...');
    const { data: { text } } = await worker.recognize(imageBuffer);
    await worker.terminate();

    console.log('====================================');
    console.log(text);
    console.log('====================================\n');

    //expect(text.toLowerCase()).toContain('playwright');

});

test('My First Successful OCR Test - Reading Clean Web Text', async ({ page }) => {
  // 1. Load the website
  await page.goto('https://playwright.dev/');

  // 2. Select the BIG written text headline on the hero banner
  // This is actual rendered text, not an icon graphic!
  const targetHeadline = page.locator('.hero__title');
  await targetHeadline.waitFor({ state: 'visible', timeout: 5000 });

  // 3. Take the snapshot snippet
  console.log('📸 Capturing clean text element snapshot...');
  const imageBuffer: Buffer = await targetHeadline.screenshot();

  // 4. Run Tesseract OCR
  console.log('🤖 Starting Tesseract engine...');
  const worker = await createWorker('eng');
  
  console.log('🔍 Extracting readable text characters...');
  const { data: { text } } = await worker.recognize(imageBuffer);
  await worker.terminate();

  // 5. Check what it read!
  console.log('\n====================================');
  console.log('✨ SUCCESS! OCR READ THIS TEXT:');
  console.log('====================================');
  console.log(text.trim());
  console.log('====================================\n');

  // 6. This assertion will now pass beautifully
  expect(text.toLowerCase()).toContain('playwright');
});