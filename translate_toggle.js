const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// The HTML contains these lines:
// <div class="toggle-group" style="display:flex; border-radius:6px; overflow:hidden; border:1px solid var(--g300); font-family:Arial, sans-serif;">
//     <button id="btn-islamic-off" style="flex:1; width:100px; padding:8px 8px; background:var(--red); color:white; border:none; cursor:pointer; font-size:14px; font-weight:bold; transition:all 0.3s; text-align:center;" onclick="app.toggleIslamicMode(false); updateIslamicUI(false);">
//         Profit Mode
//     </button>
//     <button id="btn-islamic-on" style="flex:1; width:100px; padding:8px 8px; background:var(--g100); color:var(--g800); border:none; cursor:pointer; font-size:14px; font-weight:bold; transition:all 0.3s; text-align:center;" onclick="app.toggleIslamicMode(true); updateIslamicUI(true);">
//         Islamic Mode
//     </button>
// </div>

const oldToggleGroupRegex = /<div class="toggle-group"[\s\S]*?<\/div>/;

const newToggleGroup = `<div class="toggle-group" style="display:flex; border-radius:6px; overflow:hidden; border:1px solid var(--g300);">
                        <button id="btn-islamic-off" style="flex:1; width:100px; padding:8px 8px; background:var(--red); color:white; border:none; cursor:pointer; font-size:14px; font-weight:bold; transition:all 0.3s; text-align:center;" onclick="app.toggleIslamicMode(false); updateIslamicUI(false);">
                            💰 منافع موڈ
                        </button>
                        <button id="btn-islamic-on" style="flex:1; width:100px; padding:8px 8px; background:var(--g100); color:var(--g800); border:none; cursor:pointer; font-size:14px; font-weight:bold; transition:all 0.3s; text-align:center;" onclick="app.toggleIslamicMode(true); updateIslamicUI(true);">
                            🕌 شرعی موڈ
                        </button>
                    </div>`;

html = html.replace(oldToggleGroupRegex, newToggleGroup);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Translated buttons and added icons');
