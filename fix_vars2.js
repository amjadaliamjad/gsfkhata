const fs = require('fs');
let code = fs.readFileSync('js/ui.js', 'utf8');

let changed = false;

// 1. Declare sum variables
let s1 = "let allMembers = [...config.family.brothers, ...config.family.sisters, config.family.mother];";
let idx1 = code.indexOf(s1);
if (idx1 !== -1) {
    let toReplace = s1 + "\r\n    let memberRows = '';";
    if (code.indexOf(toReplace) === -1) toReplace = s1 + "\n    let memberRows = '';";
    
    let replacement = s1 + "\n    let memberRows = '';\n    let sumBaseAdjusted = 0, sumProfit = 0, sumTotalRemaining = 0;";
    if (code.indexOf(toReplace) !== -1) {
        code = code.replace(toReplace, replacement);
        changed = true;
        console.log("Vars declared!");
    } else {
        console.log("Could not find memberRows declaration");
    }
}

// 2. Accumulate sum variables inside loop
let s2 = "        </tr>";
let idx2 = code.indexOf(s2);
// Find the exact loop end for allMembers.forEach
let s3 = "    });\r\n\r\n    memberRows += `\r\n        <tr style=\"background:var(--gd);";
if (code.indexOf(s3) === -1) s3 = "    });\n\n    memberRows += `\n        <tr style=\"background:var(--gd);";

let toReplace2 = `        </tr>\r\n        \`;\r\n    });\r\n\r\n    memberRows += \``;
if (code.indexOf(toReplace2) === -1) toReplace2 = `        </tr>\n        \`;\n    });\n\n    memberRows += \``;

let replacement2 = `        </tr>
        \`;
        sumBaseAdjusted += (m.isAdmin ? 0 : finalPayableBase);
        sumProfit += profit;
        sumTotalRemaining += (m.isAdmin ? 0 : totalRemaining);
    });

    memberRows += \``;

if (code.indexOf(toReplace2) !== -1) {
    code = code.replace(toReplace2, replacement2);
    changed = true;
    console.log("Loop accumulated!");
} else {
    // maybe there's no blank line before memberRows
    toReplace2 = `        </tr>\r\n        \`;\r\n    });\r\n    memberRows += \``;
    if (code.indexOf(toReplace2) === -1) toReplace2 = `        </tr>\n        \`;\n    });\n    memberRows += \``;
    
    if (code.indexOf(toReplace2) !== -1) {
        code = code.replace(toReplace2, replacement2);
        changed = true;
        console.log("Loop accumulated! (no newline)");
    } else {
        console.log("Could not find loop end");
    }
}

if (changed) {
    fs.writeFileSync('js/ui.js', code);
    console.log("Updated!");
}
