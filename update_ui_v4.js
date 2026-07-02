const fs = require('fs');
let code = fs.readFileSync('js/ui.js', 'utf8');

let target = "let finalStr = formatWhoOwesWhom(m.netCashWithProfit, m.name);";

let newCode = `let finalStr = formatWhoOwesWhom(m.netCashWithProfit, m.name);
        let baseText = m.netCashBase > 0 ? 'حافظ خادم نے دینے تھے' : 'بھائی نے دینے تھے';`;

if (code.includes(target) && !code.includes("let baseText = m.netCashBase")) {
    code = code.replace(target, newCode);
    code = code.replace(
        '${num(Math.abs(m.netCashBase))}</td>', 
        '${num(Math.abs(m.netCashBase))}<br><span style="font-size:12px; font-weight:normal;">${baseText}</span></td>'
    );
    fs.writeFileSync('js/ui.js', code);
    console.log("Successfully patched ui.js");
} else {
    console.log("Target not found or already patched");
}
