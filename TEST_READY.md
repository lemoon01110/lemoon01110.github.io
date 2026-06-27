# E2E Test Instructions

The E2E evaluation script `verify_build.py` has been created. 
It uses Playwright to capture screenshots of the rendered Quarto site (`_site/index.html`) at different scroll depths to prove the multi-aesthetic design implementation.

## Prerequisites
1. Ensure Quarto is installed and available in your `PATH`.
2. Ensure you have Playwright installed. If you are running this in a Python virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install playwright
   playwright install chromium
   ```

## Running the E2E Test
Execute the script from the project root:
```bash
python3 verify_build.py
```

## Expected Behavior
1. The script will first run `quarto render` to build the site into the `_site` directory.
2. It will use a headless Chromium browser to open `_site/index.html`.
3. It will capture three screenshots of the page:
   - `screenshot_1_top.png` (Top of the page)
   - `screenshot_2_middle.png` (Middle of the page)
   - `screenshot_3_bottom.png` (Bottom of the page)

Review the screenshots to verify the design aesthetics!
