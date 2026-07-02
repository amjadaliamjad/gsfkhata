const fs = require('fs');

let uiCode = fs.readFileSync('js/ui.js', 'utf8');

if (!uiCode.includes('export function renderAgriculture')) {
    let agricultureCode = `
// ════ AGRICULTURE LEASE VIEW ════
export function renderAgriculture(config, calcDataAll) {
    const num = (x) => new Intl.NumberFormat('en-IN').format(Math.round(x));
    const A = config.agriculture;
    const agri = calcDataAll.agri;

    if (!A || !agri) return '<div style="padding:20px;text-align:center;">زرعی زمین کا ڈیٹا دستیاب نہیں ہے۔</div>';

    let yearRows = '';
    agri.years.forEach(y => {
        yearRows += \`
        <tr>
            <td class="n" style="padding:10px;">\${y.year}</td>
            <td class="n" style="padding:10px;">\${num(y.ratePerAcre)}</td>
            <td class="n" style="padding:10px;">\${num(y.ratePerKanal)}</td>
            <td style="padding:10px;">\${y.cultivators}</td>
        </tr>
        \`;
    });

    let opt1Rows = '';
    agri.years.forEach(y => {
        opt1Rows += \`
        <tr>
            <td class="n" style="padding:10px;">\${y.year}</td>
            <td class="n" style="padding:10px; color:var(--blu);">\${num(y.khadimAmountOpt1)}</td>
            <td style="padding:10px; font-size:14px; color:var(--g600);">\${y.cultivators} کے ذمے</td>
        </tr>
        \`;
    });

    let opt2Rows = '';
    agri.years.forEach(y => {
        opt2Rows += \`
        <tr>
            <td class="n" style="padding:10px;">\${y.year}</td>
            <td class="n" style="padding:10px; color:var(--gm);">\${num(y.khadimAmountOpt2)}</td>
            <td style="padding:10px; font-size:14px; color:var(--g600);">\${y.cultivators} کے ذمے</td>
        </tr>
        \`;
    });

    // We can show a summary of who owes what to Khadim
    let cultivatorsPeriod1 = A.cultivators.period1.brothers.map(b => config.family.brothers.find(br => br.id === b)?.name).join('، ');
    let cultivatorsPeriod2 = A.cultivators.period2.brothers.map(b => config.family.brothers.find(br => br.id === b)?.name).join('، ');

    let amountP1_opt1 = agri.years.filter(y => y.year <= A.cultivators.period1.end).reduce((acc, y) => acc + y.khadimAmountOpt1, 0);
    let amountP2_opt1 = agri.years.filter(y => y.year >= A.cultivators.period2.start).reduce((acc, y) => acc + y.khadimAmountOpt1, 0);
    
    let amountP1_opt2 = agri.years.filter(y => y.year <= A.cultivators.period1.end).reduce((acc, y) => acc + y.khadimAmountOpt2, 0);
    let amountP2_opt2 = agri.years.filter(y => y.year >= A.cultivators.period2.start).reduce((acc, y) => acc + y.khadimAmountOpt2, 0);

    return \`
    <div class="card-ex" style="background:#F0FDF4;border-color:var(--gm)">
        <h2 style="color:var(--gm)">🌾 زرعی زمین کا ٹھیکہ (Agriculture Land Lease)</h2>
        <p>اس صفحے پر کل 7 ایکڑ زرعی زمین کے ٹھیکے کا حساب درج ہے۔ 2016 سے لے کر 2026 تک، چونکہ خادم کی زمین دوسرے بھائیوں (غلام اکبر، عابد حسین، اور عبدالقیوم) نے کاشت کی، اس لیے ان پر خادم کا ٹھیکہ واجب الادا ہے۔</p>
        <p><b>بنیادی ریٹ (2016):</b> \${num(A.baseRatePerAcre2016)} روپے فی ایکڑ | <b>سالانہ اضافہ:</b> \${A.annualIncrementPercent}%</p>
    </div>

    <!-- Annual Rates Table -->
    <div class="table-container" style="margin-bottom:30px;">
        <h3 style="background:var(--blu);color:white;font-size:20px;border:none;">سال بہ سال ٹھیکے کا ریٹ</h3>
        <table class="tbl" style="border-top:1px solid var(--g200)">
            <thead>
                <tr>
                    <th style="background:var(--w);color:var(--g800);">سال</th>
                    <th style="background:var(--w);color:var(--g800);">ریٹ فی ایکڑ</th>
                    <th style="background:var(--w);color:var(--g800);">ریٹ فی کنال</th>
                    <th style="background:var(--w);color:var(--g800);">کاشتکار (کس نے کاشت کی؟)</th>
                </tr>
            </thead>
            <tbody>
                \${yearRows}
            </tbody>
        </table>
    </div>

    <div style="display:flex; gap:20px; flex-wrap:wrap;">
        
        <!-- Option 1 -->
        <div class="table-container" style="flex:1; min-width:300px; margin:0;">
            <h3 style="background:var(--pur);color:white;font-size:18px;border:none;">آپشن 1: خادم کے پاس 6 کنال ایکسٹرا ہیں</h3>
            <div style="padding:15px; background:var(--w); border-bottom:1px solid var(--g200); font-size:14px; color:var(--g700);">
                خادم کی کل زمین = <b>10.9 کنال</b> (4.9 پیدائشی حصہ + 6 خریدا ہوا)
            </div>
            <table class="tbl" style="border-top:1px solid var(--g200)">
                <thead>
                    <tr>
                        <th style="background:var(--w);color:var(--g800);">سال</th>
                        <th style="background:var(--w);color:var(--g800);">خادم کا ٹھیکہ (Rs)</th>
                        <th style="background:var(--w);color:var(--g800);">کس کے ذمے ہے؟</th>
                    </tr>
                </thead>
                <tbody>
                    \${opt1Rows}
                    <tr style="background:var(--pur); color:white; font-weight:bold;">
                        <td style="padding:10px;">کل ٹوٹل</td>
                        <td class="n" style="padding:10px; font-size:18px;">\${num(agri.totalOpt1)}</td>
                        <td>-</td>
                    </tr>
                </tbody>
            </table>
            
            <div style="padding:15px; background:#faf5ff; border:1px solid #e9d5ff; border-radius:6px; margin:15px; margin-top:20px;">
                <h4 style="margin-top:0; color:var(--pur); margin-bottom:10px;">واجب الادا سمری (آپشن 1):</h4>
                <ul style="margin:0; padding-right:20px; font-size:15px;">
                    <li style="margin-bottom:5px;"><b>\${cultivatorsPeriod1} (مشترکہ):</b> \${num(amountP1_opt1)} روپے (2016-2020)</li>
                    <li><b>\${cultivatorsPeriod2}:</b> \${num(amountP2_opt1)} روپے (2021-2026)</li>
                </ul>
            </div>
        </div>

        <!-- Option 2 -->
        <div class="table-container" style="flex:1; min-width:300px; margin:0;">
            <h3 style="background:var(--gm);color:white;font-size:18px;border:none;">آپشن 2: خادم کے پاس ایکسٹرا 6 کنال نہیں ہیں</h3>
            <div style="padding:15px; background:var(--w); border-bottom:1px solid var(--g200); font-size:14px; color:var(--g700);">
                خادم کی کل زمین = <b>4.9 کنال</b> (صرف پیدائشی حصہ)
            </div>
            <table class="tbl" style="border-top:1px solid var(--g200)">
                <thead>
                    <tr>
                        <th style="background:var(--w);color:var(--g800);">سال</th>
                        <th style="background:var(--w);color:var(--g800);">خادم کا ٹھیکہ (Rs)</th>
                        <th style="background:var(--w);color:var(--g800);">کس کے ذمے ہے؟</th>
                    </tr>
                </thead>
                <tbody>
                    \${opt2Rows}
                    <tr style="background:var(--gm); color:white; font-weight:bold;">
                        <td style="padding:10px;">کل ٹوٹل</td>
                        <td class="n" style="padding:10px; font-size:18px;">\${num(agri.totalOpt2)}</td>
                        <td>-</td>
                    </tr>
                </tbody>
            </table>

            <div style="padding:15px; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:6px; margin:15px; margin-top:20px;">
                <h4 style="margin-top:0; color:var(--gm); margin-bottom:10px;">واجب الادا سمری (آپشن 2):</h4>
                <ul style="margin:0; padding-right:20px; font-size:15px;">
                    <li style="margin-bottom:5px;"><b>\${cultivatorsPeriod1} (مشترکہ):</b> \${num(amountP1_opt2)} روپے (2016-2020)</li>
                    <li><b>\${cultivatorsPeriod2}:</b> \${num(amountP2_opt2)} روپے (2021-2026)</li>
                </ul>
            </div>
        </div>

    </div>
    \`;
}
`;
    uiCode += '\n' + agricultureCode;
    fs.writeFileSync('js/ui.js', uiCode);
    console.log('Added renderAgriculture to ui.js');
}
