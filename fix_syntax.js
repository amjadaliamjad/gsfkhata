const fs = require('fs');
let c = fs.readFileSync('js/ui.js','utf8');
c = c.replace(/\\`/g, '`');
fs.writeFileSync('js/ui.js', c, 'utf8');
console.log('Fixed syntax');
