const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');
let css = fs.readFileSync('css/style.css', 'utf8');

// 1. Shorter text for nav links
html = html.replace('🏘️ کرایہ نامہ', '🏘️ کرایہ');
html = html.replace('📈 منافع کی تقسیم', '📈 منافع تقسیم');
html = html.replace('🌾 زرعی زمین کا ٹھیکہ', '🌾 زرعی ٹھیکہ');
html = html.replace('💸 حافظ خادم کیش منافع', '💸 کیش منافع');
html = html.replace('📒 خاندانی کھاتہ', '📒 کھاتہ');
html = html.replace('📖 طریقہ کار کی وضاحت', '📖 طریقہ کار');

// Wait, the mobile menu also needs these replacements!
// Let's just do global replace
const replacements = {
    '🏘️ کرایہ نامہ': '🏘️ کرایہ',
    '📈 منافع کی تقسیم': '📈 منافع تقسیم',
    '🌾 زرعی زمین کا ٹھیکہ': '🌾 زرعی ٹھیکہ',
    '💸 حافظ خادم کیش منافع': '💸 کیش منافع',
    '📒 خاندانی کھاتہ': '📒 کھاتہ',
    '📖 طریقہ کار کی وضاحت': '📖 طریقہ کار'
};

for (const [oldText, newText] of Object.entries(replacements)) {
    html = html.split(oldText).join(newText);
}

// 2. Redesign the Islamic Toggle button
const oldToggleStr = `<div style="display:flex; align-items:center; gap:10px; margin-right:15px; border-right: 1px solid var(--g200); padding-right:15px;">
                    <span style="font-size:14px; font-weight:bold; color:var(--g800);">Islamic Mode</span>
                    <label class="switch" style="position:relative; display:inline-block; width:44px; height:24px;">
                      <input type="checkbox" id="islamic-mode-toggle" onchange="app.toggleIslamicMode(this.checked)" style="opacity:0; width:0; height:0;">
                      <span class="slider" style="position:absolute; cursor:pointer; top:0; left:0; right:0; bottom:0; background-color:#dc2626; transition:.4s; border-radius:4px;"></span>
                    </label>
                </div>`;

const newToggleStr = `<div style="display:flex; margin-right:10px; border-right: 1px solid var(--g200); padding-right:10px; align-items:center;">
                    <div class="toggle-group" style="display:flex; border-radius:6px; overflow:hidden; border:1px solid var(--g300); font-family:'Noto Nastaliq Urdu', sans-serif;">
                        <button id="btn-islamic-off" style="padding:6px 10px; background:var(--red); color:white; border:none; cursor:pointer; font-size:13px; font-weight:bold; transition:all 0.3s; line-height:1.2;" onclick="app.toggleIslamicMode(false); updateIslamicUI(false);">
                            غیر شرعی<br><small style="font-size:10px; font-weight:normal;">(سود کے ساتھ)</small>
                        </button>
                        <button id="btn-islamic-on" style="padding:6px 10px; background:var(--g100); color:var(--g800); border:none; cursor:pointer; font-size:13px; font-weight:bold; transition:all 0.3s; line-height:1.2;" onclick="app.toggleIslamicMode(true); updateIslamicUI(true);">
                            شرعی<br><small style="font-size:10px; font-weight:normal;">(بغیر سود)</small>
                        </button>
                    </div>
                </div>
                <script>
                    function updateIslamicUI(isIslamic) {
                        const offBtn = document.getElementById('btn-islamic-off');
                        const onBtn = document.getElementById('btn-islamic-on');
                        if(isIslamic) {
                            onBtn.style.background = 'var(--gm)';
                            onBtn.style.color = 'white';
                            offBtn.style.background = 'var(--g100)';
                            offBtn.style.color = 'var(--g800)';
                        } else {
                            offBtn.style.background = 'var(--red)';
                            offBtn.style.color = 'white';
                            onBtn.style.background = 'var(--g100)';
                            onBtn.style.color = 'var(--g800)';
                        }
                    }
                </script>`;

html = html.replace(oldToggleStr, newToggleStr);

// 3. Remove old <style> from index.html (the one with .switch input)
const oldStyleStart = html.indexOf('<style>\n  .switch input:checked + .slider');
const oldStyleEnd = html.indexOf('</style>', oldStyleStart);
if (oldStyleStart !== -1 && oldStyleEnd !== -1) {
    html = html.substring(0, oldStyleStart) + html.substring(oldStyleEnd + 8);
}
// Clean up any remaining .switch styles just in case
const switchStyleRegex = /<style>[\s\S]*?\.switch input:checked \+ \.slider[\s\S]*?<\/style>/g;
html = html.replace(switchStyleRegex, '');

fs.writeFileSync('index.html', html, 'utf8');

// 4. Update CSS for .nav-item and .nav-links to fit better
css = css.replace('.nav-links{display:flex;gap:15px;align-items:center}', '.nav-links{display:flex;gap:5px;align-items:center;flex-wrap:nowrap;}');
css = css.replace('.nav-item{padding:10px 18px;border-radius:6px;font-size:16px;', '.nav-item{padding:8px 10px;border-radius:6px;font-size:14px;');

// Also let's make .navbar flex-wrap just in case on smaller screens, and min-height instead of fixed height
css = css.replace('.navbar{background:var(--w);color:var(--g800);display:flex;align-items:center;\r\n  justify-content:center;padding:0 20px;height:75px;position:sticky;top:0;', '.navbar{background:var(--w);color:var(--g800);display:flex;align-items:center;\r\n  justify-content:center;padding:10px 20px;min-height:75px;position:sticky;top:0;');
css = css.replace('.navbar{background:var(--w);color:var(--g800);display:flex;align-items:center;\n  justify-content:center;padding:0 20px;height:75px;position:sticky;top:0;', '.navbar{background:var(--w);color:var(--g800);display:flex;align-items:center;\n  justify-content:center;padding:10px 20px;min-height:75px;position:sticky;top:0;');

fs.writeFileSync('css/style.css', css, 'utf8');

console.log('Header redesigned!');
