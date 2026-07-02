const fs = require('fs');

let file = 'js/ui.js';
let code = fs.readFileSync(file, 'utf8');

// Fix the NaN issue by replacing t.amount with t.baseAmount and t.amountWithProfit with t.totalWithProfit
code = code.replace(/t\\.amount > 0/g, 't.baseAmount > 0');
code = code.replace(/num\\(t\\.amount\\)/g, 'num(t.baseAmount)');
code = code.replace(/t\\.amountWithProfit/g, 't.totalWithProfit');

// Add the explanation before the Summary table
const explanationHTML = \\`
        <div style="background:#fff3cd; color:#856404; padding:20px; border-radius:12px; border:1px solid #ffeeba; margin-bottom:25px; line-height:1.8;">
            <h3 style="margin-top:0; color:#856404;">⚠️ وضاحت: فائنل رقم میں تبدیلی کیسے آتی ہے؟ (اہم مثال)</h3>
            <p>بعض اوقات ایسا ہوتا ہے کہ کسی بھائی نے خادم کو زیادہ کیش دیا ہوتا ہے (جس کی وجہ سے <b>اصل خالص رقم</b> سبز رنگ میں نظر آتی ہے کہ خادم نے دینے ہیں)، لیکن <b>منافع کے ساتھ فائنل رقم</b> منفی (سرخ) ہو جاتی ہے (یعنی بھائی نے خادم کو دینے ہیں)۔ ایسا کیوں ہوتا ہے؟</p>
            <div style="background:#ffffff; padding:15px; border-radius:8px; border:1px solid #ffeeba; margin-top:15px; font-size:15px;">
                <b>مثال کے طور پر (امجد علی کا کیس):</b>
                <ul style="margin-bottom:0; padding-left:20px; margin-top:10px;">
                    <li>امجد نے خادم کو حال ہی میں (2023-2024) میں بڑی رقوم دیں (جیسے 8 لاکھ، 6 لاکھ)۔ چونکہ یہ رقوم حال ہی میں دی گئیں، ان پر منافع بہت کم لگا (تقریباً <b>1.40x</b>)۔</li>
                    <li>لیکن امجد نے <b>2017</b> میں بھی خادم سے رقوم لی تھیں۔ وہ رقوم چونکہ 9 سال پرانی ہیں، ان پر 9 سالوں کا 18.4% منافع لگ کر وہ <b>4.56 گنا (4.56x)</b> بڑھ گئیں۔</li>
                    <li>نتیجتاً، 2017 کے قرض پر جو بے تحاشہ منافع بنا، اس نے 2024 کی دی گئی بڑی رقوم کو عبور کر لیا، اور فائنل بیلنس میں امجد علی خادم کے مقروض نکلے۔</li>
                </ul>
            </div>
            <p style="margin-bottom:0; margin-top:15px;">یہ بالکل اسی طرح ہے جیسے کسی نے 2010 میں 10 ہزار روپے ادھار لیے ہوں اور 2024 میں 12 ہزار واپس کرے، تو 14 سال کے منافع کی وجہ سے اس کا قرض ابھی بھی باقی ہوگا۔ تمام حسابات ریاضی کے اصول (Compound Interest) کے عین مطابق ہیں۔</p>
        </div>
\\`;

const summaryHeaderRegex = /<div class="table-container" style="box-shadow:var\\(--s2\\); border:1px solid var\\(--gd\\); margin-bottom:30px;">/;
code = code.replace(summaryHeaderRegex, explanationHTML + "\\n        <div class=\\"table-container\\" style=\\"box-shadow:var(--s2); border:1px solid var(--gd); margin-bottom:30px;\\">");

fs.writeFileSync(file, code);
console.log("Successfully fixed NaN and added explanation");
