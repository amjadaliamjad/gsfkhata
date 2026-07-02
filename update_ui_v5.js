const fs = require('fs');

let file = 'js/ui.js';
let code = fs.readFileSync(file, 'utf8');

const regex = /export function renderCashProfit[\\s\\S]*?export function renderExplanation/g;

let newFunc = fs.readFileSync('new_renderCashProfit.js', 'utf8');

code = code.replace(regex, newFunc + "\\n\\nexport function renderExplanation");
fs.writeFileSync(file, code);
console.log("Successfully replaced renderCashProfit");
