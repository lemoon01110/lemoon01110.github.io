import os
import re

directory = "notes/information-theory"

for filename in os.listdir(directory):
    if not filename.endswith(".qmd") or filename == "information-theory.qmd" or filename == "chapter14.qmd":
        continue
        
    filepath = os.path.join(directory, filename)
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
        
    if "hero-title" in content:
        print(f"Skipping {filename}, already processed.")
        continue
        
    # Extract title
    title_match = re.search(r'^title:\s+"([^"]+)"', content, flags=re.MULTILINE)
    if not title_match:
        title_match = re.search(r'^title:\s+([^\n]+)', content, flags=re.MULTILINE)
        
    if not title_match:
        print(f"Could not find title in {filename}")
        continue
        
    title = title_match.group(1).strip()
    print(f"Processing {filename} with title: {title}")
    
    # Replace title with empty string
    content = content.replace(title_match.group(0), 'title: ""')
    
    # Find the end of frontmatter
    frontmatter_end = content.find("---", 3) + 3
    
    html_inject = f"""
```{{=html}}
<style>
  .navbar::before {{
    background: transparent !important;
  }}
</style>

<!-- Three.js Library -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"></script>

<!-- WebGL Background Canvas -->
<canvas id="bg-canvas" style="position: fixed; top: -10px; left: 0; z-index: -1; width: 100vw; height: calc(100vh + 10px); mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 90%); -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 90%); pointer-events: none;"></canvas>

<div class="subject-hero" style="padding-top: 6rem; padding-bottom: 0rem;">
  <h1 class="hero-title hero-highlight" style="font-size: 3rem;">{title}</h1>
</div>
```
"""
    
    # Inject HTML
    content = content[:frontmatter_end] + "\n" + html_inject + content[frontmatter_end:]
    
    # Process practice problems
    # A practice problem starts with "1. **Title**:" and continues until the next problem or EOF.
    
    lines = content.split('\n')
    new_lines = []
    in_problem = False
    
    for line in lines:
        match = re.match(r'^(\d+)\.\s+\*\*(.*?)\*\*:(?:\s+(.*))?$', line)
        if match:
            if in_problem:
                new_lines.append(":::")
                new_lines.append("")
            
            in_problem = True
            new_lines.append("::: {.thm-box .thm-problem}")
            new_lines.append(f"### {match.group(1)}. {match.group(2)}")
            if match.group(3):
                new_lines.append(match.group(3))
        elif in_problem and line.startswith("## "):
            # Left problem section (shouldn't happen since it's at the end, but just in case)
            in_problem = False
            new_lines.append(":::")
            new_lines.append("")
            new_lines.append(line)
        else:
            new_lines.append(line)
            
    if in_problem:
        new_lines.append(":::")
        
    content = "\n".join(new_lines)
    
    # Inject digital rain script at the very end
    if "bg-digital-rain.js" not in content:
        content += """\n
```{=html}
<script src="/assets/bg-digital-rain.js"></script>
```
"""
        
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
        
print("Done.")
