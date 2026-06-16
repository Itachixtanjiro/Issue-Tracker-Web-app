import { test, expect } from '@playwright/test';

test.describe('Issue Tracker App', () => {
  test('should load and display issues list', async ({ page }) => {
    await page.goto('/');
    
    // Verify page title
    await expect(page.locator('h1')).toContainText('Issues');
    
    // Verify create button exists
    const createBtn = page.locator('button', { hasText: /Create Issue/i });
    await expect(createBtn).toBeVisible();
    
    // Verify issues table is loaded
    const table = page.locator('table');
    await expect(table).toBeVisible();
  });

  test('should search issues with debounce', async ({ page }) => {
    await page.goto('/');
    
    // Find search input
    const searchInput = page.locator('input[placeholder*="Search"]');
    
    // Type search term (should debounce)
    await searchInput.fill('Bug');
    
    // Wait for filtered results
    await page.waitForTimeout(400); // Debounce delay + API call
    
    // Verify results changed
    const rows = page.locator('table tbody tr');
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should filter issues by status', async ({ page }) => {
    await page.goto('/');
    
    // Open status filter dropdown
    const statusFilter = page.locator('select[name="status"]');
    await statusFilter.selectOption('Open');
    
    // Wait for results to update
    await page.waitForTimeout(400);
    
    // Verify filtered results
    const rows = page.locator('table tbody tr');
    await expect(rows.first()).toBeVisible();
  });

  test('should create new issue', async ({ page }) => {
    await page.goto('/');
    
    // Click create issue button
    await page.locator('button', { hasText: /Create Issue/i }).click();
    
    // Verify modal appears
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();
    
    // Fill form
    await page.locator('input[placeholder*="Title"]').fill('New Test Issue');
    await page.locator('textarea').fill('This is a test issue');
    
    // Submit form
    await page.locator('button', { hasText: /Submit|Create/i }).click();
    
    // Verify success (modal closes)
    await expect(modal).not.toBeVisible();
  });

  test('should edit existing issue', async ({ page }) => {
    await page.goto('/');
    
    // Click edit button on first row
    await page.locator('table tbody tr').first().locator('button', { hasText: /Edit/i }).click();
    
    // Verify modal opens with data
    const titleInput = page.locator('input[placeholder*="Title"]');
    const originalValue = await titleInput.inputValue();
    
    // Modify title
    await titleInput.clear();
    await titleInput.fill('Updated Title');
    
    // Submit
    await page.locator('button', { hasText: /Submit|Update/i }).click();
    
    // Verify update
    await expect(page.locator('table')).toContainText('Updated Title');
  });

  test('should paginate issues correctly', async ({ page }) => {
    await page.goto('/');
    
    // Change page size to 10
    const pageSize = page.locator('select[name="pageSize"]');
    await pageSize.selectOption('10');
    
    // Wait for update
    await page.waitForTimeout(400);
    
    // Verify page size changed
    const rows = page.locator('table tbody tr');
    expect(await rows.count()).toBeLessThanOrEqual(10);
    
    // Click next page
    const nextBtn = page.locator('button[aria-label*="Next"]');
    if (await nextBtn.isEnabled()) {
      await nextBtn.click();
      await page.waitForTimeout(400);
      
      // Verify page changed
      const newRows = page.locator('table tbody tr');
      expect(await newRows.count()).toBeGreaterThan(0);
    }
  });

  test('should sort issues by clicking headers', async ({ page }) => {
    await page.goto('/');
    
    // Click on title header to sort
    const titleHeader = page.locator('table thead th', { hasText: /Title/i });
    await titleHeader.click();
    
    // Wait for sort
    await page.waitForTimeout(400);
    
    // Verify sort indicator (e.g., arrow icon)
    const sortIndicator = titleHeader.locator('svg, span.sort-indicator');
    await expect(sortIndicator).toBeVisible();
  });

  test('should view issue details on row click', async ({ page }) => {
    await page.goto('/');
    
    // Click on issue row (not edit button)
    const firstRow = page.locator('table tbody tr').first();
    const issueCell = firstRow.locator('td').first();
    await issueCell.click();
    
    // Verify navigation to detail page
    await expect(page).toHaveURL(/\/issues\/.+/);
    
    // Verify detail content
    await expect(page.locator('h1')).toContainText('Issue Details');
    await expect(page.locator('pre')).toContainText('id');
  });
});