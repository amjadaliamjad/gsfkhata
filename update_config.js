const fs = require('fs');
let config = JSON.parse(fs.readFileSync('data/config.json', 'utf8'));

config.plot.salePrice2026 = 40500000;
config.plot.expenses2026 = 150000;
config.plot.shahidBonus2026 = 3000000;
config.plot.collectiveReserve2026 = 200000;

fs.writeFileSync('data/config.json', JSON.stringify(config, null, 2), 'utf8');
console.log('Updated config.json values.');
