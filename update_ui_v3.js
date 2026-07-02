const fs = require('fs');

const file = 'js/ui.js';
let code = fs.readFileSync(file, 'utf8');

const targetStr = `        <tr style="background:var(--w); border-bottom:1px solid var(--g200); cursor:pointer;" onclick="location.hash='#cashprofit/\\\${m.id}'" onmouseover="this.style.background='var(--g50)'" onmouseout="this.style.background='var(--w)'">
            <td style="padding:15px; font-weight:bold; color:var(--g800);">\\\${m.name}</td>
            <td class="n" style="padding:15px; color:\\\${m.netCashBase > 0 ? 'var(--gd)' : '#dc2626'}">\\\${num(Math.abs(m.netCashBase))}</td>
            <td class="n" style="padding:15px; color:\\\${color}; font-weight:bold;">\\\${num(Math.abs(m.netCashWithProfit))}</td>
            <td style="padding:15px; color:\\\${color}; font-size:14px;">\\\${finalStr}</td>
            <td style="padding:15px;text-align:center;"><button style="background:var(--gd);color:white;padding:8px 15px;border-radius:6px;font-size:14px;border:none;cursor:pointer;">تفصیل دیکھیں</button></td>
        </tr>`;

const newStr = `        let baseText = m.netCashBase > 0 ? 'حافظ خادم نے دینے تھے' : 'بھائی نے دینے تھے';
        
        <tr style="background:var(--w); border-bottom:1px solid var(--g200); cursor:pointer;" onclick="location.hash='#cashprofit/\\\${m.id}'" onmouseover="this.style.background='var(--g50)'" onmouseout="this.style.background='var(--w)'">
            <td style="padding:15px; font-weight:bold; color:var(--g800);">\\\${m.name}</td>
            <td class="n" style="padding:15px; color:\\\${m.netCashBase > 0 ? 'var(--gd)' : '#dc2626'}">\\\${num(Math.abs(m.netCashBase))}<br><span style="font-size:12px; font-weight:normal;">\\\${baseText}</span></td>
            <td class="n" style="padding:15px; color:\\\${color}; font-weight:bold;">\\\${num(Math.abs(m.netCashWithProfit))}</td>
            <td style="padding:15px; color:\\\${color}; font-size:14px;">\\\${finalStr}</td>
            <td style="padding:15px;text-align:center;"><button style="background:var(--gd);color:white;padding:8px 15px;border-radius:6px;font-size:14px;border:none;cursor:pointer;">تفصیل دیکھیں</button></td>
        </tr>`;

code = code.replace(targetStr, newStr);

fs.writeFileSync(file, code);
console.log("Updated UI for base amount text.");
