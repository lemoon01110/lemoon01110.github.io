import os
import re

directories = [
    '/home/jackwu/Desktop/Repos/lemoon01110.github.io/notes/',
    '/home/jackwu/Desktop/Repos/lemoon01110.github.io/notes/information-theory/'
]

pattern = re.compile(r'###\s+(Problem\s+\d+:.*?)\s+\{#problem-(\d+)\s+\.thm-box\s+\.thm-problem\}')

for d in directories:
    for filename in os.listdir(d):
        if not filename.endswith('.qmd'):
            continue
        filepath = os.path.join(d, filename)
        with open(filepath, 'r') as f:
            content = f.read()
        
        # We need to find the start and end of the problem block to wrap it in :::
        # The block starts at the ### Problem... line and ends before <details
        
        lines = content.split('\n')
        new_lines = []
        in_problem = False
        problem_id = ""
        
        for line in lines:
            match = pattern.match(line)
            if match:
                in_problem = True
                problem_text = match.group(1)
                problem_id = match.group(2)
                new_lines.append(f"::: {{#problem-{problem_id} .thm-box .thm-problem}}")
                new_lines.append(f"### {problem_text}")
            elif in_problem and line.startswith('<details'):
                in_problem = False
                # Remove any trailing blank lines before adding :::
                while new_lines and new_lines[-1].strip() == '':
                    new_lines.pop()
                new_lines.append(":::")
                new_lines.append("")
                new_lines.append(line)
            else:
                new_lines.append(line)
                
        # Handle case where file ends while still in_problem
        if in_problem:
            while new_lines and new_lines[-1].strip() == '':
                new_lines.pop()
            new_lines.append(":::")
            new_lines.append("")
            
        with open(filepath, 'w') as f:
            f.write('\n'.join(new_lines))

print("Fixed problem headers.")
