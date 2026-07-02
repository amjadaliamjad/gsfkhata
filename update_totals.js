const fs = require('fs');
let code = fs.readFileSync('js/ui.js', 'utf8');

// 1. Update Table 1 Sums
const oldMapStart1 = "${allMembers.map((m, i) => {";
const oldMapEnd1 = "}).join('')}";
let startIdx1 = code.indexOf(oldMapStart1);
if (startIdx1 !== -1) {
    // Need to find the FIRST closing `}).join('')}` after startIdx1
    let endIdx1 = code.indexOf(oldMapEnd1, startIdx1);
    let originalBlock = code.substring(startIdx1, endIdx1 + oldMapEnd1.length);
    
    // We transform it into an IIFE with sums
    let newBlock = `\${(() => {
        let sumA = 0, sumB = 0, sumC = 0, sumD = 0, sumFinal = 0;
        let rows = allMembers.map((m, i) => {
            let ledger = ledgers[m.id] || [];
            let tDebit=0, tCredit=0, rDebit=0, rCredit=0;
            ledger.forEach(tx => {
                let d = parseInt(String(tx.debit||'').replace(/,/g, '')) || 0;
                let c = parseInt(String(tx.credit||'').replace(/,/g, '')) || 0;
                tDebit += d; tCredit += c;
                if (tx.type === 'rent') { rDebit += d; rCredit += c; }
            });
            
            let durust = tCredit - tDebit; // A
            let rentJuma = rCredit - rDebit; // B
            let cashWithdrawn = rentJuma - durust; // C = B - A
            
            let isMother = m.id === 'mother';
            let isSister = m.id.startsWith('sister');
            let newRent = isMother ? s1.mother.rent : (isSister ? s1.sisters.rent : s1.brotherBase.rent); // D
            if (m.isAdmin) newRent = 0;
            
            let finalPayable = newRent - cashWithdrawn; // D - C
            
            sumA += durust;
            sumB += rentJuma;
            sumC += cashWithdrawn;
            sumD += newRent;
            sumFinal += finalPayable;
            
            return \`
            <tr style="background:\${i%2===0 ? '#fff' : '#f8fafc'}; border-bottom:1px solid #e2e8f0;">
                <td style="padding:12px;font-weight:bold;">\${i+1}. \${m.name}</td>
                <td class="n" style="padding:12px;">\${num(durust)}</td>
                <td class="n" style="padding:12px;color:#b91c1c;cursor:pointer;background:#FEF2F2;" onclick="app.showInfo('\${m.name} - کرایہ ریکارڈ', window.generateLedgerTable('\${m.id}', 'rent'))">
                    \${num(rentJuma)}
                </td>
                <td class="n" style="padding:12px;color:#854d0e;font-weight:bold;cursor:pointer;background:#FEFCE8;" onclick="app.showInfo('\${m.name} - نقد لین دین', window.generateLedgerTable('\${m.id}', 'cash'))">
                    \${num(cashWithdrawn)} \${cashWithdrawn < 0 ? '<br><span style="font-size:11px;font-weight:normal;color:#16a34a">(خادم سے نقد جمع کروایا)</span>' : ''}
                </td>
                <td class="n" style="padding:12px;color:#16a34a;">\${num(newRent)}</td>
                <td class="n" style="padding:12px;color:#3730a3;font-size:18px;font-weight:bold;background:#e0e7ff;">\${num(finalPayable)}</td>
            </tr>
            \`;
        }).join('');
        
        return rows + \`
            <tr style="background:var(--gd); color:white; font-size:16px; font-weight:bold;">
                <td style="padding:12px; text-align:right;">کل مجموعہ</td>
                <td class="n" style="padding:12px;">\${num(sumA)}</td>
                <td class="n" style="padding:12px;">\${num(sumB)}</td>
                <td class="n" style="padding:12px;">\${num(sumC)}</td>
                <td class="n" style="padding:12px;">\${num(sumD)}</td>
                <td class="n" style="padding:12px; font-size:18px;">\${num(sumFinal)}</td>
            </tr>
        \`;
    })()}`;
    
    code = code.replace(originalBlock, newBlock);
}

