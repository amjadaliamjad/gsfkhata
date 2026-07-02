const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const navLinksEndStr = '</div>\r\n        <button class="nav-toggle"';
const navLinksEndStr2 = '</div>\n        <button class="nav-toggle"';

let navLinksEnd = html.indexOf(navLinksEndStr);
if (navLinksEnd === -1) navLinksEnd = html.indexOf(navLinksEndStr2);

if (navLinksEnd !== -1) {
    const toggleHTML = `
                <div style="display:flex; align-items:center; gap:10px; margin-right:15px; border-right: 1px solid var(--g200); padding-right:15px;">
                    <span style="font-size:14px; font-weight:bold; color:var(--g800);">Islamic Mode</span>
                    <label class="switch" style="position:relative; display:inline-block; width:44px; height:24px;">
                      <input type="checkbox" id="islamic-mode-toggle" onchange="app.toggleIslamicMode(this.checked)" style="opacity:0; width:0; height:0;">
                      <span class="slider" style="position:absolute; cursor:pointer; top:0; left:0; right:0; bottom:0; background-color:#dc2626; transition:.4s; border-radius:4px;"></span>
                    </label>
                </div>
`;
    html = html.substring(0, navLinksEnd) + toggleHTML + html.substring(navLinksEnd);
    fs.writeFileSync('index.html', html, 'utf8');
    console.log('Fixed index.html toggle location');
} else {
    console.log('Could not find nav-links end in index.html');
}

let oldUi = fs.readFileSync('old_ui.js', 'utf8');
let currentUi = fs.readFileSync('js/ui.js', 'utf8');

const startTarget = 'export function renderCashProfit(config, calc) {';
const endTarget = 'export function renderAgriculture(config, calcDataAll) {';

const startIdx = oldUi.indexOf(startTarget);
const endIdx = oldUi.indexOf(endTarget);

if (startIdx !== -1 && endIdx !== -1) {
    const missingBlock = oldUi.substring(startIdx, endIdx);
    
    // insert missingBlock right before renderAgriculture in currentUi
    const insertIdx = currentUi.indexOf(endTarget);
    if (insertIdx !== -1) {
        currentUi = currentUi.substring(0, insertIdx) + missingBlock + '\n\n' + currentUi.substring(insertIdx);
        fs.writeFileSync('js/ui.js', currentUi, 'utf8');
        console.log('Fixed ui.js functions restored');
    } else {
        console.log('Could not find renderAgriculture in currentUi');
    }
} else {
    console.log('Could not find targets in oldUi');
}
