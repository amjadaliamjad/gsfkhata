const fs = require('fs');
let code = fs.readFileSync('js/ui.js', 'utf8');

const tLogicStart = "let received = m.receivedRent || 0;";
const tLogicEnd = "remaining = rentWithProfit;\n        }";

const idxLogicStart = code.indexOf(tLogicStart);
const idxLogicEnd = code.indexOf(tLogicEnd, idxLogicStart) + tLogicEnd.length;

if(idxLogicStart !== -1 && idxLogicEnd > idxLogicStart) {
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
    code = code.substring(0, idxLogicStart) + newLogic + code.substring(idxLogicEnd);
} else {
    console.log("Failed to find logic block");
}

const htmlOldStart = `<td class="n">\${num(baseRent)}</td>`;
const htmlOldEnd = `<td class="n" style="font-weight:bold;color:\${m.isAdmin?'var(--g800)':'var(--gd)'}">\${m.isAdmin ? '—' : num(remaining)}</td>`;

const idxHtmlStart = code.indexOf(htmlOldStart);
const idxHtmlEnd = code.indexOf(htmlOldEnd, idxHtmlStart) + htmlOldEnd.length;

if(idxHtmlStart !== -1 && idxHtmlEnd > idxHtmlStart) {
    const newHtml = `<td class="n">\${m.isAdmin ? '—' : num(finalPayableBase)}</td>
            <td style="color:var(--gm);font-weight:bold;background:var(--gb);">\${profitCellHtml}</td>
            <td class="n" style="color:var(--blu);font-weight:bold;">\${profitRate}%</td>
            <td class="n" style="font-weight:bold;color:\${m.isAdmin?'var(--g800)':'var(--gd)'}; font-size:16px;">\${m.isAdmin ? '—' : num(totalRemaining)}</td>`;
    code = code.substring(0, idxHtmlStart) + newHtml + code.substring(idxHtmlEnd);
} else {
    console.log("Failed to find HTML block");
}

fs.writeFileSync('js/ui.js', code);
console.log("Successfully replaced logic and HTML blocks.");
