export function renderCashProfit(config, calc) {
    const num = (x) => new Intl.NumberFormat('en-IN').format(Math.round(x));
    const s2 = calc.s2;
    if (!s2 || !s2.individualSettlements) return "<h2>کوئی ڈیٹا نہیں ملا</h2>";
    
    let totalBase = 0;
    let totalWithProfit = 0;
    let totalProfit = 0;

    let validMembers = s2.individualSettlements.filter(m => m.cashTransactions.length > 0 && !m.name.includes('خادم'));
    
    let topSummaryRows = validMembers.map(m => {
        totalBase += m.netCashBase;
        totalWithProfit += m.netCashWithProfit;
        let profitAmt = m.netCashWithProfit - m.netCashBase;
        totalProfit += profitAmt;
        
        let finalStr = formatWhoOwesWhom(m.netCashWithProfit, m.name);
        let color = m.netCashWithProfit > 0 ? 'var(--gd)' : '#dc2626';
        let baseText = m.netCashBase > 0 ? 'حافظ خادم نے دینے تھے' : 'بھائی نے دینے تھے';
        let profitBaseText = profitAmt > 0 ? 'حافظ خادم کے ذمے منافع' : 'بھائی کے ذمے منافع';

        return `
        <tr style="background:var(--w); border-bottom:1px solid var(--g200); cursor:pointer;" onclick="location.hash='#cashprofit/${m.id}'" onmouseover="this.style.background='var(--g50)'" onmouseout="this.style.background='var(--w)'">
            <td style="padding:15px; font-weight:bold; color:var(--g800);">${m.name}</td>
            <td class="n" style="padding:15px; color:${m.netCashBase > 0 ? 'var(--gd)' : '#dc2626'}">${num(Math.abs(m.netCashBase))}<br><span style="font-size:12px; font-weight:normal; color:var(--g600);">${baseText}</span></td>
            <td class="n" style="padding:15px; color:${profitAmt > 0 ? 'var(--gd)' : '#dc2626'}">${num(Math.abs(profitAmt))}<br><span style="font-size:12px; font-weight:normal; color:var(--g600);">${profitBaseText}</span></td>
            <td class="n" style="padding:15px; color:${color}; font-weight:bold; font-size:16px;">${num(Math.abs(m.netCashWithProfit))}</td>
            <td style="padding:15px; color:${color}; font-size:14px; font-weight:bold;">${finalStr}</td>
            <td style="padding:15px;text-align:center;"><button style="background:var(--gd);color:white;padding:8px 15px;border-radius:6px;font-size:14px;border:none;cursor:pointer;">تفصیل دیکھیں</button></td>
        </tr>
        `;
    }).join('');

    let grandTotalStr = formatWhoOwesWhom(totalWithProfit, 'سب کی طرف سے مجموعی طور پر');
    let grandTotalColor = totalWithProfit > 0 ? 'var(--gd)' : '#dc2626';

    let hash = location.hash;
    let parts = hash.split('/');
    let idParam = parts.length > 1 ? parts[1] : null;

    let activeMember = validMembers.find(m => m.id == idParam) || validMembers[0];
    let currentId = activeMember ? activeMember.id : null;

    let topMenuHTML = `
        <div style="display:flex; flex-wrap:wrap; gap:10px; margin-bottom:25px; justify-content:center; background:var(--w); padding:15px 20px; border-radius:12px; box-shadow:var(--s1); border:1px solid var(--g200);">
            ${validMembers.map(m => `
                <a href="#cashprofit/${m.id}" style="padding:8px 16px; border-radius:20px; text-decoration:none; font-size:15px; transition:all 0.2s; ${m.id == currentId ? 'background:var(--gd); color:var(--w); font-weight:bold; box-shadow:0 4px 10px rgba(27,67,50,0.3); transform:translateY(-2px);' : 'background:var(--g100); color:var(--g800); border:1px solid var(--g300);'}">
                    ${m.name}
                </a>
            `).join('')}
        </div>
    `;

    let rowsHTML = '';
    if (activeMember) {
        let m = activeMember;
        let summaryText = formatWhoOwesWhom(m.netCashWithProfit, m.name);
        let headerColor = m.netCashWithProfit > 0 ? 'var(--gd)' : '#dc2626';

        let innerRows = m.cashTransactions.map((t, idx) => {
            let mult = (t.multiplier && t.multiplier !== 1) ? t.multiplier.toFixed(2) + 'x' : '-';
            let amtStr = t.amount > 0 ? '+' + num(t.amount) : num(t.amount);
            let pColor = t.amountWithProfit > 0 ? 'var(--gd)' : '#dc2626';
            
            return `
            <tr>
                <td>${idx + 1}</td>
                <td>${t.date}</td>
                <td>${t.description}</td>
                <td class="n">${t.debit}</td>
                <td class="n">${t.credit}</td>
                <td class="n" style="font-weight:bold; color:${t.amount > 0 ? 'var(--gd)' : '#dc2626'}">${amtStr}</td>
                <td>${mult}</td>
                <td class="n" style="font-weight:bold; color:${pColor}">${num(t.amountWithProfit)}</td>
            </tr>
            `;
        }).join('');

        let profitAmt = m.netCashWithProfit - m.netCashBase;

        rowsHTML = `
        ${topMenuHTML}
        
        <div class="table-container" style="box-shadow:var(--s2); border:1px solid ${headerColor}; margin-bottom:30px; animation: fadeIn 0.3s ease-in-out;">
            <h3 style="background:${headerColor}; color:white; border:none; padding:15px 20px;">
                💸 ${m.name} کیش منافع تفصیل
            </h3>
            <div class="tw">
                <table class="tbl" style="margin:0;">
                    <thead>
                        <tr>
                            <th style="background:var(--g50);">#</th>
                            <th style="background:var(--g50);">تاریخ</th>
                            <th style="background:var(--g50);">تفصیل</th>
                            <th style="background:var(--g50);">ڈیبٹ (خادم نے دیے)</th>
                            <th style="background:var(--g50);">کریڈٹ (خادم نے لیے)</th>
                            <th style="background:var(--g50);">خالص کیش</th>
                            <th style="background:var(--g50);">منافع ضرب (Multiplier)</th>
                            <th style="background:var(--g50);">منافع کے ساتھ رقم</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${innerRows}
                    </tbody>
                    <tfoot>
                        <tr style="background:var(--g100); border-top:2px solid ${headerColor};">
                            <td colspan="3" style="padding:15px; font-weight:bold; color:var(--g800);">کل میزان (${m.name}):</td>
                            <td colspan="2"></td>
                            <td class="n" style="padding:15px; font-weight:bold; color:${m.netCashBase > 0 ? 'var(--gd)' : '#dc2626'}">${num(Math.abs(m.netCashBase))}</td>
                            <td></td>
                            <td class="n" style="padding:15px; font-weight:bold; font-size:16px; color:${headerColor}">${num(Math.abs(m.netCashWithProfit))}</td>
                        </tr>
                        <tr style="background:var(--w);">
                            <td colspan="8" style="padding:15px; text-align:center; font-size:15px; line-height:1.8;">
                                <div style="display:flex; justify-content:center; gap:30px; flex-wrap:wrap; margin-bottom:10px;">
                                    <span style="background:var(--g50); padding:10px 20px; border-radius:8px; border:1px solid var(--g200);">
                                        اصل خالص کیش: <strong class="n" style="color:${m.netCashBase > 0 ? 'var(--gd)' : '#dc2626'}">${num(Math.abs(m.netCashBase))}</strong>
                                    </span>
                                    <span style="background:var(--g50); padding:10px 20px; border-radius:8px; border:1px solid var(--g200);">
                                        منافع کی رقم: <strong class="n" style="color:${profitAmt > 0 ? 'var(--gd)' : '#dc2626'}">${num(Math.abs(profitAmt))}</strong>
                                    </span>
                                </div>
                                <div style="font-weight:bold; font-size:18px; color:${headerColor}; padding:10px; border:2px dashed ${headerColor}; border-radius:8px; display:inline-block;">
                                    فائنل کیش (مع منافع): ${num(Math.abs(m.netCashWithProfit))} — ${summaryText}
                                </div>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>`;
    }

    return `
    <div>
        <div style="background:var(--w); padding:20px; border-radius:12px; box-shadow:var(--s1); border:1px solid var(--g200); margin-bottom:25px; text-align:center;">
            <img src="images/TaibaLogoWeb.jpg" style="height:90px; mix-blend-mode:multiply; margin-bottom:15px; border-radius:8px;">
            <h2 style="color:var(--gd); margin-top:0; margin-bottom:10px;">💸 حافظ خادم کیش منافع (Cash Profit Details)</h2>
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
                            <th style="background:var(--g100);color:var(--g800);">منافع کی رقم (Profit Amount)</th>
                            <th style="background:var(--g100);color:var(--g800);">منافع کے ساتھ فائنل رقم</th>
                            <th style="background:var(--g100);color:var(--g800);">کون کس کو دے گا؟</th>
                            <th style="background:var(--g100);color:var(--g800);">تفصیل</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${topSummaryRows}
                    </tbody>
                    <tfoot>
                        <tr style="background:var(--g100); border-top:2px solid var(--gd);">
                            <td style="padding:15px; font-weight:bold; color:var(--g800);">کل میزان (Grand Total):</td>
                            <td class="n" style="padding:15px; font-weight:bold; color:${totalBase > 0 ? 'var(--gd)' : '#dc2626'}">${num(Math.abs(totalBase))}</td>
                            <td class="n" style="padding:15px; font-weight:bold; color:${totalProfit > 0 ? 'var(--gd)' : '#dc2626'}">${num(Math.abs(totalProfit))}</td>
                            <td class="n" style="padding:15px; font-weight:bold; font-size:16px; color:${grandTotalColor}">${num(Math.abs(totalWithProfit))}</td>
                            <td colspan="2" style="padding:15px; font-weight:bold; color:${grandTotalColor}">${grandTotalStr}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>

        ${rowsHTML}
    </div>
    `;
}
