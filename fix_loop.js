const fs = require('fs');
let code = fs.readFileSync('js/ui.js', 'utf8');
code = code.replace(/}\);\s*memberRows \+= `/, `        sumBaseAdjusted += (m.isAdmin ? 0 : finalPayableBase);
        sumProfit += profit;
        sumTotalRemaining += (m.isAdmin ? 0 : totalRemaining);
    });

    memberRows += \``);
fs.writeFileSync('js/ui.js', code);
console.log('Fixed loop end!');
