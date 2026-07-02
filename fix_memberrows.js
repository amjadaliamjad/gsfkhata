const fs = require('fs');
let code = fs.readFileSync('js/ui.js', 'utf8');

// Find the end of the allMembers.forEach loop
let searchStr = "        </tr>\r\n        `;\r\n    });";
if (code.indexOf(searchStr) === -1) {
    searchStr = "        </tr>\n        `;\n    });";
}

let idx = code.indexOf(searchStr);
if (idx !== -1) {
    let replaceStr = searchStr + `\n\n    memberRows += \`
        <tr style="background:var(--gd); color:white; font-size:16px; font-weight:bold;">
            <td colspan="2" style="padding:12px; text-align:right;">کل مجموعہ</td>
            <td class="n" style="padding:12px;">\${num(sumBaseAdjusted)}</td>
            <td class="n" style="padding:12px;">\${num(sumProfit)}</td>
            <td class="n" style="padding:12px;">-</td>
            <td class="n" style="padding:12px; font-size:18px;">\${num(sumTotalRemaining)}</td>
        </tr>
    \`;`;
    code = code.substring(0, idx) + replaceStr + code.substring(idx + searchStr.length);
    fs.writeFileSync('js/ui.js', code);
    console.log("Replaced end loop");
} else {
    console.log("Could not find loop end");
}
