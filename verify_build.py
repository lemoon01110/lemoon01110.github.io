import asyncio
import subprocess
import os
import sys
from playwright.async_api import async_playwright

async def main():
    #print("Running 'quarto render'...")
    #try:
    #    result = subprocess.run(["quarto", "render"], check=True, capture_output=True, text=True)
    #    print("Build output:")
    #    print(result.stdout)
    #except subprocess.CalledProcessError as e:
    #    print(f"Error during 'quarto render': {e}")
    #    print(e.stderr)
    #    sys.exit(1)
    #except FileNotFoundError:
    #    print("quarto command not found. Please ensure Quarto is installed.")
    #    sys.exit(1)

    site_dir = os.path.join(os.getcwd(), "_site")
    index_file = os.path.join(site_dir, "index.html")

    if not os.path.exists(index_file):
        print(f"Error: {index_file} does not exist. Site build may have failed.")
        sys.exit(1)

    print("Launching Playwright...")
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        # Open the local file directly
        file_url = f"file://{index_file}"
        print(f"Opening {file_url} ...")
        await page.goto(file_url)

        # Wait for any potential animations/content to load
        await page.wait_for_timeout(2000)

        # Get the page dimensions
        page_height = await page.evaluate("document.body.scrollHeight")
        viewport_height = await page.evaluate("window.innerHeight")

        # Screenshot 1: Top
        print("Capturing screenshot 1 (top)...")
        await page.screenshot(path="screenshot_1_top.png")

        # Screenshot 2: Middle
        print("Scrolling to middle and capturing screenshot 2...")
        middle_scroll = page_height // 2 - viewport_height // 2
        await page.evaluate(f"window.scrollTo(0, {middle_scroll})")
        await page.wait_for_timeout(1000)
        await page.screenshot(path="screenshot_2_middle.png")

        # Screenshot 3: Bottom
        print("Scrolling to bottom and capturing screenshot 3...")
        await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        await page.wait_for_timeout(1000)
        await page.screenshot(path="screenshot_3_bottom.png")

        await browser.close()
        print("E2E testing completed successfully! Screenshots saved.")

if __name__ == "__main__":
    asyncio.run(main())
