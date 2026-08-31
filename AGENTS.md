# Project Guidance

## Original objective

This project is a personal learning playground for understanding Playwright and TypeScript through the SauceDemo ecommerce website. The goal is to explore how browser automation feels in practice by trying many realistic and experimental scenarios, including:

- Login success and failure flows.
- Inventory, product details, sorting, cart, and checkout workflows.
- Page Object Model design.
- Playwright fixtures and reusable test code.
- Assertions, screenshots, visual checks, traces, and videos.
- Multiple browsers, mobile emulation, touch input, scrolling, and orientation.
- API routing and request inspection.
- Network throttling and performance measurements.
- Accessibility, OCR, PDF, database, Cucumber, and AI-assisted testing experiments.

The project should remain useful for learning. Improvements should make the tests clearer, more reliable, and easier to run without removing the experiments or changing their educational purpose.

## Current project shape

- Language: TypeScript.
- Test runner: Playwright Test.
- Main test directory: `tests/`.
- Page objects: `LoginPage.ts`, `InventoryPage.ts`, `CartPage.ts`, `CheckoutPage.ts`, and `MobileLoginPage.ts`.
- Shared base utilities: `Basepage.ts`.
- Custom fixtures: `tests/index.ts`.
- Authentication setup: `tests/auth.setup.ts`.
- Additional experiments: API, database, PDF, OCR, performance, Cucumber, and scheduling files.

## Completed improvements

The following refactors and fixes have been completed during the learning process:

- Corrected the `testIgnore` file patterns for `download.spec.ts`, `API.spec.ts`, and `db.spec.ts`.
- Added screenshot ignore rules and removed generated screenshots from Git tracking while preserving the local files.
- Kept `auth.setup.ts` for future learning, but removed its `storageState` usage from the main desktop browser projects so login tests can start logged out.
- Changed several swallowed assertion failures to re-throw the original error after diagnostic logging or screenshots.
- Replaced the swallowed status-check failure in `BasePage.checkStatusURL()` with a normal failing assertion.
- Added `await` to the inventory product-count assertion.
- Added inventory page URL and product-count verification.
- Improved inventory product validation by checking each item’s own name, price, description, image, and Add to cart button.
- Replaced logging-only A-Z, Z-A, low-to-high, and high-to-low sorting checks with array comparisons.
- Improved `addMultiplyItemToCart()` to scope each Add to cart and Remove button to its individual inventory item.
- Added cart-item verification for a specific product name and price.
- Replaced several random product selections in core tests with deterministic product selections.
- Renamed product methods to distinguish inventory-page addition from detail-page addition.
- Renamed the generic page-load timing helper to `logDuration` and kept performance timing separate from normal UI synchronization.
- Removed some unnecessary manual `page.close()` calls from fixture-based tests.

Some of these improvements are partial. Remaining `try/catch` blocks, commented-out code, random experiments, and page-object cleanup should be reviewed before considering the related roadmap items complete.

## Working principles

1. Preserve the learning intent while improving quality.
2. A test must fail when its expected behavior is wrong.
3. Prefer deterministic, readable tests over clever or random tests.
4. Keep actions in page objects and business scenarios in spec files.
5. Prefer Playwright locators and web-first assertions over arbitrary waits.
6. Keep experimental tests separate from the dependable core regression suite.
7. Do not modify unrelated user changes.
8. Run TypeScript checks and focused Playwright tests after changes.

## Improvement roadmap

### Priority 1: Correct test discovery and execution

- Fix `testIgnore` patterns in `playwright.config.ts`. File patterns such as `**/download.spec.ts/**` should be `**/download.spec.ts`.
- Decide which files are part of the normal suite and which are experiments.
- Prevent all tests from running across every browser project by default.
- Configure mobile tests to run only on mobile projects.
- Start with one focused project, normally Chromium, before expanding cross-browser coverage.
- Verify the intended test list with `npx playwright test --list`.

### Priority 2: Make failures visible

- Review every `try/catch` in the test files and page objects.
- Re-throw caught errors after taking a screenshot or logging diagnostic information.
- Do not allow a test to pass merely because a failure was printed to the console.
- Replace misleading test names such as “Should failed” with explicit expected-failure or defect documentation.

### Priority 3: Correct authentication and test isolation

