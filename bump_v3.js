const fs = require('fs');

// 1. Bump version in index.html
let html = fs.readFileSync('index.html', 'utf8');
if (html.includes('app.js?v=2')) {
    html = html.replace('app.js?v=2', 'app.js?v=3');
}

// 2. Expand explanation in settings modal
let oldSettingsExp = `<div style="font-size:13px; color:var(--g600); margin-bottom:10px;">اگر بغیر منافع منتخب کریں تو کرائے اور کیش کی بقایا رقم پر منافع (کمپاؤنڈنگ) شامل نہیں کیا جائے گا۔</div>`;
let newSettingsExp = `<div style="font-size:13px; color:var(--g600); margin-bottom:10px; line-height:1.6;">
    <b>💰 منافع کے ساتھ (Non-Islamic):</b> اس میں پلاٹ کے علاوہ کرائے اور کیش پر بھی سالانہ منافع (کمپاؤنڈنگ) شامل کیا جاتا ہے، جس سے ممبران کو ان کی رکی ہوئی رقم پر اضافی فائدہ ملتا ہے۔<br>
    <b>🕌 بغیر منافع (Islamic / Shari):</b> اس میں صرف پلاٹ کی قدر میں اضافے کو جائز منافع تصور کیا جاتا ہے، جبکہ کرائے اور کیش پر کوئی اضافی سود/منافع لاگو نہیں کیا جاتا۔
</div>`;
if(html.includes(oldSettingsExp)) {
    html = html.replace(oldSettingsExp, newSettingsExp);
}
fs.writeFileSync('index.html', html, 'utf8');


// 3. Bump version in js/app.js
let appJs = fs.readFileSync('js/app.js', 'utf8');
appJs = appJs.replace(/calculator\.js\?v=\d+/, 'calculator.js?v=3');
appJs = appJs.replace(/ui\.js\?v=\d+/, 'ui.js?v=3');
fs.writeFileSync('js/app.js', appJs, 'utf8');

console.log("Bumped to v=3 and expanded settings explanation.");
