const fs = require('fs');

// 1. Fix ui.js syntax error
let uiJs = fs.readFileSync('js/ui.js', 'utf8');

let searchStr = "export function renderIslamicWarning";
let targetIdx = uiJs.indexOf(searchStr);

if (targetIdx !== -1) {
    let beforeText = uiJs.substring(0, targetIdx);
    // find the last `    </div>\n    `;\n}` or `    </div>\r\n    `;\r\n}` or `    </div>\n    `;\n}\n\n`
    let lastClosingIdx = beforeText.lastIndexOf('    </div>');
    if (lastClosingIdx !== -1) {
        let fixedText = beforeText.substring(0, lastClosingIdx) + 
            "    </div>\n    ` : ''}\n    `;\n}\n\n";
            
        uiJs = fixedText + uiJs.substring(targetIdx);
        fs.writeFileSync('js/ui.js', uiJs, 'utf8');
        console.log("ui.js fixed successfully.");
    } else {
        console.log("Could not find lastClosingIdx");
    }
} else {
    console.log("Could not find renderIslamicWarning");
}

// 2. Add Settings Modal to index.html and update header
let html = fs.readFileSync('index.html', 'utf8');

// Replace the current toggle group with a settings icon
let oldHeaderToggles = `                <div style="display:flex; margin-right:10px; border-right: 1px solid var(--g200); padding-right:10px; align-items:center; gap: 10px;">
                    <div class="toggle-group" style="display:flex; border-radius:6px; overflow:hidden; border:1px solid var(--g300);">
                        <button id="btn-islamic-off" style="flex:1; width:125px; padding:8px 8px; background:var(--red); color:white; border:none; cursor:pointer; font-size:14px; font-weight:bold; transition:all 0.3s; text-align:center;" onclick="app.toggleIslamicMode(false); updateIslamicUI(false);">
                            💰 منافع کے ساتھ
                        </button>
                        <button id="btn-islamic-on" style="flex:1; width:125px; padding:8px 8px; background:var(--g100); color:var(--g800); border:none; cursor:pointer; font-size:14px; font-weight:bold; transition:all 0.3s; text-align:center;" onclick="app.toggleIslamicMode(true); updateIslamicUI(true);">
                            🕌 بغیر منافع
                        </button>
                    </div>

                    <div class="toggle-group" id="agreement-mode-group" style="display:flex; border-radius:6px; overflow:hidden; border:1px solid var(--g300);">
                        <button id="btn-agree-1" style="flex:1; width:125px; padding:8px 8px; background:var(--w); color:var(--g800); border:none; cursor:pointer; font-size:14px; font-weight:bold; transition:all 0.3s; text-align:center;" onclick="app.toggleAgreementMode(1); updateAgreementUI(1);">
                            معاہدہ 1 (زمین)
                        </button>
                        <button id="btn-agree-2" style="flex:1; width:125px; padding:8px 8px; background:var(--blu); color:white; border:none; cursor:pointer; font-size:14px; font-weight:bold; transition:all 0.3s; text-align:center;" onclick="app.toggleAgreementMode(2); updateAgreementUI(2);">
                            معاہدہ 2 (انویسٹمنٹ)
                        </button>
                    </div>
                </div>`;
                
let newSettingsBtn = `                <div style="display:flex; margin-right:10px; border-right: 1px solid var(--g200); padding-right:10px; align-items:center;">
                    <button onclick="app.openSettings()" style="background:none; border:none; cursor:pointer; font-size:24px; padding:5px; color:var(--g800); transition:transform 0.3s;" onmouseover="this.style.transform='rotate(45deg)'" onmouseout="this.style.transform='none'" title="ترتیبات (Settings)">
                        ⚙️
                    </button>
                </div>`;

if (html.includes(oldHeaderToggles)) {
    html = html.replace(oldHeaderToggles, newSettingsBtn);
} else {
    // If it has CRLF instead of LF, we can do a generic replace
    let startIdx = html.indexOf('<div style="display:flex; margin-right:10px; border-right: 1px solid var(--g200); padding-right:10px; align-items:center; gap: 10px;">');
    let endIdx = html.indexOf('</div>\r\n                </div>\r\n                <script>', startIdx);
    if(endIdx === -1) endIdx = html.indexOf('</div>\n                </div>\n                <script>', startIdx);
    
    if (startIdx !== -1 && endIdx !== -1) {
        html = html.substring(0, startIdx) + newSettingsBtn + html.substring(endIdx + 12 + 10);
    }
}

