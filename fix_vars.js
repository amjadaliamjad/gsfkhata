const fs = require('fs');
let code = fs.readFileSync('js/ui.js', 'utf8');

// 1. Declare sum variables
const varStr = `    let allMembers = [...config.family.brothers, ...config.family.sisters, config.family.mother];
    let memberRows = '';`;

const varReplace = `    let allMembers = [...config.family.brothers, ...config.family.sisters, config.family.mother];
    let memberRows = '';
    let sumBaseAdjusted = 0, sumProfit = 0, sumTotalRemaining = 0;`;

if (code.includes(varStr)) {
    code = code.replace(varStr, varReplace);
}

// 2. Accumulate sum variables inside loop
const accStr = `        </tr>
        \`;
    });

    memberRows += \``;

const accReplace = `        </tr>
        \`;
        
        sumBaseAdjusted += (m.isAdmin ? 0 : finalPayableBase);
        sumProfit += profit;
        sumTotalRemaining += (m.isAdmin ? 0 : totalRemaining);
    });

    memberRows += \``;

if (code.includes(accStr)) {
    code = code.replace(accStr, accReplace);
}

fs.writeFileSync('js/ui.js', code);
console.log('Fixed undefined variables!');
