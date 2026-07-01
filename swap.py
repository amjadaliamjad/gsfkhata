import codecs
import re

with codecs.open('js/ui.js', 'r', 'utf-8') as f:
    content = f.read()

token_profit_start = '    <!-- Profit Distribution Table -->'
idx_profit_start = content.find(token_profit_start)

token_final_start = '        <!-- ════ NEW TABLE: Fixed Rent Final Adjustment ════ -->'
idx_final_start = content.find(token_final_start)

idx_final_end = content.find('    `;\r\n}')
if idx_final_end == -1: idx_final_end = content.find('    `;\n}')
idx_final_end += len('    `;\n}')

if idx_profit_start == -1 or idx_final_start == -1 or idx_final_end == -1:
    print('Failed to find indices', idx_profit_start, idx_final_start, idx_final_end)
    exit(1)

profit_block = content[idx_profit_start:idx_final_start]
final_block = content[idx_final_start:idx_final_end - len('    `;\n}')]

old_style_regex = r'<div style="background-color: #ffffff; border: 2px solid var\(--blu\); margin-top: 40px; border-radius:12px; overflow:hidden; box-shadow:var\(--s2\);">\s*<h2 style="background:var\(--blu\); color:white; margin:0; padding:15px 20px;">طے شدہ فکسڈ کرائے کے مطابق کھاتوں کی حتمی ایڈجسٹمنٹ</h2>'
new_style = '<br>\n    <div class="table-container">\n        <h3 style="background:var(--gd);color:white;justify-content:center;font-size:24px;border:none;">طے شدہ فکسڈ کرائے کے مطابق کھاتوں کی حتمی ایڈجسٹمنٹ</h3>'

final_block = re.sub(old_style_regex, new_style, final_block)

new_content = content[:idx_profit_start] + final_block + '\n' + profit_block + '    `;\n}' + content[idx_final_end:]

with codecs.open('js/ui.js', 'w', 'utf-8') as f:
    f.write(new_content)
print('Done')