// Add the Settings Modal
let settingsModal = `
<!-- Settings Modal -->
<div class="modal" id="settings-modal">
    <div class="modal-content">
        <div class="modal-header">
            <h3>⚙️ ترتیبات (Settings)</h3>
            <span class="modal-close" onclick="app.closeSettings()">✕</span>
        </div>
        <div class="modal-body">
            
            <h4 style="margin-top:0; margin-bottom:10px;">1. شرعی اصول / منافع موڈ</h4>
            <div style="font-size:13px; color:var(--g600); margin-bottom:10px;">اگر بغیر منافع منتخب کریں تو کرائے اور کیش کی بقایا رقم پر منافع (کمپاؤنڈنگ) شامل نہیں کیا جائے گا۔</div>
            <div class="toggle-group" style="display:flex; border-radius:6px; overflow:hidden; border:1px solid var(--g300); margin-bottom:25px;">
                <button id="btn-islamic-off" style="flex:1; padding:10px; background:var(--red); color:white; border:none; cursor:pointer; font-size:15px; font-weight:bold; transition:all 0.3s; text-align:center;" onclick="app.toggleIslamicMode(false); updateIslamicUI(false);">
                    💰 منافع کے ساتھ
                </button>
                <button id="btn-islamic-on" style="flex:1; padding:10px; background:var(--g100); color:var(--g800); border:none; cursor:pointer; font-size:15px; font-weight:bold; transition:all 0.3s; text-align:center;" onclick="app.toggleIslamicMode(true); updateIslamicUI(true);">
                    🕌 بغیر منافع (شرعی)
                </button>
            </div>

            <h4 style="margin-bottom:10px;">2. معاہدے کی قسم</h4>
            <div style="font-size:13px; color:var(--g600); margin-bottom:10px;">آپ ڈیش بورڈ پر کونسا معاہدہ دیکھنا چاہتے ہیں؟ (یہ آپشن کھاتہ کے فائنل حساب کو بھی تبدیل کر دے گا)</div>
            <div class="toggle-group" id="agreement-mode-group" style="display:flex; border-radius:6px; overflow:hidden; border:1px solid var(--g300); margin-bottom:10px;">
                <button id="btn-agree-1" style="flex:1; padding:10px; background:var(--w); color:var(--g800); border:none; cursor:pointer; font-size:15px; font-weight:bold; transition:all 0.3s; text-align:center;" onclick="app.toggleAgreementMode(1); updateAgreementUI(1);">
                    معاہدہ 1 (زمین)
                </button>
                <button id="btn-agree-2" style="flex:1; padding:10px; background:var(--blu); color:white; border:none; cursor:pointer; font-size:15px; font-weight:bold; transition:all 0.3s; text-align:center;" onclick="app.toggleAgreementMode(2); updateAgreementUI(2);">
                    معاہدہ 2 (انویسٹمنٹ)
                </button>
            </div>

        </div>
    </div>
</div>
`;

if (!html.includes('id="settings-modal"')) {
    html = html.replace('<!-- Info Modal -->', settingsModal + '\n<!-- Info Modal -->');
    fs.writeFileSync('index.html', html, 'utf8');
    console.log("Settings modal added to index.html");
}

// 3. Update app.js for Settings Modal
let appJs = fs.readFileSync('js/app.js', 'utf8');
if (!appJs.includes('openSettings')) {
    let newAppJs = appJs.replace(`    showInfo(title, text) {`, `    openSettings() {
        document.getElementById('settings-modal').classList.add('show');
    }

    closeSettings() {
        document.getElementById('settings-modal').classList.remove('show');
    }

    showInfo(title, text) {`);
    fs.writeFileSync('js/app.js', newAppJs, 'utf8');
    console.log("Settings functions added to app.js");
}
