// Node 18+ has native fetch, so we don't need to import it if environment is new enough. 
// Assuming Node 20+ based on package.json engines.

const BASE_URL = 'http://localhost:3000';
const ROUTES = [
  '/',
  '/catalogo-impresion-3d',
  '/services',
  '/about',
  '/contact',
  '/process',
  '/privacy',
  '/terms',
  '/complaints',
  '/cart',
  '/login',
  // Specific Product Routes (Manual check since catalog is client-side)
  '/catalogo-impresion-3d/medicina/columna-vertebral-anatomica-escala-real',
  '/catalogo-impresion-3d/arte-diseno/cooler-motor-3d-v6',
  '/catalogo-impresion-3d/arte-diseno/cooler-motor-3d-v8'
];

const ANSI_RESET = "\x1b[0m";
const ANSI_RED = "\x1b[31m";
const ANSI_GREEN = "\x1b[32m";
const ANSI_YELLOW = "\x1b[33m";

async function checkUrl(url, context = '') {
  try {
    const res = await fetch(url, { method: 'HEAD' });
    if (res.ok) {
      return { ok: true, status: res.status };
    } else {
      // Retry with GET if HEAD fails (sometimes servers block HEAD)
      const resGet = await fetch(url);
      if (resGet.ok) return { ok: true, status: resGet.status };
      return { ok: false, status: resGet.status, error: `Status ${resGet.status}` };
    }
  } catch (error) {
    return { ok: false, error: error.message };
  }
}

async function extractLinksAndImages(html, baseUrl) {
  const images = new Set();
  const links = new Set();

  // Simple regex for src (images)
  const imgRegex = /<img[^>]+src=["']([^"']+)["']/g;
  let match;
  while ((match = imgRegex.exec(html)) !== null) {
    let src = match[1];
    // Decode HTML entities (simple version for &amp;)
    src = src.replace(/&amp;/g, '&');
    
    // Handle relative URLs
    if (src.startsWith('/')) {
        src = `${BASE_URL}${src}`;
    } else if (!src.startsWith('http')) {
        continue; // Skip data: or other schemes for now
    }
    // Filter out placeholders if we want to be strict, but we want to check availability
    images.add(src);
  }

  // Simple regex for href (links)
  const linkRegex = /<a[^>]+href=["']([^"']+)["']/g;
  while ((match = linkRegex.exec(html)) !== null) {
    let href = match[1];
    if (href.startsWith('/')) {
        // Exclude mailto, tel, etc.
        if (href.startsWith('mailto:') || href.startsWith('tel:')) continue;
        links.add(`${BASE_URL}${href}`);
    }
    // We only check internal links for 404s
  }

  return { images: Array.from(images), links: Array.from(links) };
}

async function runCheck() {
  console.log(`${ANSI_YELLOW}Starting System Health Check...${ANSI_RESET}\n`);
  
  let totalErrors = 0;
  let checkedUrls = new Set();
  let checkedImages = new Set();

  // 1. Check defined routes
  for (const route of ROUTES) {
    const url = `${BASE_URL}${route}`;
    process.stdout.write(`Checking ${route.padEnd(30)} ... `);
    
    try {
      const res = await fetch(url);
      if (!res.ok) {
        console.log(`${ANSI_RED}FAIL (${res.status})${ANSI_RESET}`);
        totalErrors++;
        continue;
      }
      
      console.log(`${ANSI_GREEN}OK${ANSI_RESET}`);
      const html = await res.text();
      const { images, links } = await extractLinksAndImages(html, BASE_URL);

      // Check Images
      for (const img of images) {
        if (checkedImages.has(img)) continue;
        checkedImages.add(img);

        const check = await checkUrl(img);
        if (!check.ok) {
            console.log(`  ${ANSI_RED}Broken Image:${ANSI_RESET} ${img} (${check.error || check.status})`);
            totalErrors++;
        }
      }

      // Add discovered links to queue (optional, for now just collecting)
      // For this microprogram, we won't deep crawl, but we could.
      
    } catch (error) {
      console.log(`${ANSI_RED}ERROR: ${error.message}${ANSI_RESET}`);
      totalErrors++;
    }
  }

  // 2. Fetch Catalog to find dynamic product routes
  console.log(`\n${ANSI_YELLOW}Checking Dynamic Product Routes...${ANSI_RESET}`);
  try {
      // Try fetching the API endpoint directly if available, or parse the catalog page
      // Let's assume we can fetch /api/products (if it exists) or just parse catalog page HTML
      // We already parsed catalog page above, but let's be explicit
      const catalogRes = await fetch(`${BASE_URL}/catalogo-impresion-3d`);
      const catalogHtml = await catalogRes.text();
      
      // Find product links: /catalogo-impresion-3d/[category]/[slug]
      const productLinkRegex = /href=["'](\/catalogo-impresion-3d\/[^"']+\/[^"']+)["']/g;
      let match;
      let productRoutes = [];
      while ((match = productLinkRegex.exec(catalogHtml)) !== null) {
          productRoutes.push(match[1]);
      }
      
      // Check first 3 products
      const productsToCheck = productRoutes.slice(0, 3);
      if (productsToCheck.length === 0) {
          console.log(`${ANSI_YELLOW}No products found on catalog page to check.${ANSI_RESET}`);
      }
      
      for (const pRoute of productsToCheck) {
          const url = `${BASE_URL}${pRoute}`;
          process.stdout.write(`Checking Product ${pRoute.padEnd(30)} ... `);
          const res = await fetch(url);
          if (res.ok) {
              console.log(`${ANSI_GREEN}OK${ANSI_RESET}`);
              // Check images on product page too
              const html = await res.text();
              const { images } = await extractLinksAndImages(html, BASE_URL);
              for (const img of images) {
                if (checkedImages.has(img)) continue;
                checkedImages.add(img);
                const check = await checkUrl(img);
                if (!check.ok) {
                    console.log(`  ${ANSI_RED}Broken Image:${ANSI_RESET} ${img}`);
                    totalErrors++;
                }
              }
          } else {
              console.log(`${ANSI_RED}FAIL (${res.status})${ANSI_RESET}`);
              totalErrors++;
          }
      }
      
  } catch (e) {
      console.log(`Error checking dynamic routes: ${e.message}`);
  }

  console.log(`\n${ANSI_YELLOW}Summary:${ANSI_RESET}`);
  if (totalErrors === 0) {
    console.log(`${ANSI_GREEN}All checks passed! No broken links or images found in sampled routes.${ANSI_RESET}`);
  } else {
    console.log(`${ANSI_RED}Found ${totalErrors} errors.${ANSI_RESET}`);
  }
}

runCheck();
