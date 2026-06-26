import os
import re

directories = [
    '/home/jackwu/Desktop/Repos/lemoon01110.github.io/notes/',
    '/home/jackwu/Desktop/Repos/lemoon01110.github.io/notes/information-theory/'
]

# We need to find block:
# ::: {#problem-1 .thm-box .thm-problem}
# ### Problem 1: Name
# ...
# :::
# And turn it back into:
# ### Problem 1: Name {#problem-1 .thm-box .thm-problem}
# ...

start_pattern = re.compile(r'^:::\s+\{#problem-(\d+)\s+\.thm-box\s+\.thm-problem\}$')
h3_pattern = re.compile(r'^###\s+(Problem\s+\d+:.*)$')

for d in directories:
    for filename in os.listdir(d):
        if not filename.endswith('.qmd'):
            continue
        filepath = os.path.join(d, filename)
        with open(filepath, 'r') as f:
            lines = f.read().split('\n')
        
        new_lines = []
        i = 0
        while i < len(lines):
            line = lines[i]
            match = start_pattern.match(line)
            if match:
                problem_id = match.group(1)
                i += 1
                if i < len(lines):
                    next_line = lines[i]
                    h3_match = h3_pattern.match(next_line)
                    if h3_match:
                        # Combine them
                        new_lines.append(f"### {h3_match.group(1)} {{#problem-{problem_id} .thm-box .thm-problem}}")
                    else:
                        new_lines.append(line)
                        new_lines.append(next_line)
                else:
                    new_lines.append(line)
            else:
                # Also, we need to remove the closing ::: before <details
                if line == ':::' and (i+1 < len(lines) and lines[i+1].strip() == '') and (i+2 < len(lines) and lines[i+2].startswith('<details')):
                    # Skip the ::: and the empty line
                    i += 1
                elif line == ':::' and (i+1 < len(lines) and lines[i+1].startswith('<details')):
                    # Skip the :::
                    pass
                else:
                    new_lines.append(line)
            i += 1
            
        with open(filepath, 'w') as f:
            f.write('\n'.join(new_lines))

print("Undid problem headers.")
