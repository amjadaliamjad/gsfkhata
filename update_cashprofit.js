const fs = require('fs');

const file = 'js/ui.js';
let code = fs.readFileSync(file, 'utf8');

let newFunc = `export function renderCashProfit(config, calc) {
    const s2 = calc.s2;
    if (!s2 || !s2.individualSettlements) return "<h2>کوئی ڈیٹا نہیں ملا</h2>";
    
    let totalBase = 0;
    let totalWithProfit = 0;

    let topSummaryRows = s2.individualSettlements.filter(m => m.netCashBase !== 0 && !m.name.includes('خادم')).map(m => {
        totalBase += m.netCashBase;
        totalWithProfit += m.netCashWithProfit;
        
        let finalStr = formatWhoOwesWhom(m.netCashWithProfit, m.name);
        let color = m.netCashWithProfit > 0 ? 'var(--gd)' : '#dc2626';
        return \`
        <tr style="background:var(--w); border-bottom:1px solid var(--g200);">
            <td style="padding:15px; font-weight:bold; color:var(--g800);">\${m.name}</td>
            <td class="n" style="padding:15px; color:\${m.netCashBase > 0 ? 'var(--gd)' : '#dc2626'}">\${num(Math.abs(m.netCashBase))}</td>
            <td class="n" style="padding:15px; color:\${color}; font-weight:bold;">\${num(Math.abs(m.netCashWithProfit))}</td>
            <td style="padding:15px; color:\${color}; font-size:14px;">\${finalStr}</td>
            <td style="padding:15px;text-align:center;"><a href="#khata/\${m.id}" style="color:var(--pur); text-decoration:underline;">لیجر دیکھیں</a></td>
        </tr>
        \`;
    }).join('');

    let grandTotalStr = formatWhoOwesWhom(totalWithProfit, 'مجموعی طور پر تمام ممبران');
    let grandTotalColor = totalWithProfit > 0 ? 'var(--gd)' : '#dc2626';

    let rowsHTML = s2.individualSettlements.map(m => {
        if (m.cashTransactions.length === 0 || m.name.includes('خادم')) return '';
        
        let txRows = m.cashTransactions.map(tx => {
            let amountStr = num(Math.abs(tx.baseAmount));
            let profitStr = num(Math.abs(tx.profitAmount));
            let totalStr = num(Math.abs(tx.totalWithProfit));
            let typeColor = tx.baseAmount > 0 ? 'var(--gd)' : '#dc2626';
            let txDetail = tx.baseAmount > 0 ? 'خادم کے ذمے' : 'خادم کو دینے ہیں';
            
            let hasYear = tx.date && tx.date.match(/\\d{4}/);
            let yearStr = hasYear ? tx.extractedYear : 'نامعلوم تاریخ (2017 سے منافع)';
            if (tx.extractedYear < 2017 && hasYear) yearStr += ' (منافع لاگو نہیں)';
            let multStr = tx.multiplier > 1 ? tx.multiplier.toFixed(2) : '-';
            
            return \`
            <tr style="background:var(--w); border-bottom:1px solid var(--g200);">
                <td style="padding:10px;">\${tx.date}</td>
                <td style="padding:10px;">\${tx.description}</td>
                <td class="n" style="padding:10px; color:\${typeColor}; font-weight:bold;">\${amountStr}<br><span style="font-size:12px; font-weight:normal;">\${txDetail}</span></td>
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
            <h3 style="background:\${headerColor}; color:white; border:none; padding:15px 20px;">👤 \${m.name} اور حافظ خادم حسین کے درمیان لین دین کا بیلنس اور اس پر منافع</h3>
            <div style="background:var(--w); padding:10px 20px; font-size:14px; color:var(--g600); border-bottom:1px solid var(--g200);">
                <strong>نوٹ:</strong> یہ ٹیبل انفرادی لین دین دکھاتا ہے۔ <b>خادم کو دینے ہیں</b> کا مطلب ہے بھائی نے خادم سے پیسے لیے تھے۔
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
                            <th style="background:var(--g100);color:var(--g800);">کل رقم 2026 تک (مع منافع)</th>
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
            <p style="color:var(--g600); margin:0;">جن ممبران نے 2017 کے بعد خادم حسین سے کیش لیا یا دیا، ان پر پلاٹ کی شرح (18.4%) سے منافع لگایا گیا ہے۔ <br> <b>نامعلوم تاریخ والے ریکارڈ پر 2017 سے منافع لاگو کیا گیا ہے۔</b></p>
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
                    <tfoot>
                        <tr style="background:var(--g100); border-top:2px solid var(--gd);">
                            <td style="padding:15px; font-weight:bold; color:var(--g800);">کل میزان (Grand Total):</td>
                            <td class="n" style="padding:15px; font-weight:bold; color:\${totalBase > 0 ? 'var(--gd)' : '#dc2626'}">\${num(Math.abs(totalBase))}</td>
                            <td class="n" style="padding:15px; font-weight:bold; font-size:16px; color:\${grandTotalColor}">\${num(Math.abs(totalWithProfit))}</td>
                            <td colspan="2" style="padding:15px; font-weight:bold; color:\${grandTotalColor}">\${grandTotalStr}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>

        \${rowsHTML}
    </div>
    \`;
}`;

const startIdx = code.indexOf('export function renderCashProfit');
const endIdx = code.indexOf('export function renderExplanation');

if (startIdx !== -1 && endIdx !== -1) {
    code = code.substring(0, startIdx) + newFunc + '\n\n' + code.substring(endIdx);
    fs.writeFileSync(file, code);
    console.log("Successfully updated renderCashProfit.");
} else {
    console.error("Boundaries not found!");
}
