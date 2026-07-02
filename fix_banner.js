const fs = require('fs');
let c = fs.readFileSync('js/ui.js','utf8');
const searchStr = '    return `\n    <div>\n        <div style="background:var(--w); padding:20px; border-radius:12px; box-shadow:var(--s1); border:1px solid var(--g200); margin-bottom:25px; text-align:center;">\n            <img src="images/TaibaLogoWeb.jpg"';
const replaceStr = '    return `\n    <div>\n        ${renderIslamicWarning(config.isIslamic)}\n        <div style="background:var(--w); padding:20px; border-radius:12px; box-shadow:var(--s1); border:1px solid var(--g200); margin-bottom:25px; text-align:center;">\n            <img src="images/TaibaLogoWeb.jpg"';

if (c.includes(searchStr)) {
    c = c.replace(searchStr, replaceStr);
    fs.writeFileSync('js/ui.js', c, 'utf8');
    console.log('Fixed banner in ui.js');
} else {
    console.log('Could not find search string in ui.js');
}
