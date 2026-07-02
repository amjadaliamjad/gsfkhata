const fs = require('fs');

let file = 'js/ui.js';
let code = fs.readFileSync(file, 'utf8');

// The replacement logic:
const regex = /export function renderCashProfit[\\s\\S]*?export function renderExplanation/g;
let newFunc = fs.readFileSync('new_renderCashProfit.js', 'utf8');

// Modify newFunc to include explicit signs
newFunc = newFunc.replace(/num\\(Math\\.abs\\(m\\.netCashBase\\)\\)/g, '(m.netCashBase > 0 ? "+" : "-") + num(Math.abs(m.netCashBase))');
newFunc = newFunc.replace(/num\\(Math\\.abs\\(profitAmt\\)\\)/g, '(profitAmt > 0 ? "+" : "-") + num(Math.abs(profitAmt))');
newFunc = newFunc.replace(/num\\(Math\\.abs\\(m\\.netCashWithProfit\\)\\)/g, '(m.netCashWithProfit > 0 ? "+" : "-") + num(Math.abs(m.netCashWithProfit))');
newFunc = newFunc.replace(/num\\(Math\\.abs\\(totalBase\\)\\)/g, '(totalBase > 0 ? "+" : "-") + num(Math.abs(totalBase))');
newFunc = newFunc.replace(/num\\(Math\\.abs\\(totalProfit\\)\\)/g, '(totalProfit > 0 ? "+" : "-") + num(Math.abs(totalProfit))');
newFunc = newFunc.replace(/num\\(Math\\.abs\\(totalWithProfit\\)\\)/g, '(totalWithProfit > 0 ? "+" : "-") + num(Math.abs(totalWithProfit))');

code = code.replace(regex, newFunc + "\\n\\nexport function renderExplanation");
fs.writeFileSync(file, code);
console.log("Successfully added explicit +/- signs to UI");
