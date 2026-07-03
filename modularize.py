import re

with open('custom.scss', 'r') as f:
    lines = f.readlines()

def write_partial(name, start_marker, end_marker=None):
    start_idx = -1
    end_idx = len(lines)
    for i, line in enumerate(lines):
        if start_marker in line:
            start_idx = i
            break
            
    if start_idx == -1:
        print(f"Could not find {start_marker}")
        return
        
    if end_marker:
        for i in range(start_idx + 1, len(lines)):
            if end_marker in lines[i]:
                end_idx = i
                break
                
    with open(f'scss/{name}.scss', 'w') as out:
        out.writelines(lines[start_idx:end_idx])
        
    return end_idx

# Variables (already done, but let's just make it clean)
# Base (line 33 to Sidebar)
write_partial('_base', 'body {', '/* Sidebar & TOC Layout')
write_partial('_sidebar', '/* Sidebar & TOC Layout', '/* Premium Hacker Neon Theorem Box System */')
write_partial('_components', '/* Premium Hacker Neon Theorem Box System */', '/* LAZY LOAD STAGGER ANIMATION */')
write_partial('_animations', '/* LAZY LOAD STAGGER ANIMATION */')

# Rewrite custom.scss
with open('custom.scss', 'w') as out:
    out.write('/*-- scss:defaults --*/\n')
    out.write('@import "scss/variables";\n\n')
    out.write('/*-- scss:rules --*/\n')
    out.write('@import "scss/base";\n')
    out.write('@import "scss/sidebar";\n')
    out.write('@import "scss/components";\n')
    out.write('@import "scss/animations";\n')

print("Modularization complete!")
