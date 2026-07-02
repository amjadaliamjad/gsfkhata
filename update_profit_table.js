const fs = require('fs');
let code = fs.readFileSync('js/ui.js', 'utf8');

// 1. Replace the headers
const oldHeaders = `                        <th style="background:var(--w);color:var(--g800);border-bottom:2px solid var(--gm)">#</th>
                        <th style="background:var(--w);color:var(--g800);border-bottom:2px solid var(--gm)">ممبر کا نام</th>
                        <th style="background:var(--w);color:var(--g800);border-bottom:2px solid var(--gm)">بنیادی حصہ<br>(بغیر منافع)</th>
                        <th style="background:var(--w);color:var(--g800);border-bottom:2px solid var(--gm)">
                            کرائے پر منافع<br>(Capital Gain)
                            <span class="t-info" style="margin-right:5px;font-size:14px" onclick="app.showInfo('کرائے پر منافع کا حساب', 'یہ منافع اس بات پر مبنی ہے کہ جو کرایہ جس سال خادم کے پاس جمع ہوا، اس کی آج (2026) میں کیا قیمت ہے۔<br><br>پلاٹ کی قیمت 2017 سے لے کر آج تک جس رفتار سے بڑھی ہے (تقریباً 18.4 فیصد سالانہ)، کرائے کی رکی ہوئی رقم کو بھی اسی حساب سے ضرب دی گئی ہے۔<br>مثلاً: 2017 کا کرایہ جو آج تک رکا رہا، اس پر 9 سالوں کا منافع لگایا گیا ہے۔')">ℹ️</span>
                        </th>
                        <th style="background:var(--w);color:var(--g800);border-bottom:2px solid var(--gm)">منافع کی شرح</th>
                        <th style="background:var(--w);color:var(--g800);border-bottom:2px solid var(--gm)">کل کرایہ حصہ<br>(منافع کیساتھ)</th>
                        <th style="background:var(--w);color:var(--g800);border-bottom:2px solid var(--gm)">پہلے سے وصول شدہ</th>
                        <th style="background:var(--w);color:var(--g800);border-bottom:2px solid var(--gm)">نیٹ بقایا وصولی</th>
                    </tr>`;

const newHeaders = `                        <th style="background:var(--w);color:var(--g800);border-bottom:2px solid var(--gm)">#</th>
                        <th style="background:var(--w);color:var(--g800);border-bottom:2px solid var(--gm)">ممبر کا نام</th>
                        <th style="background:var(--w);color:var(--g800);border-bottom:2px solid var(--gm)">حتمی فکسڈ بقایا<br>(D - C)</th>
                        <th style="background:var(--w);color:var(--g800);border-bottom:2px solid var(--gm)">
                            کرائے پر منافع<br>(Capital Gain)
                            <span class="t-info" style="margin-right:5px;font-size:14px" onclick="app.showInfo('کرائے پر منافع کا حساب', 'یہ منافع اس بات پر مبنی ہے کہ جو کرایہ جس سال خادم کے پاس جمع ہوا، اس کی آج (2026) میں کیا قیمت ہے۔<br><br>پلاٹ کی قیمت 2017 سے لے کر آج تک جس رفتار سے بڑھی ہے (تقریباً 18.4 فیصد سالانہ)، کرائے کی رکی ہوئی رقم کو بھی اسی حساب سے ضرب دی گئی ہے۔<br>مثلاً: 2017 کا کرایہ جو آج تک رکا رہا، اس پر 9 سالوں کا منافع لگایا گیا ہے۔')">ℹ️</span>
                        </th>
                        <th style="background:var(--w);color:var(--g800);border-bottom:2px solid var(--gm)">منافع کی شرح</th>
                        <th style="background:var(--w);color:var(--g800);border-bottom:2px solid var(--gm)">نیٹ بقایا وصولی<br>(بقایا + منافع)</th>
                    </tr>`;

code = code.replace(oldHeaders, newHeaders);

// 2. Replace the logic
const oldLogic = `        let received = m.receivedRent || 0;
        let profit = rentWithProfit - baseRent;
        let profitRate = baseRent > 0 ? ((profit / baseRent) * 100).toFixed(1) : 0;
        
        let remaining = rentWithProfit - received;
        if (m.isAdmin) {
            received = 0; 
            remaining = rentWithProfit;
        }`;

const newLogic = `        let profit = rentWithProfit - baseRent;
        let profitRate = baseRent > 0 ? ((profit / baseRent) * 100).toFixed(1) : 0;
        
        let ledger = ledgers[m.id] || [];
        let tDebit=0, tCredit=0, rDebit=0, rCredit=0;
        ledger.forEach(tx => {
            let d = parseInt(String(tx.debit||'').replace(/,/g, '')) || 0;
            let c = parseInt(String(tx.credit||'').replace(/,/g, '')) || 0;
            tDebit += d; tCredit += c;
            if (tx.type === 'rent') { rDebit += d; rCredit += c; }
        });
        
        let durust = tCredit - tDebit;
        let rentJuma = rCredit - rDebit;
        let cashWithdrawn = rentJuma - durust;
        
        let finalPayableBase = baseRent - cashWithdrawn;
        let totalRemaining = finalPayableBase + profit;
        
        if (m.isAdmin) {
            finalPayableBase = 0;
            totalRemaining = 0;
        }`;

code = code.replace(oldLogic, newLogic);

// 3. Replace the row columns
const oldColumns = `            <td class="n">\${num(baseRent)}</td>
            <td style="color:var(--gm);font-weight:bold;background:var(--gb);">\${profitCellHtml}</td>
            <td class="n" style="color:var(--blu);font-weight:bold;">\${profitRate}%</td>
            <td class="n">\${num(rentWithProfit)}</td>
            <td class="n">\${m.isAdmin ? '—' : num(received)}</td>
            <td class="n" style="font-weight:bold;color:\${m.isAdmin?'var(--g800)':'var(--gd)'}">\${m.isAdmin ? '—' : num(remaining)}</td>`;

const newColumns = `            <td class="n">\${m.isAdmin ? '—' : num(finalPayableBase)}</td>
            <td style="color:var(--gm);font-weight:bold;background:var(--gb);">\${profitCellHtml}</td>
            <td class="n" style="color:var(--blu);font-weight:bold;">\${profitRate}%</td>
            <td class="n" style="font-weight:bold;color:\${m.isAdmin?'var(--g800)':'var(--gd)'}; font-size:16px;">\${m.isAdmin ? '—' : num(totalRemaining)}</td>`;

code = code.replace(oldColumns, newColumns);

fs.writeFileSync('js/ui.js', code);
console.log("Successfully updated ui.js!");
