const fs = require('fs');

const file = 'js/ui.js';
let code = fs.readFileSync(file, 'utf8');

// We need to inject the `tabParam` and update logic.
// Original signature: export function renderKhata(config, ledgers, idParam) {
let newKhata = `
function formatWhoOwesWhom(amount, name) {
    if (amount === 0) return 'کوئی بقایا نہیں';
    if (amount > 0) return \`خادم کے ذمے واجب الادا (\${name} کو دینے ہیں)\`;
    return \`\${name} کے ذمے واجب الادا (خادم کو دینے ہیں)\`;
}

export function renderKhata(config, ledgers, idParam, tabParam) {
    const allMembers = [...config.family.brothers, ...config.family.sisters, config.family.mother];
    
    if(!idParam) {
        let summaryRows = allMembers.map(m => {
            const l = ledgers[m.id] || [];
            let credit = 0;
            let debit = 0;
            
            // For summary, ONLY use cash entries!
            l.forEach(tx => {
                if (tx.type === 'rent') return; // Skip rent
                if(tx.credit) credit += parseInt(String(tx.credit).replace(/,/g, '')) || 0;
                if(tx.debit) debit += parseInt(String(tx.debit).replace(/,/g, '')) || 0;
            });
            
            let finalBalStr = num(credit - debit);
            let finalTypeStr = formatWhoOwesWhom(credit - debit, m.name);
            
            return \`
            <tr style="cursor:pointer; background:var(--w); border-bottom:1px solid var(--g200);" onclick="location.hash='#khata/\${m.id}'" onmouseover="this.style.background='var(--g50)'" onmouseout="this.style.background='var(--w)'">
                <td style="font-weight:bold;color:var(--gd);padding:15px;">\${m.name}</td>
                <td class="ng n" style="padding:15px;">\${num(credit)}</td>
                <td class="nr n" style="padding:15px;">\${num(debit)}</td>
                <td class="nb n" style="font-weight:bold;padding:15px;background:var(--gp);">\${finalBalStr}</td>
                <td style="padding:15px;text-align:center;font-size:13px;color:\${(credit-debit)>0?'var(--gd)':'#dc2626'}">\${finalTypeStr}</td>
                <td style="padding:15px;text-align:left;">
                    <button style="background:var(--gd);color:white;padding:8px 15px;border-radius:6px;font-size:14px;box-shadow:var(--s1)">تفصیل دیکھیں</button>
                </td>
            </tr>
            \`;
        }).join('');

        return \`
        <div style="background:var(--w); padding:20px; border-radius:12px; box-shadow:var(--s1); border:1px solid var(--g200); margin-bottom:25px; text-align:center;">
            <img src="images/TaibaLogoWeb.jpg" style="height:90px; mix-blend-mode:multiply; margin-bottom:15px; border-radius:8px;">
            <h2 style="color:var(--gd); margin-top:0; margin-bottom:10px;">خاندانی کھاتہ — خلاصہ (Summary)</h2>
            <p style="color:var(--g600); margin:0;font-weight:bold;color:var(--gm)">یہ خلاصہ صرف "نقد / کیش" کی لین دین کا ہے۔ کرائے کی تفصیلات کے لیے ممبر پر کلک کریں۔</p>
        </div>
        
        <div class="table-container" style="box-shadow:var(--s2); border:1px solid var(--gd);">
            <h3 style="background:var(--gd); color:white; border:none; padding:15px 20px;">👥 تمام ممبران کا کھاتہ سمری (صرف کیش)</h3>
            <div class="tw">
                <table class="tbl" style="margin:0;">
                    <thead>
                        <tr>
                            <th style="background:var(--g100);color:var(--g800);padding:15px;">ممبر کا نام</th>
                            <th style="background:var(--g100);color:var(--g800);padding:15px;">کل جمع (Credit)</th>
                            <th style="background:var(--g100);color:var(--g800);padding:15px;">کل نام (Debit)</th>
                            <th style="background:var(--g100);color:var(--g800);padding:15px;">کیش بیلنس</th>
                            <th style="background:var(--g100);color:var(--g800);padding:15px;">کون کس کو دے گا؟</th>
                            <th style="background:var(--g100);color:var(--g800);padding:15px;">ایکشن</th>
                        </tr>
                    </thead>
                    <tbody>
                        \${summaryRows}
                    </tbody>
                </table>
            </div>
        </div>
        \`;
    }

    let allLedger = ledgers[idParam] || [];
    let member = allMembers.find(m=>m.id===idParam);
    const name = member ? member.name : idParam;
    
    let activeTab = tabParam || 'cash';
    let ledger = allLedger;
    if (activeTab === 'cash') {
        ledger = allLedger.filter(tx => tx.type !== 'rent');
    }

    let topMenuHTML = \`
        <div style="display:flex; flex-wrap:wrap; gap:10px; margin-bottom:25px; justify-content:center; background:var(--w); padding:15px 20px; border-radius:12px; box-shadow:var(--s1); border:1px solid var(--g200);">
            \${allMembers.map(m => \`
                <a href="#khata/\${m.id}" style="padding:8px 16px; border-radius:20px; text-decoration:none; font-size:15px; transition:all 0.2s; \${m.id === idParam ? 'background:var(--gd); color:var(--w); font-weight:bold; box-shadow:0 4px 10px rgba(27,67,50,0.3); transform:translateY(-2px);' : 'background:var(--g100); color:var(--g800); border:1px solid var(--g300);'}">
                    \${m.name}
                </a>
            \`).join('')}
        </div>
    \`;
    
    let tabButtons = \`
        <div style="display:flex; justify-content:center; margin-bottom:20px; gap:15px;">
            <a href="#khata/\${idParam}/cash" style="padding:10px 30px; font-weight:bold; font-size:16px; border-radius:8px; text-decoration:none; box-shadow:var(--s1); \${activeTab === 'cash' ? 'background:var(--gd);color:white;' : 'background:var(--w);color:var(--g800);border:1px solid var(--g300);'}">صرف کیش لین دین (Default)</a>
            <a href="#khata/\${idParam}/all" style="padding:10px 30px; font-weight:bold; font-size:16px; border-radius:8px; text-decoration:none; box-shadow:var(--s1); \${activeTab === 'all' ? 'background:var(--gd);color:white;' : 'background:var(--w);color:var(--g800);border:1px solid var(--g300);'}">تمام ریکارڈ بمعہ کرایہ (Verification)</a>
        </div>
    \`;

    return \`
    <div>
        \${topMenuHTML}
        
        <div>
            <div style="background:var(--w); padding:20px; border-radius:12px; box-shadow:var(--s1); border:1px solid var(--g200); margin-bottom:20px; text-align:center;">
                <img src="images/TaibaLogoWeb.jpg" style="height:70px; mix-blend-mode:multiply; margin-bottom:10px; border-radius:8px;">
                <h2 style="color:var(--gd); margin-top:0; margin-bottom:5px;">تفصیلی کھاتہ: <span style="color:var(--gm)">\${name}</span></h2>
                <p style="color:var(--g600); margin:0;">پرانے حافظ کھاتہ (HafizKhata) رجسٹر سے لیا گیا مکمل ڈیجیٹل ریکارڈ</p>
            </div>
            
            \${tabButtons}
            
            <div style="margin-bottom:15px;">
                <button onclick="location.hash='#khata'" style="padding:10px 20px; background:var(--w); border:1px solid var(--g300); border-radius:6px; font-weight:bold; color:var(--g800); box-shadow:var(--s1); cursor:pointer;">← سمری پر واپس جائیں</button>
            </div>
            
            <div class="table-container" style="box-shadow:var(--s2); border:1px solid var(--gd);">
                <h3 style="background:var(--gd); color:white; border:none; padding:15px 20px;">📜 لیجر تفصیل (\${activeTab === 'cash' ? 'صرف کیش' : 'مکمل'})</h3>
                <div class="tw">
                    <table class="tbl" style="margin:0;">
                        <thead>
                            <tr>
                                <th style="background:var(--g100);color:var(--g800);padding:15px;width:60px;">نمبر</th>
                                <th style="background:var(--g100);color:var(--g800);padding:15px;width:90px;">قسم</th>
                                <th style="background:var(--g100);color:var(--g800);padding:15px;">تاریخ</th>
                                <th style="background:var(--g100);color:var(--g800);padding:15px;">تفصیل</th>
                                <th style="background:var(--g100);color:var(--g800);padding:15px;">حوالہ (Page)</th>
                                <th style="background:var(--g100);color:var(--g800);padding:15px;">جمع (Credit)</th>
                                <th style="background:var(--g100);color:var(--g800);padding:15px;">نام (Debit)</th>
                                <th style="background:var(--g100);color:var(--g800);padding:15px;">لکھی گئی بقایا</th>
                                <th style="background:var(--g100);color:var(--g800);padding:15px;">متوقع بقایا (Expected)</th>
                            </tr>
                        </thead>
                        <tbody>
                            \${(function() {
                                if(ledger.length === 0) return '<tr><td colspan="9" style="text-align:center;padding:40px;color:var(--g400);font-size:18px;">اس ممبر کا کوئی پرانا کھاتہ ریکارڈ نہیں ملا</td></tr>';
                                
                                let expectedRunningBalance = 0;
                                let totalCredit = 0;
                                let totalDebit = 0;
                                
                                let rowsHtml = ledger.map((l, i) => {
                                    let cr = parseInt(String(l.credit||'').replace(/,/g, '')) || 0;
                                    let dr = parseInt(String(l.debit||'').replace(/,/g, '')) || 0;
                                    totalCredit += cr;
                                    totalDebit += dr;
                                    expectedRunningBalance += (cr - dr);
                                    
                                    let expAbs = Math.abs(expectedRunningBalance);
                                    let expType = expectedRunningBalance === 0 ? '' : (expectedRunningBalance > 0 ? ' (جمع)' : ' (نام)');
                                    let expStr = num(expAbs) + expType;
                                    
                                    let writtenBaqaya = String(l.balance||'').replace(/[^0-9]/g, '');
                                    let writtenNum = parseInt(writtenBaqaya);
                                    let expectedStyle = 'color:var(--g800);';
                                    
                                    // Highlight mismatches only in "all" tab if written balance exists
                                    if (activeTab === 'all' && writtenNum && writtenNum !== expAbs) {
                                        expectedStyle = 'color:#dc2626; font-weight:bold;';
                                    } else if (activeTab === 'all' && writtenNum && writtenNum === expAbs) {
                                        expectedStyle = 'color:#16a34a; font-weight:bold;';
                                    }

                                    return \`
                                        <tr style="background:\${i%2===0 ? 'var(--w)' : 'var(--g50)'}; border-bottom:1px solid var(--g200);">
                                            <td class="n" style="padding:12px 15px; font-weight:bold; color:var(--g500); text-align:center;">\${l.id || i+1}</td>
                                            <td style="padding:12px 15px; text-align:center;">
                                                <span style="font-size:12px; padding:4px 8px; border-radius:12px; font-weight:bold; \${l.type === 'rent' ? 'background:#dcfce7; color:#166534; border:1px solid #bbf7d0;' : 'background:#f1f5f9; color:#475569; border:1px solid #e2e8f0;'}">\${l.type === 'rent' ? 'کرایہ' : 'نقد / دیگر'}</span>
                                            </td>
                                            <td class="n" style="padding:12px 15px; white-space:nowrap; color:var(--g600);">\${l.date}</td>
                                            <td style="padding:12px 15px; line-height:1.6; color:var(--g800);">\${l.description}</td>
                                            <td class="n" style="padding:12px 15px; color:var(--g400); text-align:center;">\${l.page||'-'}</td>
                                            <td class="ng n" style="padding:12px 15px; font-weight:bold;">\${l.credit ? num(String(l.credit).replace(/,/g, '')) : '-'}</td>
                                            <td class="nr n" style="padding:12px 15px;">\${l.debit ? num(String(l.debit).replace(/,/g, '')) : '-'}</td>
                                            <td class="nb n" style="padding:12px 15px; font-weight:bold; background:\${i%2===0 ? 'var(--gp)' : '#c6ebd1'}; border-right:1px solid var(--g200);">\${activeTab === 'all' ? (l.balance||'-') : '-'}</td>
                                            <td class="n" style="padding:12px 15px; \${expectedStyle}">\${expStr}</td>
                                        </tr>
                                    \`;
                                }).join('');

                                let finalAbs = Math.abs(expectedRunningBalance);
                                let finalType = formatWhoOwesWhom(expectedRunningBalance, name);
                                let finalTypeColor = expectedRunningBalance > 0 ? 'var(--gd)' : '#dc2626';
                                
                                let summaryRow = \`
                                    <tr style="background:var(--g100); border-top:2px solid var(--gd);">
                                        <td colspan="5" style="padding:15px; font-weight:bold; text-align:left; color:var(--g800);">کل میزان (Total):</td>
                                        <td class="ng n" style="padding:15px; font-weight:bold; font-size:16px;">\${num(totalCredit)}</td>
                                        <td class="nr n" style="padding:15px; font-weight:bold; font-size:16px;">\${num(totalDebit)}</td>
                                        <td colspan="2" class="n" style="padding:15px; font-weight:bold; text-align:center; color:\${finalTypeColor}; font-size:16px;">
                                            حتمی بیلنس: \${num(finalAbs)} — \${finalType}
                                        </td>
                                    </tr>
                                \`;
                                
                                return rowsHtml + summaryRow;
                            })()}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    \`;
}`;

// Find the start of export function renderKhata
const startIdx = code.indexOf('export function renderKhata');
if (startIdx !== -1) {
    code = code.substring(0, startIdx) + newKhata;
    fs.writeFileSync(file, code);
    console.log("Successfully replaced renderKhata.");
} else {
    console.error("renderKhata not found!");
}
