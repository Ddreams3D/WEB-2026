import { test, expect } from '@playwright/test';

test.describe('System Diagnostic Harness', () => {
  
  test('Execute Internal Harness Suites', async ({ page }) => {
    // 1. Navigate to Harness
    await page.goto('/dev/harness');
    await expect(page.getByText('System Diagnostic Suite')).toBeVisible();

    // Helper to capture logs
    const getLogs = async () => {
      // Wait a bit for React to flush updates
      await page.waitForTimeout(500); 
      const logContainer = page.locator('.h-\\[400px\\]'); // The scrollable container
      return await logContainer.innerText();
    };

    const clearLogs = async () => {
      // Logic relies on component state reset or just ignoring previous logs.
      // The harness clears logs on run, so we are good.
    };

    // --- Suite 1: Health Check ---
    console.log('--- Running Health Check ---');
    // TabsTrigger in this codebase renders as a button, not role="tab"
    await page.getByRole('button', { name: 'Health' }).click();
    await page.getByRole('button', { name: 'Run Scan' }).click();
    
    // Wait for "Run Scan" to revert to "Run Scan" (it changes to "Running..." or spinner)
    // Or wait for specific success log
    await expect(page.locator('.animate-spin')).not.toBeVisible({ timeout: 10000 });
    
    let healthLogs = await getLogs();
    console.log(healthLogs);
    expect(healthLogs).not.toContain('FAILED');
    expect(healthLogs).not.toContain('error');

    // --- Suite 2: Cart Flow ---
    console.log('--- Running Cart Flow ---');
    await page.getByRole('button', { name: 'Flows' }).click();
    await page.getByRole('button', { name: 'Test Cart Flow' }).click();
    
    await expect(page.locator('.animate-spin')).not.toBeVisible({ timeout: 10000 });
    
    let cartLogs = await getLogs();
    console.log(cartLogs);
    expect(cartLogs).toContain('Cart cleared successfully');
    expect(cartLogs).not.toContain('mismatch');
    expect(cartLogs).not.toContain('error');

    // --- Suite 3: Order Logic ---
    console.log('--- Running Order Logic ---');
    await page.getByRole('button', { name: 'Orders' }).click();
    await page.getByRole('button', { name: 'Run Logic Tests' }).click();
    
    await expect(page.locator('.animate-spin')).not.toBeVisible({ timeout: 30000 }); // Longer timeout for stress tests
    
    let orderLogs = await getLogs();
    console.log(orderLogs);
    expect(orderLogs).toContain('Concurrent ops');
    expect(orderLogs).not.toContain('Suite failed');
    // Note: Some "errors" might be expected in risk detection tests if we had them enabled, 
    // but the current harness logic handles them as "success" logs if caught correctly.
    // However, the harness adds 'error' type logs if things actually break.
    
    // Check for explicit failure markers from the harness code
    const failures = await page.locator('.text-red-500').allInnerTexts();
    if (failures.length > 0) {
        console.error('FAILURES DETECTED:', failures);
        throw new Error(`Harness reported errors: ${failures.join(', ')}`);
    }
  });

});
