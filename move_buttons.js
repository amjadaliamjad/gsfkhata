const fs = require('fs');
let html = fs.readFileSync('js/ui.js', 'utf8');

const oldReturn = `    return \`
    <div>
        \${renderIslamicWarning(config.isIslamic)}
        \${summaryTableHTML}
        \${detailHTML}
        \${topMenuHTML}
    </div>
    \`;`;

const newReturn = `    return \`
    <div>
        \${renderIslamicWarning(config.isIslamic)}
        \${topMenuHTML}
        \${summaryTableHTML}
        \${detailHTML}
    </div>
    \`;`;

if(html.includes(oldReturn)) {
    html = html.replace(oldReturn, newReturn);
    fs.writeFileSync('js/ui.js', html, 'utf8');
    console.log('Moved topMenuHTML to the top of renderKhata');
} else {
    // try removing the extra topMenuHTML inside the return string
    console.log('Could not find the exact string to replace');
}
