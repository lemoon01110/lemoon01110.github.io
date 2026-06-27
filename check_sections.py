import re

with open('index.qmd', 'r') as f:
    content = f.read()

required_sections = ['section-space', 'section-academic', 'section-glass']
missing = []

for sec in required_sections:
    if sec not in content:
        missing.append(sec)

if missing:
    print(f"FAILED: Missing sections in index.qmd: {missing}")
    exit(1)
else:
    print("SUCCESS: All sections found.")
    exit(0)
