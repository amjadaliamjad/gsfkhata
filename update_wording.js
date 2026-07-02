const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace('💰 منافع موڈ', '💰 منافع کے ساتھ');
html = html.replace('🕌 شرعی موڈ', '🕌 بغیر منافع');

fs.writeFileSync('index.html', html, 'utf8');
console.log('Updated to With Profit / Without Profit in Urdu');
