const fs = require('fs');
let code = fs.readFileSync('js/ui.js', 'utf8');

// 1. Headers
let s1 = '<th style="background:var(--w);color:var(--g800);border-bottom:2px solid var(--gm)">بنیادی حصہ<br>(بغیر منافع)</th>';
let s2 = '</tr>\r\n                </thead>';
if (code.indexOf(s2) === -1) s2 = '</tr>\n                </thead>';

let startIdx = code.indexOf(s1);
let endIdx = code.indexOf(s2, startIdx);

if (startIdx !== -1 && endIdx !== -1) {
    let newHeaders = `<th style="background:var(--w);color:var(--g800);border-bottom:2px solid var(--gm)">حتمی فکسڈ بقایا<br>(D - C)</th>
                        <th style="background:var(--w);color:var(--g800);border-bottom:2px solid var(--gm)">
                            کرائے پر منافع<br>(Capital Gain)
                            <span class="t-info" style="margin-right:5px;font-size:14px" onclick="app.showInfo('کرائے پر منافع کا حساب', 'یہ منافع اس بات پر مبنی ہے کہ جو کرایہ جس سال خادم کے پاس جمع ہوا، اس کی آج (2026) میں کیا قیمت ہے۔<br><br>پلاٹ کی قیمت 2017 سے لے کر آج تک جس رفتار سے بڑھی ہے (تقریباً 18.4 فیصد سالانہ)، کرائے کی رکی ہوئی رقم کو بھی اسی حساب سے ضرب دی گئی ہے۔<br>مثلاً: 2017 کا کرایہ جو آج تک رکا رہا، اس پر 9 سالوں کا منافع لگایا گیا ہے۔')">ℹ️</span>
                        </th>
                        <th style="background:var(--w);color:var(--g800);border-bottom:2px solid var(--gm)">منافع کی شرح</th>
                        <th style="background:var(--w);color:var(--g800);border-bottom:2px solid var(--gm)">نیٹ بقایا وصولی<br>(بقایا + منافع)</th>
                    `;
    code = code.substring(0, startIdx) + newHeaders + code.substring(endIdx);
    console.log("Headers updated");
} else {
    console.log("Headers not found!");
}

// 2. Logic
let s3 = 'let received = m.receivedRent || 0;';
let s4 = 'remaining = rentWithProfit;\n        }';
if (code.indexOf(s4) === -1) s4 = 'remaining = rentWithProfit;\r\n        }';

let idx3 = code.indexOf(s3);
let idx4 = code.indexOf(s4, idx3);

if (idx3 !== -1 && idx4 !== -1) {
    let newLogic = `        let profit = rentWithProfit - baseRent;
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
    code = code.substring(0, idx3) + newLogic + code.substring(idx4 + s4.length);
    console.log("Logic updated");
} else {
    console.log("Logic not found!");
}

// 3. Rows
let s5 = '<td class="n">${num(baseRent)}</td>';
let s6 = '${m.isAdmin ? \'—\' : num(remaining)}</td>';

let idx5 = code.indexOf(s5);
let idx6 = code.indexOf(s6, idx5);

if (idx5 !== -1 && idx6 !== -1) {
    let newRows = `<td class="n">\${m.isAdmin ? '—' : num(finalPayableBase)}</td>
            <td style="color:var(--gm);font-weight:bold;background:var(--gb);">\${profitCellHtml}</td>
            <td class="n" style="color:var(--blu);font-weight:bold;">\${profitRate}%</td>
            <td class="n" style="font-weight:bold;color:\${m.isAdmin?'var(--g800)':'var(--gd)'}; font-size:16px;">\${m.isAdmin ? '—' : num(totalRemaining)}</td>`;
    code = code.substring(0, idx5) + newRows + code.substring(idx6 + s6.length);
    console.log("Rows updated");
} else {
    console.log("Rows not found!");
}

fs.writeFileSync('js/ui.js', code);
