import glob
import os

qmd_files = glob.glob('notes/information-theory/*.qmd')

for filepath in qmd_files:
    with open(filepath, 'r') as f:
        content = f.read()

    # 1. Fix Frontmatter for TOC (Right-hand side menu)
    if 'toc: true' not in content:
        parts = content.split('---')
        if len(parts) >= 3:
            parts[1] = parts[1].rstrip() + '\ntoc: true\ntoc-depth: 3\n'
            content = '---'.join(parts)

    # 2. Fix Sections to use thm-box color cards
    lines = content.split('\n')
    new_lines = []
    in_box = False
    
    for line in lines:
        if line.startswith('# '):
            # Close previous box if needed
            if in_box:
                new_lines.append(':::')
                new_lines.append('')
                in_box = False
            
            header = line[2:].strip()
            lower_header = header.lower()
            
            # Determine box type based on header text
            if 'definition' in lower_header:
                new_lines.append('::: {.thm-box .thm-definition}')
                new_lines.append(f'### {header}')
                in_box = True
            elif 'propert' in lower_header or 'theorem' in lower_header or 'bound' in lower_header or 'proof' in lower_header or 'divergence' in lower_header:
                new_lines.append('::: {.thm-box .thm-theorem}')
                new_lines.append(f'### {header}')
                in_box = True
            elif 'intuition' in lower_header or 'understanding' in lower_header or 'problem' in lower_header or 'concept' in lower_header:
                new_lines.append('::: {.thm-box .thm-remark}')
                new_lines.append(f'### {header}')
                in_box = True
            elif 'context' in lower_header or 'application' in lower_header or 'example' in lower_header or 'machine learning' in lower_header:
                new_lines.append('::: {.thm-box .thm-example}')
                new_lines.append(f'### {header}')
                in_box = True
            else:
                # Default box
                new_lines.append('::: {.thm-box .thm-remark}')
                new_lines.append(f'### {header}')
                in_box = True
        else:
            # Demote existing ### headers so they don't clash with the box title
            if in_box and line.startswith('### '):
                new_lines.append('#### ' + line[4:])
            else:
                new_lines.append(line)
                
    if in_box:
        new_lines.append(':::')
        
    with open(filepath, 'w') as f:
        f.write('\n'.join(new_lines))

print("Applied styling to all QMD files!")