// 2. Update Table 2 Sums
// Table 2 (Profit Distribution) builds `memberRows` in a top-level loop before returning the template.
// So we can just add sum variables at the top.
const loopStartStr = `    let memberRows = '';

    allMembers.forEach((m, idx) => {`;

const newLoopStartStr = `    let memberRows = '';
    let sumBaseAdjusted = 0, sumProfit = 0, sumTotalRemaining = 0;

    allMembers.forEach((m, idx) => {`;
code = code.replace(loopStartStr, newLoopStartStr);

const loopEndStr = `            <td class="n" style="font-weight:bold;color:\${m.isAdmin?'var(--g800)':'var(--gd)'}; font-size:16px;">\${m.isAdmin ? '—' : num(totalRemaining)}</td>
        </tr>
        \`;
    });`;

const newLoopEndStr = `            <td class="n" style="font-weight:bold;color:\${m.isAdmin?'var(--g800)':'var(--gd)'}; font-size:16px;">\${m.isAdmin ? '—' : num(totalRemaining)}</td>
        </tr>
        \`;
        
        sumBaseAdjusted += (m.isAdmin ? 0 : finalPayableBase);
        sumProfit += profit;
        sumTotalRemaining += (m.isAdmin ? 0 : totalRemaining);
    });
    
    memberRows += \`
        <tr style="background:var(--gd); color:white; font-size:16px; font-weight:bold;">
            <td colspan="2" style="padding:12px; text-align:right;">کل مجموعہ</td>
            <td class="n" style="padding:12px;">\${num(sumBaseAdjusted)}</td>
            <td class="n" style="padding:12px;">\${num(sumProfit)}</td>
            <td class="n" style="padding:12px;">-</td>
            <td class="n" style="padding:12px; font-size:18px;">\${num(sumTotalRemaining)}</td>
        </tr>
    \`;`;
code = code.replace(loopEndStr, newLoopEndStr);

// 3. Update Table 2 Header Description
const oldDescStr = `<h3 style="background:var(--gm);color:white;justify-content:center;font-size:22px;border:none;">خاندانی ممبران کے کرائے کی تفصیل (کرایہ وصولی اور منافع)</h3>`;
const newDescStr = `<h3 style="background:var(--gm);color:white;justify-content:center;font-size:22px;border:none;">خاندانی ممبران کے کرائے کی تفصیل (کرایہ وصولی اور منافع)</h3>
        <div style="background-color: #f8fafc; padding: 15px 20px; border-bottom: 1px solid #cbd5e1; font-size: 15px; line-height: 1.8; color: #334155;">
            <strong style="font-size:17px; color:var(--gm);">📌 اس ٹیبل کا مقصد کیا ہے اور یہ کیسے کام کرتا ہے؟</strong><br />
            <p style="margin-top: 10px; margin-bottom: 5px; text-align: justify;">
                یہ کھاتے کا <b>حتمی اور آخری ٹیبل</b> ہے جس میں تمام ممبران کے <b>حتمی فکسڈ بقایا</b> (جو پچھلے ٹیبل میں سے نکلا ہے) میں ان کا <b>جائز منافع (Capital Gain)</b> شامل کر کے فائنل ادائیگی کی رقم بتائی گئی ہے۔
            </p>
            <ul style="margin-top: 5px; margin-bottom: 0; padding-right:20px;">
                <li><b>حتمی فکسڈ بقایا (D - C):</b> یہ آپ کا اصل بقایا ہے جس میں سے آپ کے نکالے گئے پیسے پہلے ہی کاٹے جا چکے ہیں۔</li>
                <li><b>کرائے پر منافع (Capital Gain):</b> چونکہ خادم کے پاس رکا ہوا کرایہ پلاٹ میں ہی انویسٹڈ رہا، اس لیے کرائے پر اسی شرح سے منافع لگایا گیا ہے جس شرح سے پلاٹ کی قیمت میں اضافہ ہوا۔</li>
                <li><b>نیٹ بقایا وصولی:</b> یہ وہ فائنل رقم ہے جو خادم کی طرف سے خاندان کے ہر ممبر کو ادا کی جائے گی۔</li>
            </ul>
        </div>`;
code = code.replace(oldDescStr, newDescStr);

fs.writeFileSync('js/ui.js', code);
console.log("Success");
