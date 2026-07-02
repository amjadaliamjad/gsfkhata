const fs = require('fs');
let appCode = fs.readFileSync('js/app.js', 'utf8');

// Replace the init part
appCode = appCode.replace(
    "let tgl = document.getElementById('islamic-mode-toggle');\r\n            if(tgl) tgl.checked = this.isIslamic;",
    "if(typeof updateIslamicUI === 'function') updateIslamicUI(this.isIslamic);"
);
appCode = appCode.replace(
    "let tgl = document.getElementById('islamic-mode-toggle');\n            if(tgl) tgl.checked = this.isIslamic;",
    "if(typeof updateIslamicUI === 'function') updateIslamicUI(this.isIslamic);"
);

fs.writeFileSync('js/app.js', appCode, 'utf8');
console.log('Fixed app.js for Islamic Mode UI sync');
