const fs = require('fs');
let uiJs = fs.readFileSync('js/ui.js', 'utf8');

// Dashboard adjustments
let option1Start = `<!-- OPTION 1 SECTION -->`;

if (uiJs.includes(option1Start)) {
    uiJs = uiJs.replace(option1Start, `\${(config.agreementMode === 1) ? \`
    <!-- OPTION 1 SECTION -->`);
    
    // We need to close the template literal right before <!-- OPTION 2 SECTION -->
    let hrSplit = `<br><hr style="border:none;border-top:2px dashed var(--g300);margin:30px 0;"><br>`;
    if (uiJs.includes(hrSplit)) {
        uiJs = uiJs.replace(hrSplit, `\` : ''}
        
    \${(config.agreementMode === 2 || !config.agreementMode) ? \`
    <br><hr style="border:none;border-top:2px dashed var(--g300);margin:30px 0;"><br>`);
        
        // And close after option 2 table container
        let closingPoint = `        <div class="table-expl">
            <p><strong>طریقہ 2 کی مکمل تاریخ اور شرعی اصول:</strong></p>
            <p>\${historyText2}</p>
        </div>
    </div>
    \`;
}`;
        if (uiJs.includes(closingPoint)) {
            uiJs = uiJs.replace(closingPoint, `        <div class="table-expl">
            <p><strong>طریقہ 2 کی مکمل تاریخ اور شرعی اصول:</strong></p>
            <p>\${historyText2}</p>
        </div>
    </div>
    \` : ''}
    \`;
}`);
        } else {
            console.log("Could not find closingPoint");
        }
    } else {
        console.log("Could not find hrSplit");
    }
} else {
    console.log("Could not find option1Start");
}

// Update Cash Profit to depend on mode
let oldCashProfitText = `    const s2 = calc.s2;
    if (!s2 || !s2.individualSettlements) return "<h2>کوئی ڈیٹا نہیں ملا</h2>";`;

let newCashProfitText = `    const s2 = calc.s2;
    if (config.agreementMode === 1) return "<div style='padding:40px; text-align:center;'><h2>معاہدہ 1 میں کیش منافع کا تصور نہیں ہے۔ براہ کرم معاہدہ 2 منتخب کریں۔</h2></div>";
    if (!s2 || !s2.individualSettlements) return "<h2>کوئی ڈیٹا نہیں ملا</h2>";`;
    
if(uiJs.includes(oldCashProfitText)) {
    uiJs = uiJs.replace(oldCashProfitText, newCashProfitText);
}

// Add deductions tile to Dashboard
let tile3 = `        <!-- Tile 3 -->
        <div class="tile t-blue" style="border-bottom:none">
            <div class="t-head">
                <div class="t-ico">🏘️</div>
                <div class="t-lbl">پلاٹ کی کل فروخت <span class="t-info" onclick="app.showInfo('پلاٹ کی فروخت', 'گرین ٹاؤن کا 10 مرلہ پلاٹ کل \${pkr(baseData.plotSale)} میں فروخت ہوا ہے۔ اس میں کزن منیر احمد کا 1/3 حصہ بھی شامل ہے جسے بعد میں الگ کیا جائے گا۔')">ℹ️</span></div>
            </div>
            <div class="t-val">\${pkr(baseData.plotSale)}</div>
            <div class="t-sub" style="text-align:right">PKR \${num(baseData.plotSale)}</div>
        </div>`;

let newTile3 = `        <!-- Tile 3 -->
        <div class="tile t-blue" style="border-bottom:none">
            <div class="t-head">
                <div class="t-ico">🏘️</div>
                <div class="t-lbl">پلاٹ فروخت (خالص) <span class="t-info" onclick="app.showInfo('پلاٹ فروخت کی تفصیل', 'کل فروخت: \${num(config.plot.salePrice2026)}<br>منہا اخراجات و ٹیکس: \${num(config.plot.expenses2026)}<br>شاہد کا بونس: \${num(config.plot.shahidBonus2026)}<br>فیملی ریزرو: \${num(config.plot.collectiveReserve2026)}<br><br><b>خالص فروخت:</b> \${num(config.plot.salePrice2026 - config.plot.expenses2026 - config.plot.shahidBonus2026 - config.plot.collectiveReserve2026)}')">ℹ️</span></div>
            </div>
            <div class="t-val">\${pkr(config.plot.salePrice2026 - config.plot.expenses2026 - config.plot.shahidBonus2026 - config.plot.collectiveReserve2026)}</div>
            <div class="t-sub" style="text-align:right">اخراجات و بونس نکالنے کے بعد</div>
        </div>`;

if(uiJs.includes(tile3)) {
    uiJs = uiJs.replace(tile3, newTile3);
}

fs.writeFileSync('js/ui.js', uiJs, 'utf8');
console.log('ui.js updated for agreement modes and deductions.');
