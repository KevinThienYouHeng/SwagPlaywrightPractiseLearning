import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium } from 'playwright';

export class SwagWorld extends World {
  browser!: Browser; //The ! tells TypeScript "trust me, this will be set before use."
  context!: BrowserContext;
  page!: Page;

  constructor(options: IWorldOptions) {
    super(options);
  }

  async init() {
    this.browser = await chromium.launch({ headless: true });
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();
  }

  async teardown() {
    await this.page?.close(); //Closes the tab. ?. = safe call (won't crash if page wasn't created).
    await this.context?.close();
    await this.browser?.close();
  }
}

setWorldConstructor(SwagWorld);