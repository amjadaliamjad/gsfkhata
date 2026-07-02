const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// The HTML contains these lines:
// <button id="btn-islamic-off" style="flex:1; width:95px; padding:6px 10px; background:var(--red); color:white; border:none; cursor:pointer; font-size:13px; font-weight:bold; transition:all 0.3s; line-height:1.2; text-align:center;" onclick="app.toggleIslamicMode(false); updateIslamicUI(false);">
//     غیر شرعی<br><small style="font-size:10px; font-weight:normal;">(سود کے ساتھ)</small>
// </button>
// <button id="btn-islamic-on" style="flex:1; width:95px; padding:6px 10px; background:var(--g100); color:var(--g800); border:none; cursor:pointer; font-size:13px; font-weight:bold; transition:all 0.3s; line-height:1.2; text-align:center;" onclick="app.toggleIslamicMode(true); updateIslamicUI(true);">
//     شرعی<br><small style="font-size:10px; font-weight:normal;">(بغیر سود)</small>
// </button>

// Let's replace the whole toggle-group
const oldToggleGroupRegex = /<div class="toggle-group"[\s\S]*?<\/div>/;

const newToggleGroup = `<div class="toggle-group" style="display:flex; border-radius:6px; overflow:hidden; border:1px solid var(--g300); font-family:Arial, sans-serif;">
                        <button id="btn-islamic-off" style="flex:1; width:100px; padding:8px 8px; background:var(--red); color:white; border:none; cursor:pointer; font-size:14px; font-weight:bold; transition:all 0.3s; text-align:center;" onclick="app.toggleIslamicMode(false); updateIslamicUI(false);">
                            Profit Mode
                        </button>
                        <button id="btn-islamic-on" style="flex:1; width:100px; padding:8px 8px; background:var(--g100); color:var(--g800); border:none; cursor:pointer; font-size:14px; font-weight:bold; transition:all 0.3s; text-align:center;" onclick="app.toggleIslamicMode(true); updateIslamicUI(true);">
                            Islamic Mode
                        </button>
                    </div>`;

html = html.replace(oldToggleGroupRegex, newToggleGroup);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Fixed button text and height');
