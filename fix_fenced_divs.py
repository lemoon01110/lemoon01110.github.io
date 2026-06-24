import os

directory = "notes/information-theory"

for filename in os.listdir(directory):
    if not filename.endswith(".qmd"):
        continue
        
    filepath = os.path.join(directory, filename)
    with open(filepath, "r", encoding="utf-8") as f:
        lines = f.readlines()
        
    new_lines = []
    for i, line in enumerate(lines):
        if line.startswith("::: {"):
            # Check if previous line is not empty and not just whitespace
            if i > 0 and lines[i-1].strip() != "":
                new_lines.append("\n")
        new_lines.append(line)
        
    with open(filepath, "w", encoding="utf-8") as f:
        f.writelines(new_lines)
        
print("Added blank lines before fenced divs.")
