const fs = require('fs');

let amjad = JSON.parse(fs.readFileSync('data/ledgers/amjad_ali.json', 'utf8'));

let cagr = 0.1837; // 18.4%
let totalBase = 0;
let totalWithProfit = 0;

amjad.forEach(tx => {
    if (tx.type === 'rent') return;
    let cr = parseInt(String(tx.credit||'').replace(/,/g, '')) || 0;
    let dr = parseInt(String(tx.debit||'').replace(/,/g, '')) || 0;
    
    let amount = cr - dr;
    if (amount === 0) return;

    let year = 2017; // Default
    let match = tx.date.match(/\d{4}/);
    if (match) {
        let parsed = parseInt(match[0]);
        if (parsed > 2000) year = parsed;
    }
    
    let multiplier = 1;
    let yearsHeld = 0;
    if (year >= 2017) {
        yearsHeld = 2026 - year;
        multiplier = Math.pow(1 + cagr, yearsHeld);
    }

    let amountWithProfit = Math.round(amount * multiplier);
    
    totalBase += amount;
    totalWithProfit += amountWithProfit;
    
    console.log(`Date: ${tx.date} | Year: ${year} | Mult: ${multiplier.toFixed(2)} | Amount: ${amount} | With Profit: ${amountWithProfit}`);
});

console.log(`\\nTotal Base: ${totalBase}`);
console.log(`Total With Profit: ${totalWithProfit}`);
