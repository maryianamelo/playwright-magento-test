import { test, expect } from '@playwright/test';

test.describe('Magento Site Basic Tests', () => {

  test('PY-1 Homepage loads and title is correct', { tag: ['@Olimpo', '@Reports'] } , async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Home Page/);
  });

  test('PY-2 Search for product "shirt"', { tag: ['@Apollo', '@Payroll'] } , async ({ page }) => {
    await page.goto('/');
    await page.locator('#search').fill('shirt');
    await page.locator('#search').press('Enter');
    await expect(page).toHaveURL(/.*q=shirt.*/);
    const results = page.locator('.product-item');
    const count = await results.count();
    expect(count).toBeGreaterThan(0);
  });

  test('PY-3 Add first product to cart', { tag: ['@Olimpo', '@Reports'] } , async ({ page }) => {
    await page.goto('/');
    await page.locator('#search').fill('shirt');
    await page.locator('#search').press('Enter');
    const firstProduct = page.locator('.product-item').first();
    await firstProduct.click();

    const sizeOption = page.locator('div[option-label="M"]').first();
    if (await sizeOption.isVisible()) await sizeOption.click();

    const colorOption = page.locator('div[option-label="Blue"]').first();
    if (await colorOption.isVisible()) await colorOption.click();

    await page.getByRole('button', { name: /Add to Cart/ }).click();

    await page.waitForSelector('.message-success');
    const cartCount = page.locator('.counter-number');
    await expect(cartCount).not.toHaveText('0');
  });

  test('PY-4 Navigate to Men > Tops > Jackets category', { tag: ['@Olimpo', '@Reports'] } ,async ({ page }) => {
    await page.goto('/');
    await page.hover('a:has-text("Men")');
    await page.hover('a:has-text("Tops")');
    await page.click('a:has-text("Jackets")');
    await expect(page).toHaveURL(/.*men\/tops-men\/jackets.*/);
    const heading = page.locator('h1 span');
    await expect(heading).toHaveText('Jackets');
  });

  test('PY-5 Product detail page contains name, price, and Add to Cart button', { tag: ['@Olimpo', '@Reports'] } , async ({ page }) => {
    await page.goto('/');
    await page.locator('#search').fill('jacket');
    await page.locator('#search').press('Enter');
    await page.locator('.product-item').first().click();
    
    await expect(page.locator('.page-title')).toBeVisible();
    await expect(page.locator('.price')).toBeVisible();
    await expect(page.getByRole('button', { name: /Add to Cart/i })).toBeVisible();
  });

  test('PY-6 Filter Jackets category by size "M"', { tag: ['@Apollo', '@Payroll'] } , async ({ page }) => {
    await page.goto('https://magento.softwaretestingboard.com/men/tops-men/jackets.html');
    await page.locator('div.filter-options-title', { hasText: 'Size' }).click();
    await page.check('input[name="size"] + span:has-text("M")');
    await page.waitForLoadState('networkidle');

    const products = page.locator('.product-item');
    const productCount = await products.count();
    expect(productCount).toBeGreaterThan(0);
  });

  test('PY-7 Newsletter subscription with invalid email shows error', { tag: ['@Olimpo', '@Reports'] } , async ({ page }) => {
    await page.goto('/');
    await page.locator('#newsletter').fill('not-an-email');
    await page.locator('button[title="Subscribe"]').click();
    await expect(page.locator('.mage-error')).toHaveText(/Please enter a valid email address/);
  });

  test('PY-8 Footer contains Privacy and Cookie Policy link', { tag: ['@Apollo', '@Payroll'] } ,  async ({ page }) => {
    await page.goto('/');
    const link = page.locator('footer a', { hasText: 'Privacy and Cookie Policy' });
    await expect(link).toHaveAttribute('href', /privacy-policy/);
  });

});
