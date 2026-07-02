const fs = require('fs');

// 1. Update app.js
let appJs = fs.readFileSync('js/app.js', 'utf8');

if (!appJs.includes('toggleAgreementMode')) {
    appJs = appJs.replace(`    toggleIslamicMode(isIslamic) {`, `    toggleAgreementMode(mode) {
        this.agreementMode = mode;
        this.config.agreementMode = mode;
        this.renderView();
    }

    toggleIslamicMode(isIslamic) {`);
    
    appJs = appJs.replace(`        this.config.isIslamic = this.isIslamic; // Ensure it's always set`, `        this.config.isIslamic = this.isIslamic; // Ensure it's always set
        this.config.agreementMode = this.agreementMode || 2; // Default to 2 (Investment)`);
        
    fs.writeFileSync('js/app.js', appJs, 'utf8');
    console.log('Added toggleAgreementMode to app.js');
}

// 2. Update index.html for toggle UI
let html = fs.readFileSync('index.html', 'utf8');

let toggleHtml = `            <div class="header-toggle-container">
                <div class="toggle-group" id="agreement-mode-group">
                    <button id="btn-agree-1" style="padding:6px 10px; background:var(--w); color:var(--g800); border:1px solid var(--g300); border-radius:0 20px 20px 0; cursor:pointer; font-weight:bold; flex:1;" onclick="app.toggleAgreementMode(1)">معاہدہ 1 (زمین)</button>
                    <button id="btn-agree-2" style="padding:6px 10px; background:var(--blu); color:white; border:1px solid var(--blu); border-radius:20px 0 0 20px; cursor:pointer; font-weight:bold; flex:1;" onclick="app.toggleAgreementMode(2)">معاہدہ 2 (انویسٹمنٹ)</button>
                </div>
            </div>`;

if (!html.includes('id="agreement-mode-group"')) {
    html = html.replace(`<div class="header-toggle-container">
                <div class="toggle-group">`, `${toggleHtml}\n            <div class="header-toggle-container">\n                <div class="toggle-group">`);
    fs.writeFileSync('index.html', html, 'utf8');
    console.log('Added agreement toggle to index.html');
}

// 3. Update ui.js to handle toggle UI styles
let uiJs = fs.readFileSync('js/ui.js', 'utf8');

if (!uiJs.includes('updateAgreementUI')) {
    let updateIslamicUI = `function updateIslamicUI(isIslamic) {
    let btnOff = document.getElementById('btn-islamic-off');
    let btnOn = document.getElementById('btn-islamic-on');
    if (btnOff && btnOn) {
        if (isIslamic) {
            btnOff.style.background = 'var(--w)'; btnOff.style.color = 'var(--g800)'; btnOff.style.border = '1px solid var(--g300)';
            btnOn.style.background = 'var(--green)'; btnOn.style.color = 'white'; btnOn.style.border = '1px solid var(--green)';
        } else {
            btnOff.style.background = 'var(--red)'; btnOff.style.color = 'white'; btnOff.style.border = '1px solid var(--red)';
            btnOn.style.background = 'var(--w)'; btnOn.style.color = 'var(--g800)'; btnOn.style.border = '1px solid var(--g300)';
        }
    }
}`;

    let updateAgreementUI = `function updateAgreementUI(mode) {
    let btn1 = document.getElementById('btn-agree-1');
    let btn2 = document.getElementById('btn-agree-2');
    if (btn1 && btn2) {
        if (mode === 1) {
            btn1.style.background = 'var(--pur)'; btn1.style.color = 'white'; btn1.style.border = '1px solid var(--pur)';
            btn2.style.background = 'var(--w)'; btn2.style.color = 'var(--g800)'; btn2.style.border = '1px solid var(--g300)';
        } else {
            btn1.style.background = 'var(--w)'; btn1.style.color = 'var(--g800)'; btn1.style.border = '1px solid var(--g300)';
            btn2.style.background = 'var(--blu)'; btn2.style.color = 'white'; btn2.style.border = '1px solid var(--blu)';
        }
    }
}`;
    
    uiJs = uiJs.replace(updateIslamicUI, updateIslamicUI + '\n\n' + updateAgreementUI);
    
    uiJs = uiJs.replace(`updateIslamicUI(config.isIslamic);`, `updateIslamicUI(config.isIslamic);\n    updateAgreementUI(config.agreementMode || 2);`);
    fs.writeFileSync('js/ui.js', uiJs, 'utf8');
    console.log('Added updateAgreementUI to ui.js');
}
