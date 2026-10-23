import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { createServer } from "vite";

/**
 * Captures the screenshots of the example review shown on the start page, in
 * both color schemes. Run it after UI changes that affect the review pages.
 */
const appDirectory = fileURLToPath(new URL("..", import.meta.url));
const stepPath = "/steps/opener-page";

const server = await createServer({ root: appDirectory, logLevel: "warn" });
await server.listen();
const browser = await chromium.launch();
try {
  const origin = server.resolvedUrls!.local[0]!.replace(/\/$/u, "");
  for (const colorScheme of ["light", "dark"] as const) {
    const page = await browser.newPage({
      colorScheme,
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: 2,
    });
    await page.goto(origin);
    await page.getByRole("button", { name: "see example" }).click();
    await page.waitForURL("**/overview");
    // Navigate client-side: a page load would drop the loaded review.
    await page.evaluate((path) => {
      window.history.pushState(null, "", path);
      window.dispatchEvent(new PopStateEvent("popstate"));
    }, stepPath);
    await page.waitForLoadState("networkidle");
    // Leaves out the app header: the start page shows the review itself.
    const headerHeight = (await page.locator("header").boundingBox())!.height;
    const viewport = page.viewportSize()!;
    await page.screenshot({
      path: `${appDirectory}public/screenshots/review-${colorScheme}.jpg`,
      type: "jpeg",
      quality: 85,
      clip: {
        x: 0,
        y: headerHeight,
        width: viewport.width,
        height: viewport.height - headerHeight,
      },
    });
    await page.close();
  }
} finally {
  await browser.close();
  await server.close();
}
