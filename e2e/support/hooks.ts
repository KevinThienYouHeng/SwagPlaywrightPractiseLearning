import { Before, After, Status } from '@cucumber/cucumber';
import { SwagWorld } from './world';
import * as fs from 'fs';
import * as path from 'path';

Before(async function (this: SwagWorld) {
  await this.init();
});

After(async function (this: SwagWorld, {result}) {
    
    if (result?.status === Status.FAILED) {
    const dir = 'e2e/screenshots';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    
    const file = path.join(dir, `${Date.now()}-failed.png`);
    await this.page.screenshot({ path: file, fullPage: true });
    console.log(`Screenshot saved: ${file}`);
  }
  await this.teardown();
});