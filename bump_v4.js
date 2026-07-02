const fs = require('fs');

// 1. Bump version in index.html
let html = fs.readFileSync('index.html', 'utf8');
if (html.includes('app.js?v=3')) {
    html = html.replace('app.js?v=3', 'app.js?v=4');
}
fs.writeFileSync('index.html', html, 'utf8');

// 2. Bump version in js/app.js
let appJs = fs.readFileSync('js/app.js', 'utf8');
appJs = appJs.replace(/calculator\.js\?v=\d+/, 'calculator.js?v=4');
appJs = appJs.replace(/ui\.js\?v=\d+/, 'ui.js?v=4');
fs.writeFileSync('js/app.js', appJs, 'utf8');

console.log("Bumped to v=4");
