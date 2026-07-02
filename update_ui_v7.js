const fs = require('fs');

let file = 'js/ui.js';
let code = fs.readFileSync(file, 'utf8');

let newFunc = fs.readFileSync('new_renderCashProfit.js', 'utf8');

let start = code.indexOf('export function renderCashProfit');
let end = code.indexOf('export function renderExplanation');

if (start !== -1 && end !== -1 && end > start) {
    let oldCode = code.substring(start, end);
    code = code.replace(oldCode, newFunc + "\\n\\n");
    
    // Now apply explicit +/- signs
    code = code.replace(/num\\(Math\\.abs\\(m\\.netCashBase\\)\\)/g, '(m.netCashBase > 0 ? "+" : "-") + num(Math.abs(m.netCashBase))');
    code = code.replace(/num\\(Math\\.abs\\(profitAmt\\)\\)/g, '(profitAmt > 0 ? "+" : "-") + num(Math.abs(profitAmt))');
    code = code.replace(/num\\(Math\\.abs\\(m\\.netCashWithProfit\\)\\)/g, '(m.netCashWithProfit > 0 ? "+" : "-") + num(Math.abs(m.netCashWithProfit))');
    code = code.replace(/num\\(Math\\.abs\\(totalBase\\)\\)/g, '(totalBase > 0 ? "+" : "-") + num(Math.abs(totalBase))');
    code = code.replace(/num\\(Math\\.abs\\(totalProfit\\)\\)/g, '(totalProfit > 0 ? "+" : "-") + num(Math.abs(totalProfit))');
    code = code.replace(/num\\(Math\\.abs\\(totalWithProfit\\)\\)/g, '(totalWithProfit > 0 ? "+" : "-") + num(Math.abs(totalWithProfit))');

    fs.writeFileSync(file, code);
    console.log("Successfully replaced renderCashProfit with substrings and signs.");
} else {
    console.log("Failed to find indices", start, end);
}
