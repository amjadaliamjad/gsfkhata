const fs = require('fs');
const cp = require('child_process');

try {
    // Get the previous ui.js directly from git using buffer to preserve encoding
    const oldUiBuffer = cp.execSync('git show c91326c~1:js/ui.js');
    const oldUi = oldUiBuffer.toString('utf8');

    let currentUi = fs.readFileSync('js/ui.js', 'utf8');

    const startTarget = 'export function renderCashProfit(config, calc) {';
    const endTarget = 'export function renderAgriculture(config, calcDataAll) {';

    const oldStartIdx = oldUi.indexOf(startTarget);
    const oldEndIdx = oldUi.indexOf(endTarget);

    const currStartIdx = currentUi.indexOf(startTarget);
    const currEndIdx = currentUi.indexOf(endTarget);

    if (oldStartIdx !== -1 && oldEndIdx !== -1 && currStartIdx !== -1 && currEndIdx !== -1) {
        const correctBlock = oldUi.substring(oldStartIdx, oldEndIdx);
        
        // Replace the mangled block with the correct block
        currentUi = currentUi.substring(0, currStartIdx) + correctBlock + currentUi.substring(currEndIdx);
        
        fs.writeFileSync('js/ui.js', currentUi, 'utf8');
        console.log('Successfully restored correct Urdu text');
    } else {
        console.log('Could not find indices. oldStart:', oldStartIdx, 'oldEnd:', oldEndIdx, 'currStart:', currStartIdx, 'currEnd:', currEndIdx);
    }
} catch (e) {
    console.error(e);
}