- Keep login-page tests on a clean context without `storageState`.
- Use the saved authentication state only for tests that begin after login.
- Separate login and authenticated projects or override `storageState` where appropriate.
- Ensure each test starts with predictable local storage and cart state.
- Prevent database tests from modifying the same database concurrently.
- Keep authentication files and secrets out of source control.

### Priority 4: Strengthen assertions

- Replace logging-only checks with assertions.
- Assert the complete sorted product list, not only the first and last item.
- Assert product names, prices, descriptions, image behavior, cart quantities, and checkout totals.
- Scope locators to the relevant product or cart item instead of relying on `.first()` when possible.
- Use clear return types for page-object methods.
- Correct spelling and naming issues such as `verifyErroMessage` to `verifyErrorMessage` while preserving compatibility during migration.

### Priority 5: Improve reliability and determinism

- Replace normal regression tests that use `Math.random()` with fixed, named products.
- Keep random or stress tests as explicitly labelled experiments.
- Avoid unnecessary `waitForLoadState('networkidle')`; rely on locator actions and web-first assertions where possible.
- Avoid arbitrary timeouts and `force: true` unless the reason is documented.
- Capture the selected item or random seed when randomness is retained.
- Use stable selectors, preferably accessible roles or SauceDemo `data-test` attributes.

### Priority 6: Simplify the test lifecycle

- Remove unnecessary `page.close()` calls; Playwright manages test pages and contexts automatically.
- Use the existing custom fixtures consistently, especially the authenticated-user fixture.
- Avoid creating duplicate `LoginPage`, `InventoryPage`, and `BasePage` objects inside tests when fixtures already provide them.
- Use `beforeEach` only for genuinely shared setup and keep tests independently runnable.

### Priority 7: Improve the Page Object Model

- Keep locators and page interactions inside page objects.
- Keep business-level assertions in page objects only when they represent a reusable page behavior.
- Split the large `Basepage.ts` into focused utilities or fixtures for screenshots, performance, network emulation, accessibility, API work, and diagnostics.
- Remove unused imports, commented-out code, duplicate locators, and obsolete methods.
- Use consistent class and method naming, such as `CheckoutPage` instead of `Checkout` if that better matches the other page objects.

### Priority 8: Separate core tests from experiments

Organize the project conceptually, and later physically if useful:

```text
tests/
  login/
  inventory/
  cart/
  checkout/

experiments/
  api/
  database/
  pdf/
  ocr/
  performance/
  ai/
```

- The core suite should cover login, inventory, cart, and checkout.
- Experimental suites should have separate commands and should not make the core suite depend on OCR engines, database mutation, external AI credentials, or unrelated files.
- Keep accessibility and visual tests explicit because they may need special baselines or environment settings.

### Priority 9: Improve performance and diagnostic checks

- Separate informational timing logs from pass/fail performance budgets.
- Correct timing labels and units in `Basepage.ts`.
- Measure navigation from a clearly defined start point.
- Avoid using a live website’s variable response time as a strict performance gate unless the environment is controlled.
- Ensure accessibility checks assert or report violations according to the intended purpose.
- Make external AI tests skip clearly when the required API key is unavailable.

### Priority 10: Documentation and maintainability

- Update `README.md` with the actual test commands and project layout.
- Document which tests require browsers, database files, OCR data, PDFs, or environment variables.
- Add focused npm scripts for core, browser, mobile, API, database, and experimental tests.
- Add formatting and linting when the core test structure is stable.
- Keep this file updated as the project evolves.

## First implementation sequence

When beginning improvements, use this order:

1. Fix `testIgnore` and project selection.
2. Remove swallowed failures and add missing assertions.
3. Correct authentication state and test isolation.
4. Run the core Chromium suite and fix its failures.
5. Remove unnecessary waits and manual page closing.
6. Replace random behavior in core tests.
7. Refactor shared utilities and organize experiments.
8. Expand to mobile and cross-browser projects.

## Verification checklist

After meaningful changes, check:

```bash
npx tsc --noEmit
npx playwright test --list
npx playwright test --project=chromium
```

For a focused change, run the smallest relevant spec first, then the core suite. Do not treat a passing test run as proof that assertions are meaningful; review the test output and failure behavior as well.
