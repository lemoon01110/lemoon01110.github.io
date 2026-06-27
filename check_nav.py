import os

with open('_quarto.yml', 'r') as f:
    content = f.read()

missing_files = []
for line in content.split('\n'):
    if 'href: ' in line:
        file = line.split('href: ')[1].strip()
        if not os.path.exists(file):
            missing_files.append(file)

if missing_files:
    print(f"FAILED: Navbar references missing files: {missing_files}")
    exit(1)
else:
    print("SUCCESS: All navbar references exist.")
    exit(0)
