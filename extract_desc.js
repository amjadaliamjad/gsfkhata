const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'data', 'ledgers');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));

let uniqueDesc = new Set();

files.forEach(f => {
    let data = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    data.forEach(entry => {
        if (entry.description) {
            uniqueDesc.add(entry.description);
        }
    });
});

console.log(Array.from(uniqueDesc).join('\n'));
