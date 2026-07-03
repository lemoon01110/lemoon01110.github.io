import re

with open("index.qmd", "r") as f:
    content = f.read()

# 1. Split into parts to swap the rows
dystopian_start = content.find('<!-- Dystopian Row -->')
cs_start = content.find('<!-- Computer Science Row -->')
cs_end = content.find('</div>\n\n      </div>\n    </div>')

prefix = content[:dystopian_start]
dystopian_row = content[dystopian_start:cs_start]
cs_row = content[cs_start:cs_end]
suffix = content[cs_end:]

# 2. Fix Read and On Radar uncentering inside dystopian_row
# The user wants them centered, so I'll remove `text-align: left;` from their item-value inline styles, 
# and also remove `style="justify-content: flex-start; text-align: left;"` from the outer card.
dystopian_row = dystopian_row.replace('style="justify-content: flex-start; text-align: left;"', 'style="justify-content: center; text-align: center;"')
# Remove text-align: left from item-value
dystopian_row = re.sub(r'style="text-align: left; color: #eee; font-size: 0.95rem;"', 'style="text-align: center; color: #eee; font-size: 0.95rem;"', dystopian_row)

# 3. Add data-tilt-max="1" to Systems Programming card
# It currently has max-width: none; width: 100%;">
# We'll replace it to have data-tilt-max="1">
cs_row = cs_row.replace(
    'background: rgba(0,0,0,0.2); max-width: none; width: 100%;">\n                <div class="brutalist-header"',
    'background: rgba(0,0,0,0.2); max-width: none; width: 100%;" data-tilt-max="1">\n                <div class="brutalist-header"'
)

# 4. Rename GENRE // DYSTOPIAN to GENRE // OTHER LITERATURE GENRES
dystopian_row = dystopian_row.replace('GENRE // DYSTOPIAN', 'GENRE // OTHER LITERATURE GENRES')

# 5. Rename TOPIC // COMPUTER SCIENCE to TOPIC // STUDY MATERIAL
cs_row = cs_row.replace('TOPIC // COMPUTER SCIENCE', 'TOPIC // STUDY MATERIAL')

# Combine them in new order: prefix + cs_row + dystopian_row + suffix
new_content = prefix + cs_row + dystopian_row + suffix

with open("index.qmd", "w") as f:
    f.write(new_content)

print("Done")
