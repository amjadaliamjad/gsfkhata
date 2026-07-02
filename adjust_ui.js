const fs = require('fs');

// 1. Equalize button sizes in index.html
let html = fs.readFileSync('index.html', 'utf8');

// Replace off button style
html = html.replace(
    'id="btn-islamic-off" style="padding:6px 10px; background:var(--red); color:white; border:none; cursor:pointer; font-size:13px; font-weight:bold; transition:all 0.3s; line-height:1.2;"',
    'id="btn-islamic-off" style="flex:1; width:95px; padding:6px 10px; background:var(--red); color:white; border:none; cursor:pointer; font-size:13px; font-weight:bold; transition:all 0.3s; line-height:1.2; text-align:center;"'
);

// Replace on button style
html = html.replace(
    'id="btn-islamic-on" style="padding:6px 10px; background:var(--g100); color:var(--g800); border:none; cursor:pointer; font-size:13px; font-weight:bold; transition:all 0.3s; line-height:1.2;"',
    'id="btn-islamic-on" style="flex:1; width:95px; padding:6px 10px; background:var(--g100); color:var(--g800); border:none; cursor:pointer; font-size:13px; font-weight:bold; transition:all 0.3s; line-height:1.2; text-align:center;"'
);

fs.writeFileSync('index.html', html, 'utf8');
console.log('Fixed button sizes in index.html');

// 2. Increase menu font size slightly in style.css
let css = fs.readFileSync('css/style.css', 'utf8');

// Change from 14px to 15.5px (or 16px if we tighten padding)
css = css.replace(
    '.nav-item{padding:8px 10px;border-radius:6px;font-size:14px;color:var(--g600);',
    '.nav-item{padding:8px 8px;border-radius:6px;font-size:16px;color:var(--g600);'
);

fs.writeFileSync('css/style.css', css, 'utf8');
console.log('Fixed nav font size in style.css');
