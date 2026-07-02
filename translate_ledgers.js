const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'data', 'ledgers');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));

const replacements = {
    "Safdar ko deya Amdaad k jang Rizwan k account mein": "صفدر کو دیا امداد کے لئے رضوان کے اکاؤنٹ میں", // Assuming jang was a typo for jagah or just for
    "Safdar ko deay Arshad ki walda ko deay amdaad ki": "صفدر کو دیے ارشد کی والدہ کو دیے امداد کے",
    "Amjid sy hudaar leay": "امجد سے ادھار لیے",
    "Amir ko kharcha diya": "عامر کو خرچہ دیا",
    "Sufdar ny muhammad umar k account mein kiraya": "صفدر نے محمد عمر کے اکاؤنٹ میں کرایہ",
    "roop fan چھت": "روف فین چھت",
    "Petrol رکشہ": "پیٹرول رکشہ"
};

let updatedCount = 0;

files.forEach(f => {
    const filePath = path.join(dir, f);
    let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let changed = false;

    data.forEach(entry => {
        if (entry.description) {
            for (const [roman, urdu] of Object.entries(replacements)) {
                if (entry.description.includes(roman)) {
                    entry.description = entry.description.replace(roman, urdu);
                    changed = true;
                    updatedCount++;
                }
            }
        }
    });

    if (changed) {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    }
});

console.log(`Updated ${updatedCount} descriptions.`);
