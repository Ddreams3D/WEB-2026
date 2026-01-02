import { test, expect } from '@playwright/test';

test.describe('Critical User Journeys', () => {
  
  test('Smoke Test: Public Pages Load', async ({ page }) => {
    const routes = [
      '/', 
      '/catalogo-impresion-3d', 
      '/services', 
      '/contact', 
      '/about'
    ];

    for (const route of routes) {
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      await expect(page).toHaveTitle(/Ddreams 3D/);
    }
  });

  test('Shopping Cart Flow', async ({ page }) => {
    // 1. Visit a product page (assuming seed data or known product)
    // Note: In a real test, we would seed a product first. 
    // For now, we visit the catalog and click the first product.
    await page.goto('/catalogo-impresion-3d');
    
    // Wait for products to load
    await page.waitForSelector('text=Agregar');
    
    // Click first "Agregar" button
    const addButtons = page.getByRole('button', { name: /Agregar/i });
    await addButtons.first().click();
    
    // Verify toast or cart counter update
    await expect(page.getByText(/agregado al carrito/i)).toBeVisible();
    
    // Open Cart
    await page.goto('/cart');
    await expect(page).toHaveURL('/cart');
    await expect(page.getByText('Resumen del pedido')).toBeVisible();
  });

  test('Contact Form Validation', async ({ page }) => {
    await page.goto('/contact');
    
    // Submit empty form
    await page.getByRole('button', { name: /Enviar/i }).click();
    
    // Expect validation errors
    await expect(page.getByText('El nombre es requerido')).toBeVisible();
    await expect(page.getByText('El email es requerido')).toBeVisible();
    await expect(page.getByText('El mensaje es requerido')).toBeVisible();
  });

});
