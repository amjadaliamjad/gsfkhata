const fs = require('fs');
const file = 'js/ui.js';
let code = fs.readFileSync(file, 'utf8');

let newFunctions = `
export function renderCashProfit(config, calc) {
    const s2 = calc.s2;
    if (!s2 || !s2.individualSettlements) return "<h2>کوئی ڈیٹا نہیں ملا</h2>";
    
    let rowsHTML = s2.individualSettlements.map(m => {
        if (m.cashTransactions.length === 0) return '';
        
        let txRows = m.cashTransactions.map(tx => {
            let amountStr = num(tx.baseAmount);
            let profitStr = num(tx.profitAmount);
            let totalStr = num(tx.totalWithProfit);
            let typeColor = tx.baseAmount > 0 ? 'var(--gd)' : '#dc2626';
            let yearStr = tx.extractedYear >= 2017 ? tx.extractedYear : (tx.extractedYear ? tx.extractedYear + ' (بغیر منافع)' : 'نامعلوم تاریخ (بغیر منافع)');
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
            <h3 style="background:\${headerColor}; color:white; border:none; padding:15px 20px;">👤 \${m.name} کیش منافع تفصیل</h3>
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
            <p style="color:var(--g600); margin:0;">جن ممبران نے 2017 کے بعد خادم حسین سے کیش لیا یا دیا، ان پر پلاٹ کی شرح (18.4%) سے منافع لگایا گیا ہے۔</p>
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
                            <th style="background:var(--g100);color:var(--g800);">فائنل واجب الادا (Net Payable)</th>
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

fs.appendFileSync(file, newFunctions);
console.log("Appended new functions to ui.js");
