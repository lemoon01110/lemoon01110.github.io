import sys
import asyncio
import os
from playwright.async_api import async_playwright

async def main():
    if len(sys.argv) < 2:
        print("Usage: python e2e_screenshot.py <url>")
        sys.exit(1)
        
    url = sys.argv[1]
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        await page.set_viewport_size({"width": 1280, "height": 800})
        
        await page.goto(url)
        
        # Wait for page readiness
        await page.wait_for_timeout(2000)
        
        try:
            # 1. Capture .hero-section
            hero = await page.wait_for_selector('.hero-section', timeout=5000)
            if hero:
                await hero.screenshot(path="screenshot_hero-section.png")
                print("Captured screenshot_hero-section.png")
        except Exception as e:
            print(f"Error capturing hero-section: {e}")
            
        try:
            # 2. Capture .glass-card (first)
            card = await page.wait_for_selector('.glass-card', timeout=5000)
            if card:
                card_loc = page.locator('.glass-card').first
                await card_loc.screenshot(path="screenshot_glass-card.png")
                print("Captured screenshot_glass-card.png")
        except Exception as e:
            print(f"Error capturing glass-card: {e}")
            
        try:
            # 3. Capture .glass-grid
            grid = await page.wait_for_selector('.glass-grid', timeout=5000)
            if grid:
                grid_loc = page.locator('.glass-grid').first
                await grid_loc.screenshot(path="screenshot_glass-grid.png")
                print("Captured screenshot_glass-grid.png")
        except Exception as e:
            print(f"Error capturing glass-grid: {e}")
            
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
