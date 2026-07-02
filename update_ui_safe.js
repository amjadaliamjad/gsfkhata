const fs = require('fs');

const file = 'js/ui.js';
let code = fs.readFileSync(file, 'utf8');

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
            
            l.forEach(tx => {
                if (tx.type === 'rent') return;
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
    
    let infoBox = \`
        <div style="background:var(--g50); padding:15px; border-radius:8px; border-left:4px solid var(--gd); margin-bottom:20px; color:var(--g800); font-size:14px; line-height:1.6;">
            <strong>نوٹ:</strong> ہم نے کھاتہ کو دو حصوں میں تقسیم کیا ہے۔ 
            <ul style="margin-top:5px; margin-bottom:0; padding-right:20px;">
                <li><b style="color:var(--gd)">صرف کیش لین دین:</b> اس ٹیب کا بیلنس اصل کیلکولیشن میں استعمال ہوتا ہے۔</li>
                <li><b style="color:var(--g500)">تمام ریکارڈ بمعہ کرایہ:</b> یہ ٹیب صرف پرانے ہاتھ سے لکھے گئے رجسٹر (Verification) کی تصدیق کے لیے ہے، اس کا ڈیٹا فائنل کیلکولیشن میں براہ راست شامل نہیں ہوتا۔</li>
            </ul>
        </div>
    \`;

    let tabButtons = \`
        <div style="display:flex; justify-content:center; margin-bottom:20px; gap:15px;">
            <a href="#khata/\${idParam}/cash" style="padding:10px 30px; font-weight:bold; font-size:16px; border-radius:8px; text-decoration:none; box-shadow:var(--s1); \${activeTab === 'cash' ? 'background:var(--gd);color:white;' : 'background:var(--w);color:var(--g800);border:1px solid var(--g300);'}">صرف کیش لین دین (Default)</a>
            <a href="#khata/\${idParam}/all" style="padding:10px 30px; font-weight:bold; font-size:16px; border-radius:8px; text-decoration:none; box-shadow:var(--s1); \${activeTab === 'all' ? 'background:var(--g600);color:white;' : 'background:var(--w);color:var(--g800);border:1px solid var(--g300);'}">تمام ریکارڈ بمعہ کرایہ (Verification)</a>
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
            
            \${infoBox}
            \${tabButtons}
            
            <div style="margin-bottom:15px;">
                <button onclick="location.hash='#khata'" style="padding:10px 20px; background:var(--w); border:1px solid var(--g300); border-radius:6px; font-weight:bold; color:var(--g800); box-shadow:var(--s1); cursor:pointer;">← سمری پر واپس جائیں</button>
            </div>
            
            <div class="table-container" style="box-shadow:var(--s2); border:1px solid var(--gd);">
                <h3 style="background:\${activeTab === 'cash' ? 'var(--gd)' : 'var(--g600)'}; color:white; border:none; padding:15px 20px;">📜 لیجر تفصیل (\${activeTab === 'cash' ? 'صرف کیش' : 'مکمل'})</h3>
                <div class="tw" style="\${activeTab === 'all' ? 'background:var(--g50); opacity:0.9;' : ''}">
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
                                if(ledger.length === 0) return '<tr><td colspan="9" style="text-align:center;padding:40px;color:var(--g400);font-size:18px;">اس ممبر کا کوئی ریکارڈ نہیں ملا</td></tr>';
                                
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
}

export function renderCashProfit(config, calc) {
    const s2 = calc.s2;
    if (!s2 || !s2.individualSettlements) return "<h2>کوئی ڈیٹا نہیں ملا</h2>";
    
    // Make summary rows for top of the page
    let topSummaryRows = s2.individualSettlements.filter(m => m.netCashBase !== 0 && !m.name.includes('خادم')).map(m => {
        let finalStr = formatWhoOwesWhom(m.netCashWithProfit, m.name);
        let color = m.netCashWithProfit > 0 ? 'var(--gd)' : '#dc2626';
        return \`
        <tr style="background:var(--w); border-bottom:1px solid var(--g200);">
            <td style="padding:15px; font-weight:bold; color:var(--g800);">\${m.name}</td>
            <td class="n" style="padding:15px; color:\${m.netCashBase > 0 ? 'var(--gd)' : '#dc2626'}">\${num(m.netCashBase)}</td>
            <td class="n" style="padding:15px; color:\${color}; font-weight:bold;">\${num(m.netCashWithProfit)}</td>
            <td style="padding:15px; color:\${color}; font-size:14px;">\${finalStr}</td>
            <td style="padding:15px;text-align:center;"><a href="#khata/\${m.id}" style="color:var(--pur); text-decoration:underline;">لیجر دیکھیں</a></td>
        </tr>
        \`;
    }).join('');

    let rowsHTML = s2.individualSettlements.map(m => {
        if (m.cashTransactions.length === 0 || m.name.includes('خادم')) return '';
        
        let txRows = m.cashTransactions.map(tx => {
            let amountStr = num(tx.baseAmount);
            let profitStr = num(tx.profitAmount);
            let totalStr = num(tx.totalWithProfit);
            let typeColor = tx.baseAmount > 0 ? 'var(--gd)' : '#dc2626';
            let yearStr = tx.extractedYear >= 2017 ? tx.extractedYear : (tx.extractedYear ? tx.extractedYear + ' (منافع لاگو نہیں)' : 'نامعلوم تاریخ (منافع لاگو نہیں)');
            let multStr = tx.multiplier > 1 ? tx.multiplier.toFixed(2) : '-';
            
            return \`
            <tr style="background:var(--w); border-bottom:1px solid var(--g200);">
                <td style="padding:10px;">\${tx.date}</td>
                <td style="padding:10px;">\${tx.description}</td>
                <td class="n" style="padding:10px; color:\${typeColor}; font-weight:bold;">\${amountStr}</td>
                <td class="n" style="padding:10px;">\${yearStr}</td>
                <td class="n" style="padding:10px; color:var(--pur);">x \${multStr}</td>
                <td class="n" style="padding:10px; color:var(--gold);">\${profitStr}</td>
                <td class="n" style="padding:10px; font-weight:bold; color:var(--gm);">\${totalStr}</td>
            </tr>\`;
        }).join('');
        
        let headerColor = m.netCashBase > 0 ? 'var(--gd)' : '#dc2626';
        let summaryText = formatWhoOwesWhom(m.netCashWithProfit, m.name);
        
        return \`
        <div class="table-container" style="box-shadow:var(--s2); border:1px solid \${headerColor}; margin-bottom:30px;">
            <h3 style="background:\${headerColor}; color:white; border:none; padding:15px 20px;">👤 \${m.name} اور حافظ خادم حسین کے درمیان کیش کا منافع</h3>
            <div style="background:var(--w); padding:10px 20px; font-size:14px; color:var(--g600); border-bottom:1px solid var(--g200);">
                <strong>نوٹ:</strong> یہ ٹیبل خادم حسین کی کیش لین دین کا منافع ظاہر کرتا ہے۔ مائنس (-) کا مطلب ہے کہ \${m.name} نے خادم سے پیسے لیے اور انہیں منافع سمیت واپس کرنے ہیں۔
            </div>
            <div class="tw">
                <table class="tbl" style="margin:0;">
                    <thead>
                        <tr>
                            <th style="background:var(--g100);color:var(--g800);">تاریخ</th>
                            <th style="background:var(--g100);color:var(--g800);">تفصیل</th>
                            <th style="background:var(--g100);color:var(--g800);">اصل رقم</th>
                            <th style="background:var(--g100);color:var(--g800);">سال</th>
                            <th style="background:var(--g100);color:var(--g800);">گین (Multiplier)</th>
                            <th style="background:var(--g100);color:var(--g800);">منافع کی رقم</th>
                            <th style="background:var(--g100);color:var(--g800);">کل رقم 2026 تک</th>
                        </tr>
                    </thead>
                    <tbody>
                        \${txRows}
                    </tbody>
                    <tfoot>
                        <tr style="background:var(--g50);">
                            <td colspan="2" style="padding:15px; font-weight:bold;">خالص کیش (بغیر منافع): <span class="n" style="color:\${headerColor}">\${num(Math.abs(m.netCashBase))}</span></td>
                            <td colspan="5" style="padding:15px; font-weight:bold; text-align:left; color:\${headerColor};">
                                فائنل کیش (مع منافع): \${num(Math.abs(m.netCashWithProfit))} — \${summaryText}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>\`;
    }).join('');

    return \`
    <div>
        <div style="background:var(--w); padding:20px; border-radius:12px; box-shadow:var(--s1); border:1px solid var(--g200); margin-bottom:25px; text-align:center;">
            <img src="images/TaibaLogoWeb.jpg" style="height:90px; mix-blend-mode:multiply; margin-bottom:15px; border-radius:8px;">
            <h2 style="color:var(--gd); margin-top:0; margin-bottom:10px;">💸 حافظ کیش منافع (Cash Profit Details)</h2>
            <p style="color:var(--g600); margin:0;">جن ممبران نے 2017 کے بعد خادم حسین سے کیش لیا یا دیا، ان پر پلاٹ کی شرح (18.4%) سے منافع لگایا گیا ہے۔ <br> <b>نامعلوم تاریخ یا 2017 سے پرانی تاریخ والے ریکارڈ پر منافع نہیں لگایا گیا۔</b></p>
        </div>

        <div class="table-container" style="box-shadow:var(--s2); border:1px solid var(--gd); margin-bottom:30px;">
            <h3 style="background:var(--gd); color:white; border:none; padding:15px 20px;">👥 کیش منافع خلاصہ (Summary)</h3>
            <div class="tw">
                <table class="tbl" style="margin:0;">
                    <thead>
                        <tr>
                            <th style="background:var(--g100);color:var(--g800);">ممبر کا نام</th>
                            <th style="background:var(--g100);color:var(--g800);">اصل خالص رقم (بغیر منافع)</th>
                            <th style="background:var(--g100);color:var(--g800);">منافع کے ساتھ فائنل رقم</th>
                            <th style="background:var(--g100);color:var(--g800);">کون کس کو دے گا؟</th>
                            <th style="background:var(--g100);color:var(--g800);">لیجر دیکھیں</th>
                        </tr>
                    </thead>
                    <tbody>
                        \${topSummaryRows}
                    </tbody>
                </table>
            </div>
        </div>

        \${rowsHTML}
    </div>
    \`;
}

export function renderExplanation(config, calc) {
    const P = config.plot;
    const cagrPercent = (calc.s2.cagr * 100).toFixed(2);
    
    let indivSettlementRows = calc.s2.individualSettlements.map(m => {
        let cashText = formatWhoOwesWhom(m.netCashWithProfit, m.name);
        return \`
        <tr style="background:var(--w); border-bottom:1px solid var(--g200);">
            <td style="padding:15px; font-weight:bold; color:var(--g800);">\${m.name}</td>
            <td class="n" style="padding:15px; color:var(--pur);">\${num(m.basePlot)}</td>
            <td class="n" style="padding:15px; color:var(--gd);">\${num(m.rentWithProfit)}</td>
            <td class="n" style="padding:15px; color:\${m.netCashWithProfit > 0 ? 'var(--gd)' : '#dc2626'};">\${num(m.netCashWithProfit)}<br><span style="font-size:12px;">\${cashText}</span></td>
            <td class="nb n" style="padding:15px; font-weight:bold; font-size:16px;">\${num(m.finalReceivable)}</td>
        </tr>
        \`;
    }).join('');

    return \`
    <div>
        <div style="background:var(--w); padding:20px; border-radius:12px; box-shadow:var(--s1); border:1px solid var(--g200); margin-bottom:25px; text-align:center;">
            <img src="images/TaibaLogoWeb.jpg" style="height:90px; mix-blend-mode:multiply; margin-bottom:15px; border-radius:8px;">
            <h2 style="color:var(--gd); margin-top:0; margin-bottom:10px;">📖 طریقہ کار کی وضاحت (Calculations Summary)</h2>
            <p style="color:var(--g600); margin:0;">یہ صفحہ وضاحت کرتا ہے کہ منافع کیسے لگایا گیا اور حصص کیسے تقسیم کیے گئے۔</p>
        </div>

        <div class="table-container" style="box-shadow:var(--s2); border:1px solid var(--pur); margin-bottom:30px;">
            <h3 style="background:var(--pur); color:white; border:none; padding:15px 20px;">1. منافع کی شرح (Profit Margin) کیسے نکالی گئی؟</h3>
            <div style="padding:20px; background:var(--w); line-height:1.8; color:var(--g800); font-size:15px;">
                <p>2017 میں کزن نے اپنا پلاٹ کا حصہ <b>\${num(P.cousinSharePrice2017)}</b> میں بیچا (جس کی کل مالیت <b>\${num(P.cousinDemandPrice2017)}</b> بنتی تھی)۔</p>
                <p>2026 میں پلاٹ <b>\${num(P.salePrice2026)}</b> میں فروخت ہوا۔</p>
                <p>پلاٹ کی قیمت \${num(P.cousinDemandPrice2017)} سے بڑھ کر \${num(P.salePrice2026)} ہو گئی۔ 9 سالوں میں یہ کل <b>\${calc.s2.growthMultiplier.toFixed(2)} گنا (Multiplier)</b> کا اضافہ ہے۔</p>
                <div style="background:var(--g50); padding:15px; border-radius:8px; border:1px solid var(--g200); margin:15px 0;">
                    <b>Compound Annual Growth Rate (CAGR) فارمولہ:</b><br>
                    <code style="color:var(--pur);">(\${num(P.salePrice2026)} ÷ \${num(P.cousinDemandPrice2017)}) ^ (1 ÷ 9) - 1</code> = <b style="color:var(--gm);">\${cagrPercent}% سالانہ منافع</b>
                </div>
                <p>اس <b>\${cagrPercent}%</b> سالانہ منافع کو 2017 سے لے کر آج تک کے ہر کرائے اور کیش کی لین دین پر لگایا گیا ہے۔</p>
            </div>
        </div>

        <div class="table-container" style="box-shadow:var(--s2); border:1px solid var(--gold); margin-bottom:30px;">
            <h3 style="background:var(--gold); color:var(--g800); border:none; padding:15px 20px;">2. انفرادی حساب اور فائنل سیٹلمنٹ</h3>
            <div style="padding:20px; background:var(--w); line-height:1.8; color:var(--g800); font-size:15px;">
                <p>ہر ممبر کا فائنل حصہ انفرادی طور پر درج ذیل فارمولے سے نکالا گیا ہے تاکہ کسی ایک ممبر کی کیش لینے کی وجہ سے دوسرے ممبر کا حصہ متاثر نہ ہو:</p>
                <div style="background:var(--g50); padding:15px; border-radius:8px; border:1px solid var(--g200); margin:15px 0; font-weight:bold; color:var(--gd); font-size:16px; text-align:center;">
                    پلاٹ کا بنیادی حصہ + (کرایہ مع منافع) + (کیش کا لین دین مع منافع) = فائنل واجب الادا رقم
                </div>
            </div>
            <div class="tw">
                <table class="tbl" style="margin:0;">
                    <thead>
                        <tr>
                            <th style="background:var(--g100);color:var(--g800);">ممبر</th>
                            <th style="background:var(--g100);color:var(--g800);">پلاٹ کا بنیادی حصہ</th>
                            <th style="background:var(--g100);color:var(--g800);">کرایہ مع منافع</th>
                            <th style="background:var(--g100);color:var(--g800);">کیش کی لین دین مع منافع</th>
                            <th style="background:var(--g100);color:var(--g800);">پلاٹ 1149-1-D2 سے حاصل ہونے والا خالص منافع جو انجینئر ٹاؤن کے 2 کنال کے مشترکہ پلاٹ کی سرمایہ کاری میں شامل کیا جائے گا</th>
                        </tr>
                    </thead>
                    <tbody>
                        \${indivSettlementRows}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    \`;
}
`;

const startIdx = code.indexOf('export function renderKhata');
const endIdx = code.indexOf('export function renderAgriculture');

if (startIdx !== -1 && endIdx !== -1) {
    code = code.substring(0, startIdx) + newKhata + '\n' + code.substring(endIdx);
    fs.writeFileSync(file, code);
    console.log("Successfully replaced renderKhata without removing renderAgriculture.");
} else {
    console.error("Boundaries not found!");
}
