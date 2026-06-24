import os
import re

directory = "notes/information-theory"

for filename in os.listdir(directory):
    if not filename.endswith(".qmd") or filename == "information-theory.qmd" or filename == "chapter14.qmd":
        continue
        
    filepath = os.path.join(directory, filename)
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
        
    # Remove the canvas
    content = re.sub(r'<!-- WebGL Background Canvas -->\n<canvas id="bg-canvas".*?</canvas>\n+', '', content, flags=re.DOTALL)
    
    # Remove the script tag
    content = re.sub(r'```\{=html\}\n<script src="/assets/bg-digital-rain\.js"></script>\n```\n?', '', content, flags=re.DOTALL)
    
    # Remove hero-highlight class
    content = content.replace('class="hero-title hero-highlight"', 'class="hero-title" style="color: #ffffff;"')
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
        
print("Removed rain and gradient from notes pages.")
