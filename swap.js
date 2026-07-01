const fs = require('fs');
let code = fs.readFileSync('js/ui.js', 'utf8');

const t1_start = '    <!-- Profit Distribution Table -->';
const t2_start = '        <!-- ════ NEW TABLE: Fixed Rent Final Adjustment ════ -->';
const t2_end = '    `;\n}';
let endToken = code.indexOf('    `;\r\n}') !== -1 ? '    `;\r\n}' : '    `;\n}';

const idx1 = code.indexOf(t1_start);
const idx2 = code.indexOf(t2_start);
const idx3 = code.indexOf(endToken, idx2) + endToken.length;

if(idx1 === -1 || idx2 === -1 || idx3 === -1) {
    console.log('Error: indices not found', idx1, idx2, idx3);
    process.exit(1);
}

let profitHtml = code.substring(idx1, idx2);
let finalHtml = code.substring(idx2, idx3 - endToken.length);

// update header in finalHtml
const oldHeaderRegex = /<div style=\"background-color: #ffffff; border: 2px solid var\(--blu\); margin-top: 40px; border-radius:12px; overflow:hidden; box-shadow:var\(--s2\);\">\s*<h2 style=\"background:var\(--blu\); color:white; margin:0; padding:15px 20px;\">طے شدہ فکسڈ کرائے کے مطابق کھاتوں کی حتمی ایڈجسٹمنٹ<\/h2>/m;
const newHeader = '<br>\n    <div class=\"table-container\">\n        <h3 style=\"background:var(--gd);color:white;justify-content:center;font-size:24px;border:none;\">طے شدہ فکسڈ کرائے کے مطابق کھاتوں کی حتمی ایڈجسٹمنٹ</h3>';
finalHtml = finalHtml.replace(oldHeaderRegex, newHeader);

let newCode = code.substring(0, idx1) + finalHtml + '\n' + profitHtml + endToken + code.substring(idx3);
fs.writeFileSync('js/ui.js', newCode);
console.log('Successfully swapped!');
