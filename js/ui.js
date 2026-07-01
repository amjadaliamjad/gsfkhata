// GSFKhata - UI Renderers

function num(n) {
    if (n === null || n === undefined) return '—';
    return (n < 0 ? '−' : '') + Math.abs(Math.round(n)).toLocaleString('en-PK');
}

function pkr(n) {
    if (n === null || n === undefined) return '—';
    return (n < 0 ? '−' : '') + 'Rs.' + Math.abs(Math.round(n)).toLocaleString('en-PK');
}

function escapeHtml(text) {
    return text.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

export function renderDashboard(config, calcDataAll, baseData, ledgers) {
    const calcData = calcDataAll.s1; 
    const calcData2 = calcDataAll.s2;
    
    // --- Member Cards Option 1 ---
    let membersHtml1 = '';
    // Brothers
    config.family.brothers.forEach(b => {
        const plot = b.isAdmin ? calcData.khadim.plot : calcData.brotherBase.plot;
        const rentOwedToThem = b.isAdmin ? 0 : (calcData.brotherBase.rent - (b.receivedRent || 0));
        const landPayment = b.isAdmin ? 0 : baseData.landPerBrother;
        let net = plot;
        if (!b.isAdmin) net = plot + rentOwedToThem - landPayment;
        let cls = b.isAdmin ? 'admin' : '';
        membersHtml1 += `
        <div class="mem ${cls}" onclick="location.hash='#khata/${b.id}'">
            <div class="mem-name">${b.name}${b.isAdmin ? ' ⭐' : ''}</div>
            <div class="mem-role" style="text-align:left">${b.isAdmin ? 'ایڈمن / نگران' : 'حصہ دار بھائی'}</div>
            <div class="mem-row"><span class="lbl">پلاٹ حصہ</span><span class="val val-plot">${num(plot)}</span></div>
            <div class="mem-row"><span class="lbl">بقایا کرایہ</span><span class="val" style="color:var(--g800)">${b.isAdmin ? '—' : num(rentOwedToThem)+'+'}</span></div>
            <div class="mem-row"><span class="lbl">زمین ادائیگی</span><span class="val" style="color:var(--g800)">${b.isAdmin ? '—' : num(landPayment)+'-'}</span></div>
            <div class="mem-row" style="margin-top:15px; border:none;"><span class="lbl" style="font-weight:bold;color:var(--gd);">خالص رقم</span><span class="val val-net">${num(net)}</span></div>
        </div>`;
    });
    // Sisters & Mother Option 1
    const femaleMembers = [...config.family.sisters, config.family.mother];
    femaleMembers.forEach(f => {
        const isMother = f.id === 'mother';
        const plot = isMother ? calcData.mother.plot : calcData.sisters.plot;
        const rentOwedToThem = isMother ? calcData.mother.rent : calcData.sisters.rent;
        const landPayment = 0; // Females don't pay for the land
        const net = plot + rentOwedToThem;
        const cls = isMother ? 'mother-card' : 'sister';
        membersHtml1 += `
        <div class="mem ${cls}" onclick="location.hash='#khata/${f.id}'">
            <div class="mem-name">${f.name}</div>
            <div class="mem-role" style="text-align:left">${isMother ? 'والدہ محترمہ' : 'حصہ دار بہن'}</div>
            <div class="mem-row"><span class="lbl">پلاٹ حصہ</span><span class="val val-plot">${num(plot)}</span></div>
            <div class="mem-row"><span class="lbl">بقایا کرایہ</span><span class="val" style="color:var(--g800)">${num(rentOwedToThem)}+</span></div>
            <div class="mem-row"><span class="lbl">زمین ادائیگی</span><span class="val" style="color:var(--g800)">—</span></div>
            <div class="mem-row" style="margin-top:15px; border:none;"><span class="lbl" style="font-weight:bold;color:var(--gd);">خالص رقم</span><span class="val val-net">${num(net)}</span></div>
        </div>`;
    });


    // --- Member Cards Option 2 ---
    let membersHtml2 = '';
    // Brothers
    config.family.brothers.forEach(b => {
        const plot = b.isAdmin ? calcData2.khadim.plot : calcData2.brotherBase.plot;
        const rentOwedToThem = b.isAdmin ? 0 : (calcData2.brotherBase.rent - (b.receivedRent || 0));
        const landPayment = b.isAdmin ? 0 : baseData.landPerBrother;
        let net = plot;
        if (!b.isAdmin) net = plot + rentOwedToThem - landPayment;
        let cls = b.isAdmin ? 'admin' : '';
        membersHtml2 += `
        <div class="mem ${cls}" onclick="location.hash='#khata/${b.id}'">
            <div class="mem-name">${b.name}${b.isAdmin ? ' ⭐' : ''}</div>
            <div class="mem-role" style="text-align:left">${b.isAdmin ? 'ایڈمن / نگران' : 'حصہ دار بھائی'}</div>
            <div class="mem-row"><span class="lbl">پلاٹ حصہ</span><span class="val val-plot">${num(plot)}</span></div>
            <div class="mem-row"><span class="lbl">بقایا کرایہ (منافع کیساتھ)</span><span class="val" style="color:var(--g800)">${b.isAdmin ? '—' : num(rentOwedToThem)+'+'}</span></div>
            <div class="mem-row"><span class="lbl">زمین ادائیگی</span><span class="val" style="color:var(--g800)">${b.isAdmin ? '—' : num(landPayment)+'-'}</span></div>
            <div class="mem-row" style="margin-top:15px; border:none;"><span class="lbl" style="font-weight:bold;color:var(--gd);">خالص رقم</span><span class="val val-net">${num(net)}</span></div>
        </div>`;
    });
    // Sisters & Mother Option 2
    femaleMembers.forEach(f => {
        const isMother = f.id === 'mother';
        const plot = isMother ? calcData2.mother.plot : calcData2.sisters.plot;
        const rentOwedToThem = isMother ? calcData2.mother.rent : calcData2.sisters.rent;
        const landPayment = 0; 
        const net = plot + rentOwedToThem;
        const cls = isMother ? 'mother-card' : 'sister';
        membersHtml2 += `
        <div class="mem ${cls}" onclick="location.hash='#khata/${f.id}'">
            <div class="mem-name">${f.name}</div>
            <div class="mem-role" style="text-align:left">${isMother ? 'والدہ محترمہ' : 'حصہ دار بہن'}</div>
            <div class="mem-row"><span class="lbl">پلاٹ حصہ</span><span class="val val-plot">${num(plot)}</span></div>
            <div class="mem-row"><span class="lbl">بقایا کرایہ</span><span class="val" style="color:var(--g800)">${num(rentOwedToThem)}+</span></div>
            <div class="mem-row"><span class="lbl">زمین ادائیگی</span><span class="val" style="color:var(--g800)">—</span></div>
            <div class="mem-row" style="margin-top:15px; border:none;"><span class="lbl" style="font-weight:bold;color:var(--gd);">خالص رقم</span><span class="val val-net">${num(net)}</span></div>
        </div>`;
    });

    // --- Detailed Status Table (Option 1) ---
    let table1Rows = '';
    config.family.brothers.forEach((b, index) => {
        const plot = b.isAdmin ? calcData.khadim.plot : calcData.brotherBase.plot;
        const totalRentOwed = b.isAdmin ? calcData.khadim.rent : calcData.brotherBase.rent;
        const received = b.receivedRent || 0;
        const pendingRent = totalRentOwed - received;
        const landShare = baseData.landPerBrother;
        const totalDueByBrother = landShare - pendingRent; 

        let status = '';
        if (totalDueByBrother > 0) status = '<span class="status-badge" style="color:var(--org);border-color:var(--org)">جزوی</span>'; 
        else if (totalDueByBrother < 0) status = '<span class="status-badge" style="color:var(--gdk);background:var(--glt);border-color:var(--gold)">زیر التواء</span>'; 
        else status = '<span class="status-badge" style="color:var(--gd);background:var(--gp);border-color:var(--gl)">مکمل</span>';

        table1Rows += `
        <tr>
            <td class="n">${index+1}</td>
            <td>${b.name} ${b.isAdmin?'⭐':''}</td>
            <td class="n">${num(landShare)}</td>
            <td class="n">${num(totalRentOwed)}</td>
            <td class="n">${num(received)}</td>
            <td class="ng n" style="color:#059669">${num(pendingRent)}</td>
            <td class="nr n" style="color:${totalDueByBrother>0?'#1F2937':'#DC2626'}">${totalDueByBrother < 0 ? '-' : ''}${num(Math.abs(totalDueByBrother))}</td>
            <td class="n">0</td>
            <td class="n" style="font-weight:bold;color:${totalDueByBrother>0?'#1F2937':'#16A34A'}">${totalDueByBrother < 0 ? '-' : ''}${num(Math.abs(totalDueByBrother))}</td>
            <td>${status}</td>
        </tr>`;
    });

    // --- Detailed Status Table (Option 2 - Plot Profit) ---
    let table2Rows = '';
    config.family.brothers.forEach((b, index) => {
        const plot = b.isAdmin ? calcData2.khadim.plot : calcData2.brotherBase.plot;
        const totalRentOwed = b.isAdmin ? calcData2.khadim.rent : calcData2.brotherBase.rent;
        const received = b.receivedRent || 0; 
        const pendingRent = totalRentOwed - received;
        const landShare = baseData.landPerBrother;
        const totalDueByBrother = landShare - pendingRent; 

        let status = '';
        if (totalDueByBrother > 0) status = '<span class="status-badge" style="color:var(--org);border-color:var(--org)">جزوی</span>'; 
        else if (totalDueByBrother < 0) status = '<span class="status-badge" style="color:var(--gdk);background:var(--glt);border-color:var(--gold)">زیر التواء</span>'; 
        else status = '<span class="status-badge" style="color:var(--gd);background:var(--gp);border-color:var(--gl)">مکمل</span>';

        table2Rows += `
        <tr>
            <td class="n">${index+1}</td>
            <td>${b.name} ${b.isAdmin?'⭐':''}</td>
            <td class="n">${num(plot)}</td>
            <td class="n">${num(totalRentOwed)}</td>
            <td class="n">${num(received)}</td>
            <td class="ng n" style="color:#059669">${num(pendingRent)}</td>
            <td class="nr n" style="color:${totalDueByBrother>0?'#1F2937':'#DC2626'}">${totalDueByBrother < 0 ? '-' : ''}${num(Math.abs(totalDueByBrother))}</td>
            <td class="n">0</td>
            <td class="n" style="font-weight:bold;color:${totalDueByBrother>0?'#1F2937':'#16A34A'}">${totalDueByBrother < 0 ? '-' : ''}${num(Math.abs(totalDueByBrother))}</td>
            <td>${status}</td>
        </tr>`;
    });

    // Explanation Texts
    const historyText1 = `یہ طریقہ پرانے معاہدے پر مبنی ہے۔ والد صاحب نے 2008/2009 میں گرین ٹاؤن میں 10 مرلہ کا پلاٹ خریدا تھا۔ پیسوں کی کمی کی وجہ سے انہوں نے کزن منیر احمد کو 1/3 حصے دار بنا لیا۔ 2017 میں کزن نے اپنا حصہ مانگا جس کی مالیت 31 لاکھ روپے طے پائی۔ باقی 8 بھائیوں نے صرف 2.22 لاکھ کا حصہ ڈالا، جبکہ خادم حسین نے اپنا 2.22 لاکھ اور مزید 11.02 لاکھ ادا کر کے کزن کو فارغ کیا۔ <br><br>اس طریقے (Option 1) کے مطابق، خادم کو ان کی انویسٹمنٹ کی بنیاد پر پلاٹ کا اضافی حصہ تو دے دیا گیا ہے، لیکن کرائے کی مد میں رکی ہوئی رقم پر کوئی منافع (Profit) شامل نہیں کیا گیا۔ <b>شرعی لحاظ سے</b> پیسے کی وقت کے ساتھ قدر گرتی ہے (Inflation)، اس لیے سالوں سے رکے ہوئے کرائے پر منافع نہ دینا شرعی اصولوں کے منافی اور ناانصافی ہو سکتا ہے۔ ہر بھائی کا خالص حصہ (Net) اس میں ظاہر کیا گیا ہے۔`;

    const historyText2 = `یہ طریقہ مکمل طور پر انصاف اور شرعی اصولوں (Islamic Equity & Mudarabah principles) پر مبنی ہے۔ چونکہ 2017 میں خادم حسین نے مشکل وقت میں 11.02 لاکھ کی خطیر رقم انویسٹ کی، اور دوسری طرف خاندان کا کرایہ بھی خادم کے پاس سالوں تک رکا رہا۔ شرعی لحاظ سے رکی ہوئی رقم (چاہے وہ انویسٹمنٹ ہو یا کرایہ) کو اگر کاروبار یا جائیداد میں استعمال کیا جائے، تو اس پر منافع (Profit / Capital Gain) لاگو ہوتا ہے۔<br><br>اس طریقے میں خادم کی انویسٹمنٹ اور خاندان کے رکے ہوئے کرائے، دونوں کو پلاٹ کی قیمت کے اضافے (تقریباً 18.4% سالانہ) کے حساب سے بڑھایا گیا ہے۔ اس سے کسی کی بھی حق تلفی نہیں ہوتی اور تمام ممبران کو ان کی رکی ہوئی رقم پر پلاٹ کے تناسب سے بہترین فائدہ ملتا ہے۔`;

    return `
    <!-- Top General Explanation Box -->
    <div class="card-ex">
        <h2>ℹ️ مرکزی ڈیش بورڈ کی تفصیلات اور وضاحت</h2>
        <p>یہ ڈیش بورڈ سرور فیملی کے تمام مالی معاملات (پلاٹ، زمین، اور کرایہ) کا مکمل اور شفاف حساب پیش کرتا ہے۔ ہر رقم کو احتیاط سے پرکھا گیا ہے تاکہ فیملی کے درمیان کسی قسم کا ابہام نہ رہے۔</p>
        <p>آپ کے سامنے دو مختلف طریقے (Options) پیش کیے گئے ہیں تاکہ آپ خود دیکھ سکیں کہ کس طریقے میں کیا فرق اور فوائد ہیں۔ ٹائلز میں موجود <b>(ℹ️)</b> کے نشان پر کلک کر کے آپ ہر رقم کے حساب کی مکمل تفصیل جان سکتے ہیں۔</p>
    </div>

    <!-- Metric Tiles -->
    <div class="tiles t4">
        <!-- Tile 1 -->
        <div class="tile t-blue" style="border-bottom:none">
            <div class="t-head">
                <div class="t-ico">👨‍👩‍👧‍👦</div>
                <div class="t-lbl">کل خاندانی ممبران <span class="t-info" onclick="app.showInfo('کل خاندانی ممبران', 'اس میں 9 بھائی، 2 بہنیں، اور 1 والدہ شامل ہیں۔ کل ملا کر فیملی کے 12 ممبران بنتے ہیں جن میں وراثت یا منافع تقسیم کیا جاتا ہے۔')">ℹ️</span></div>
            </div>
            <div class="t-val">${baseData.totalMembers}</div>
            <div class="t-sub" style="text-align:right">9 بھائی، 2 بہنیں، والدہ</div>
        </div>
        
        <!-- Tile 2 -->
        <div class="tile t-gold" style="border-bottom:none">
            <div class="t-head">
                <div class="t-ico">🏡</div>
                <div class="t-lbl">6 کنال زمین (متفقہ) <span class="t-info" onclick="app.showInfo('6 کنال زمین', 'یہ 6 کنال زمین بھائی خادم حسین سے واپس خریدی جا رہی ہے۔ اس کی متفقہ قیمت ${num(baseData.landValue)} روپے طے پائی ہے۔ چونکہ یہ 9 بھائیوں نے خریدنی ہے، اس لیے ہر بھائی کے حصے میں ${num(baseData.landPerBrother)} روپے آتے ہیں۔')">ℹ️</span></div>
            </div>
            <div class="t-val">${pkr(baseData.landValue)}</div>
            <div class="t-sub" style="text-align:right">فی بھائی: ${num(baseData.landPerBrother)}</div>
        </div>

        <!-- Tile 3 -->
        <div class="tile t-blue" style="border-bottom:none">
            <div class="t-head">
                <div class="t-ico">🏘️</div>
                <div class="t-lbl">پلاٹ کی کل فروخت <span class="t-info" onclick="app.showInfo('پلاٹ کی فروخت', 'گرین ٹاؤن کا 10 مرلہ پلاٹ کل ${pkr(baseData.plotSale)} میں فروخت ہوا ہے۔ اس میں کزن منیر احمد کا 1/3 حصہ بھی شامل ہے جسے بعد میں الگ کیا جائے گا۔')">ℹ️</span></div>
            </div>
            <div class="t-val">${pkr(baseData.plotSale)}</div>
            <div class="t-sub" style="text-align:right">PKR ${num(baseData.plotSale)}</div>
        </div>

        <!-- Tile 4 -->
        <div class="tile t-pur" style="border-bottom:none">
            <div class="t-head">
                <div class="t-ico">📅</div>
                <div class="t-lbl">کل کرایہ 2017–2026 <span class="t-info" onclick="app.showInfo('کل کرایہ', 'یہ پلاٹ کا کل کرایہ ہے جو 2017 سے 2026 تک اکٹھا ہوا۔ ہر سال کے ماہانہ کرائے کو کل مہینوں سے ضرب دے کر یہ رقم (${pkr(baseData.totalRent)}) نکالی گئی ہے۔')">ℹ️</span></div>
            </div>
            <div class="t-val">${pkr(baseData.totalRent)}</div>
            <div class="t-sub" style="text-align:right">9 سال + جزوی 2026</div>
        </div>
        
        <!-- Tile 5 -->
        <div class="tile t-green" style="border-bottom:none">
            <div class="t-head">
                <div class="t-ico">🤝</div>
                <div class="t-lbl">فی بھائی کرایہ <span class="t-info" onclick="app.showInfo('فی بھائی کرایہ', 'کل کرائے (${pkr(baseData.totalRent)}) میں سے والدہ (1/8) اور بہنوں کا شرعی حصہ نکالنے کے بعد، باقی کرائے کو تمام بھائیوں میں برابر تقسیم کیا گیا ہے، جس سے ہر بھائی کا حصہ ${pkr(calcData.brotherBase.rent)} بنتا ہے۔')">ℹ️</span></div>
            </div>
            <div class="t-val">${pkr(calcData.brotherBase.rent)}</div>
            <div class="t-sub" style="text-align:right">تمام ممبران میں تقسیم کے بعد</div>
        </div>

        <!-- Tile 6 -->
        <div class="tile t-green" style="border-bottom:none">
            <div class="t-head">
                <div class="t-ico">✅</div>
                <div class="t-lbl">کل وصول شدہ کرایہ <span class="t-info" onclick="app.showInfo('وصول شدہ کرایہ', 'مختلف اوقات میں بھائیوں نے خادم حسین سے اپنی ضروریات کے لیے جو کرایہ پیشگی وصول کر لیا تھا، ان سب کا مجموعہ ${pkr(baseData.totalReceivedRent)} ہے۔')">ℹ️</span></div>
            </div>
            <div class="t-val">${pkr(baseData.totalReceivedRent)}</div>
            <div class="t-sub" style="text-align:right">ابھی تک کل وصولی</div>
        </div>

        <!-- Tile 7 -->
        <div class="tile t-org" style="border-bottom:none">
            <div class="t-head">
                <div class="t-ico">⏳</div>
                <div class="t-lbl">کل بقایا کرایہ <span class="t-info" onclick="app.showInfo('بقایا کرایہ', 'کل کرائے میں سے خاندان کا پہلے سے وصول شدہ کرایہ منفی کرنے کے بعد، یہ وہ رقم (${pkr(baseData.totalPendingRent)}) ہے جو ابھی خادم حسین کے ذمے خاندان کو ادا کرنا باقی ہے۔')">ℹ️</span></div>
            </div>
            <div class="t-val">${pkr(baseData.totalPendingRent)}</div>
            <div class="t-sub" style="text-align:right">خادم کے ذمے ابھی باقی</div>
        </div>

        <!-- Tile 8 -->
        <div class="tile t-gold" style="border-bottom:none">
            <div class="t-head">
                <div class="t-ico">⚖️</div>
                <div class="t-lbl">خادم کو خالص ادائیگی <span class="t-info" onclick="app.showInfo('خادم کو خالص ادائیگی', 'یہ رقم خادم حسین کو دی جانے والی کل زمین کی قیمت (${num(baseData.landValue)}) میں سے وہ کرایہ منفی کر کے نکالی گئی ہے جو خادم نے خاندان کو ادا کرنا تھا (${num(baseData.totalPendingRent)})۔ یعنی ${num(baseData.landValue)} - ${num(baseData.totalPendingRent)} = ${pkr(baseData.specialPaymentToKhadim)}۔')">ℹ️</span></div>
            </div>
            <div class="t-val" style="direction:ltr;text-align:right">${baseData.specialPaymentToKhadim < 0 ? '-' : ''}${pkr(Math.abs(baseData.specialPaymentToKhadim))}</div>
            <div class="t-sub" style="text-align:right">${num(baseData.landValue)} زمین - ${num(baseData.totalPendingRent)} بقایا کرایہ</div>
        </div>
    </div>


    <!-- OPTION 1 SECTION -->
    <div class="card-hdr-clean">
        <h2>👨‍👩‍👧‍👦 &nbsp;&nbsp; خاندانی ممبران — مختصر خلاصہ (Option 1 کے مطابق) <span class="t-info" style="margin-right:10px" onclick="app.showInfo('طریقہ 1: موجودہ معاہدہ', '${escapeHtml(historyText1)}')">ℹ️</span></h2>
    </div>
    <div class="mem-grid">
        ${membersHtml1}
    </div>

    <!-- Details Table Option 1 -->
    <div class="table-container">
        <h3 style="justify-content:space-between">
            <span>🏡 طریقہ 1: بھائیوں کی زمین و کرایہ حیثیت (موجودہ معاہدہ)</span>
            <span class="t-info" onclick="app.showInfo('جدول کی تفصیل (طریقہ 1)', 'یہ جدول پرانے معاہدے پر مبنی ہے جہاں 6 کنال زمین کی طے شدہ قیمت (${num(baseData.landValue)}) استعمال کی گئی ہے۔<br><br>• <b>زمین کا حصہ:</b> ہر بھائی کو زمین کی مد میں خادم حسین کو یہ رقم ادا کرنی ہے۔<br>• <b>بقایا کرایہ:</b> کل کرائے میں سے وصول شدہ نکال کر خادم نے ہر بھائی کو یہ رقم دینی ہے۔<br>• <b>قابل ادا:</b> زمین کے حصے میں سے بقایا کرایہ تفریق کیا گیا ہے۔ اگر رقم منفی میں ہے تو خادم کا کرایہ زیادہ بنتا ہے اور خادم اضافی رقم دے گا۔')">ℹ️</span>
        </h3>
        <div class="tw">
            <table class="tbl">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>بھائی کا نام</th>
                        <th>زمین کا حصہ</th>
                        <th>کل کرایہ</th>
                        <th>وصول شدہ</th>
                        <th>بقایا کرایہ</th>
                        <th>قابل ادا</th>
                        <th>ادا شدہ</th>
                        <th>بقایا</th>
                        <th>حیثیت</th>
                    </tr>
                </thead>
                <tbody>
                    ${table1Rows}
                    <tr class="tot">
                        <td colspan="2">کل مجموعہ</td>
                        <td class="n">${num(baseData.landValue)}</td>
                        <td class="n">${num(calcData.brotherBase.rent * 9)}</td>
                        <td class="n">${num(baseData.totalReceivedRent)}</td>
                        <td class="n">${num(baseData.totalPendingRent)}</td>
                        <td class="n">${num(baseData.specialPaymentToKhadim)}</td>
                        <td class="n">0</td>
                        <td class="n">${num(baseData.specialPaymentToKhadim)}</td>
                        <td>-</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="table-expl">
            <p><strong>طریقہ 1 کی مکمل تاریخ اور وضاحت:</strong></p>
            <p>${historyText1}</p>
        </div>
    </div>

    <br><hr style="border:none;border-top:2px dashed var(--g300);margin:30px 0;"><br>

    <!-- OPTION 2 SECTION -->
    <div class="card-hdr-clean">
        <h2>👨‍👩‍👧‍👦 &nbsp;&nbsp; خاندانی ممبران — مختصر خلاصہ (Option 2 کے مطابق) <span class="t-info" style="margin-right:10px" onclick="app.showInfo('طریقہ 2: پلاٹ منافع (شرعی اصول)', '${escapeHtml(historyText2)}')">ℹ️</span></h2>
    </div>
    <div class="mem-grid">
        ${membersHtml2}
    </div>

    <!-- Details Table Option 2 -->
    <div class="table-container">
        <h3 style="justify-content:space-between">
            <span>📈 طریقہ 2: انویسٹمنٹ اور کرائے پر پلاٹ منافع (شرعی اصول)</span>
            <span class="t-info" onclick="app.showInfo('جدول کی تفصیل (طریقہ 2)', 'یہ جدول انصاف اور شرعی اصول پر مبنی ہے۔<br><br>• <b>پلاٹ کا حصہ:</b> خادم کی 2017 کی انویسٹمنٹ کو آج کے پلاٹ کی قیمت میں اضافے کے حساب سے بڑھایا گیا ہے۔<br>• <b>کرایہ منافع کیساتھ:</b> جو کرایہ جس سال خادم کے پاس جمع ہوا، اس پر بھی پلاٹ کا وہی منافع لگا کر آج کی ویلیو نکالی گئی ہے۔ اس سے بھائیوں کو ان کے رکے ہوئے کرائے پر بہترین فائدہ ملتا ہے۔')">ℹ️</span>
        </h3>
        <div class="tw">
            <table class="tbl">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>بھائی کا نام</th>
                        <th>پلاٹ کا حصہ</th>
                        <th>کل کرایہ (منافع کے ساتھ)</th>
                        <th>وصول شدہ</th>
                        <th>بقایا کرایہ</th>
                        <th>قابل ادا (زمین)</th>
                        <th>ادا شدہ</th>
                        <th>بقایا</th>
                        <th>حیثیت</th>
                    </tr>
                </thead>
                <tbody>
                    ${table2Rows}
                    <tr class="tot">
                        <td colspan="2">کل مجموعہ</td>
                        <td class="n">-</td>
                        <td class="n">${num(calcData2.brotherBase.rent * 9)}</td>
                        <td class="n">${num(baseData.totalReceivedRent)}</td>
                        <td class="n">${num((calcData2.brotherBase.rent * 9) - baseData.totalReceivedRent)}</td>
                        <td class="n">${num(baseData.specialPaymentToKhadim)}</td>
                        <td class="n">0</td>
                        <td class="n">-</td>
                        <td>-</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="table-expl">
            <p><strong>طریقہ 2 کی مکمل تاریخ اور شرعی اصول:</strong></p>
            <p>${historyText2}</p>
        </div>
    </div>
    `;
}

// ... keeping other functions exactly the same ...
export function renderRent(config, calcDataAll, baseData, ledgers) {
    let s1 = calcDataAll.s1;
    let s2 = calcDataAll.s2;

    let totalMonthly = 0;
    let totalTotal = 0;
    let totalMother = 0;
    let totalRemaining = 0;
    let totalBrother = 0;

    let rentRows = config.rent.years.map(y => {
        let totalForYear = y.monthly * y.months;
        let motherShare = totalForYear / 8;
        let remaining = totalForYear - motherShare;
        let brotherShare = remaining / 10;
        
        totalMonthly += y.monthly;
        totalTotal += totalForYear;
        totalMother += motherShare;
        totalRemaining += remaining;
        totalBrother += brotherShare;

        return `
        <tr>
            <td class="n" style="background:var(--gb);color:var(--gd);font-weight:bold;">${y.year}</td>
            <td class="n" style="color:var(--blu);font-weight:bold;">${num(y.monthly)}</td>
            <td class="n">${y.months}</td>
            <td class="n" style="background:var(--glt);color:var(--gdk);font-weight:bold;">${num(totalForYear)}</td>
            <td class="n" style="background:#FDF2F8;color:#BE185D;">${num(motherShare)}</td>
            <td class="n">${num(remaining)}</td>
            <td class="n" style="color:#15803D;font-weight:bold;">${num(brotherShare)}</td>
            <td class="n">${y.months} ماہ ${y.year===2026?'(2026)':''}</td>
        </tr>`;
    }).join('');

    // --- Second Table: Members Rent Detail ---
    let allMembers = [...config.family.brothers, ...config.family.sisters, config.family.mother];
    let memberRows = '';
    let sumBaseAdjusted = 0, sumProfit = 0, sumTotalRemaining = 0;

    allMembers.forEach((m, idx) => {
        const isMother = m.id === 'mother';
        const isSister = m.id.startsWith('sister');
        const isBrother = !isMother && !isSister;

        let baseRent = 0;
        let rentWithProfit = 0;

        if (isMother) {
            baseRent = s1.mother.rent;
            rentWithProfit = s2.mother.rent;
        } else if (isSister) {
            baseRent = s1.sisters.rent;
            rentWithProfit = s2.sisters.rent;
        } else {
            baseRent = s1.brotherBase.rent;
            rentWithProfit = s2.brotherBase.rent;
            if (m.isAdmin) {
                // Khadim keeps the rent he owes to himself? 
                // Actually, in our calc, Khadim owes rent to family. But as a family member, his share of the rent is deducted from what he owes.
                // We'll show his share clearly.
                baseRent = s1.brotherBase.rent;
                rentWithProfit = s2.brotherBase.rent;
            }
        }

                let profit = rentWithProfit - baseRent;
        let profitRate = baseRent > 0 ? ((profit / baseRent) * 100).toFixed(1) : 0;
        
        let ledger = ledgers[m.id] || [];
        let tDebit=0, tCredit=0, rDebit=0, rCredit=0;
        ledger.forEach(tx => {
            let d = parseInt(String(tx.debit||'').replace(/,/g, '')) || 0;
            let c = parseInt(String(tx.credit||'').replace(/,/g, '')) || 0;
            tDebit += d; tCredit += c;
            if (tx.type === 'rent') { rDebit += d; rCredit += c; }
        });
        
        let durust = tCredit - tDebit;
        let rentJuma = rCredit - rDebit;
        let cashWithdrawn = rentJuma - durust;
        
        let finalPayableBase = baseRent - cashWithdrawn;
        let totalRemaining = finalPayableBase + profit;
        
        if (m.isAdmin) {
            finalPayableBase = 0;
            totalRemaining = 0;
        }

        // Generate Year-by-Year breakdown for Modal
        let memberYearBreakdown = `
        <div style="max-height:60vh;overflow-y:auto;direction:rtl">
        <div style="background:#fefce8; border:1px solid #fef08a; padding:12px; border-radius:6px; margin-bottom:15px; font-size:14px; color:#854d0e;">
            <strong>💡 منافع اتنا زیادہ کیوں ہے؟ (وضاحت)</strong><br>
            جو کرایہ 2017 میں خادم کے پاس جمع ہوا، وہ 9 سال تک پلاٹ میں انویسٹڈ رہا۔ 2017 میں پلاٹ کی قیمت 93 لاکھ تھی جو اب 4.25 کروڑ ہے (یعنی <b>4.57 گنا</b> اضافہ)۔ 
            اس لیے 2017 کے کرائے کو <b>4.57</b> سے ضرب دی گئی ہے۔ مثلاً: 19,950 × 4.57 = 91,169 روپے۔ ہر سال کا ملٹی پلائر اس کے رکے ہوئے عرصے کے حساب سے کم ہوتا جاتا ہے۔
        </div>
        <p style="margin-top:0;margin-bottom:15px;color:var(--g600);font-size:14px;">یہ جدول ${m.name} کے کرائے کا سال بہ سال حساب دکھاتا ہے کہ ہر سال کی رکی ہوئی رقم پر کتنا منافع (Capital Gain) ملا۔</p>
        <table class="tbl" style="width:100%;font-size:14px;border:1px solid var(--g200)">
            <thead>
                <tr>
                    <th style="background:var(--gd);color:white;padding:10px">سال</th>
                    <th style="background:var(--gd);color:white;padding:10px">بنیادی حصہ</th>
                    <th style="background:var(--gd);color:white;padding:10px">منافع کے ساتھ ویلیو</th>
                    <th style="background:var(--gd);color:white;padding:10px">خالص منافع</th>
                </tr>
            </thead>
            <tbody>
        `;
        let totalB = 0, totalP = 0, totalNet = 0;
        s2.rentByYear.forEach(y => {
            let yBase = 0, yProfit = 0;
            if (isMother) {
                yBase = y.base / 8;
                yProfit = y.withProfit / 8;
            } else if (isSister) {
                yBase = (y.base - (y.base/8)) / 20;
                yProfit = (y.withProfit - (y.withProfit/8)) / 20;
            } else {
                yBase = (y.base - (y.base/8)) / 10;
                yProfit = (y.withProfit - (y.withProfit/8)) / 10;
            }
            let net = yProfit - yBase;
            totalB += yBase; totalP += yProfit; totalNet += net;
            memberYearBreakdown += `
                <tr>
                    <td class="n" style="padding:10px;background:var(--w)">${y.year}</td>
                    <td class="n" style="padding:10px;background:var(--w)">${num(yBase)}</td>
                    <td class="n" style="padding:10px;background:var(--w);color:var(--blu)">${num(yProfit)}</td>
                    <td class="n" style="color:var(--gm);font-weight:bold;padding:10px;background:var(--gb)">+${num(net)}</td>
                </tr>
            `;
        });
        memberYearBreakdown += `
            <tr style="background:var(--g100);font-weight:bold;border-top:2px solid var(--g300)">
                <td style="padding:12px">کل ٹوٹل</td>
                <td class="n" style="padding:12px">${num(totalB)}</td>
                <td class="n" style="padding:12px;color:var(--blu)">${num(totalP)}</td>
                <td class="n" style="color:var(--gd);padding:12px;font-size:16px">+${num(totalNet)}</td>
            </tr>
            </tbody>
        </table>
        </div>
        `;

        let profitCellHtml = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <span>${num(profit)}</span>
                <span class="t-info" style="margin:0; margin-right:10px; font-size:18px; flex-shrink:0" onclick="app.showInfo('${m.name} کی سال بہ سال منافع تفصیل', '${escapeHtml(memberYearBreakdown.replace(/\n|\r/g, ''))}')">ℹ️</span>
            </div>
        `;

        memberRows += `
        <tr>
            <td class="n">${idx + 1}</td>
            <td style="font-weight:bold">${m.name} ${m.isAdmin?'(نگران)':''}</td>
            <td class="n">${m.isAdmin ? '—' : num(finalPayableBase)}</td>
            <td style="color:var(--gm);font-weight:bold;background:var(--gb);">${profitCellHtml}</td>
            <td class="n" style="color:var(--blu);font-weight:bold;">${profitRate}%</td>
            <td class="n" style="font-weight:bold;color:${m.isAdmin?'var(--g800)':'var(--gd)'}; font-size:16px;">${m.isAdmin ? '—' : num(totalRemaining)}</td>
        </tr>
        `;
            sumBaseAdjusted += (m.isAdmin ? 0 : finalPayableBase);
        sumProfit += profit;
        sumTotalRemaining += (m.isAdmin ? 0 : totalRemaining);
    });

    memberRows += `
        <tr style="background:var(--gd); color:white; font-size:16px; font-weight:bold;">
            <td colspan="2" style="padding:12px; text-align:right;">کل مجموعہ</td>
            <td class="n" style="padding:12px;">${num(sumBaseAdjusted)}</td>
            <td class="n" style="padding:12px;">${num(sumProfit)}</td>
            <td class="n" style="padding:12px;">-</td>
            <td class="n" style="padding:12px; font-size:18px;">${num(sumTotalRemaining)}</td>
        </tr>
    `;

    return `
    <!-- Top General Explanation Box -->
    <div class="card-ex" style="background:#F3E8FF;border-color:var(--pur)">
        <h2 style="color:var(--pur)">ℹ️ کرایہ نامہ کی تفصیلات اور وضاحت</h2>
        <p>یہ صفحہ 1149 گرین ٹاؤن پلاٹ کے تمام سالوں کے کرائے کا مکمل اور تفصیلی حساب پیش کرتا ہے۔ اس میں 2017 سے لے کر 2026 تک ہر سال کے کرائے کی تقسیم کا واضح فارمولا دیا گیا ہے۔</p>
        <p>پہلا ٹیبل سال بہ سال کل کرائے اور والدہ/بھائیوں کے حصے کی وضاحت کرتا ہے، جبکہ دوسرا ٹیبل ہر ممبر کو ملنے والے منافع (Capital Gain / Sharia Profit) اور وصولیوں کی تفصیل دکھاتا ہے۔</p>
    </div>

    <!-- Rent Distribution Table -->
    <div class="table-container">
        <h3 style="background:var(--gd);color:white;justify-content:center;font-size:24px;border:none;">کرایہ تقسیم حساب - تمام سال</h3>
        <div style="background:var(--gp);padding:12px;text-align:center;font-size:16px;color:var(--gd);border-bottom:1px solid var(--gl);">
            <strong>فارمولا:</strong> ماہانہ کرایہ × مہینے = کل کرایہ &nbsp;&nbsp;|&nbsp;&nbsp; والدہ کا حصہ = کل ÷ 8 &nbsp;&nbsp;|&nbsp;&nbsp; ایک بھائی کا حصہ = باقی ÷ 10
        </div>
        <div style="padding:20px;background:var(--w);font-size:15px;line-height:2;color:var(--g800);">
            یہ وہ اصل کرایہ ایگریمنٹ ٹیبل ہے جس میں ہر سال کے کرائے کی مکمل تفصیل دی گئی ہے۔ اس ٹیبل سے یہ واضح ہوتا ہے کہ 2017 سے 2026 تک کل کتنا کرایہ جمع ہوا، اس میں والدہ محترمہ کا حصہ کتنا بنتا ہے، اور ہر ایک بھائی (اور بہن) کے حصے میں کل کتنا کرایہ آیا ہے۔ اسی ٹیبل سے لیے گئے فائنل کرائے <b>(${num(totalBrother)} روپے)</b> کو آخری حساب کے ٹیبل میں استعمال کیا گیا ہے۔
        </div>
        <div class="tw">
            <table class="tbl" style="border-top:1px solid var(--g200)">
                <thead>
                    <tr>
                        <th style="background:var(--w);color:var(--g800);border-bottom:2px solid var(--g200)">سال</th>
                        <th style="background:var(--w);color:var(--g800);border-bottom:2px solid var(--g200)">ماہانہ کرایہ</th>
                        <th style="background:var(--w);color:var(--g800);border-bottom:2px solid var(--g200)">مہینے</th>
                        <th style="background:var(--w);color:var(--g800);border-bottom:2px solid var(--g200)">کل کرایہ</th>
                        <th style="background:var(--w);color:var(--g800);border-bottom:2px solid var(--g200)">والدہ کا حصہ (÷8)</th>
                        <th style="background:var(--w);color:var(--g800);border-bottom:2px solid var(--g200)">باقی کرایہ</th>
                        <th style="background:var(--w);color:var(--g800);border-bottom:2px solid var(--g200)">ایک بھائی کا حصہ<br>(÷10)</th>
                        <th style="background:var(--w);color:var(--g800);border-bottom:2px solid var(--g200)">نوٹ</th>
                    </tr>
                </thead>
                <tbody>
                    ${rentRows}
                    <tr class="tot" style="background:var(--gd)!important;color:white!important;font-size:18px;">
                        <td colspan="3" style="text-align:left;background:var(--gd)!important;">کل مجموعہ</td>
                        <td class="n" style="background:var(--gd)!important;">${num(totalTotal)}</td>
                        <td class="n" style="background:var(--gd)!important;">${num(totalMother)}</td>
                        <td class="n" style="background:var(--gd)!important;">${num(totalRemaining)}</td>
                        <td class="n" style="background:var(--gd)!important;">${num(totalBrother)}</td>
                        <td style="background:var(--gd)!important;">-</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div style="background:var(--gp);padding:12px;text-align:center;font-size:13px;color:var(--gd);">
            نوٹ: نیلی رقم = ماہانہ کرایہ (ان پٹ) | سبز = ایک بھائی کا حصہ | گلابی = والدہ کا حصہ | 2026 = 10 ماہ کا حساب
        </div>
    </div>

        <!-- ════ NEW TABLE: Fixed Rent Final Adjustment ════ -->
        <br>
    <div class="table-container">
        <h3 style="background:var(--gd);color:white;justify-content:center;font-size:24px;border:none;">طے شدہ فکسڈ کرائے کے مطابق کھاتوں کی حتمی ایڈجسٹمنٹ</h3>
            
            <div style="background-color: var(--blt); padding: 15px 20px; border-bottom: 1px solid #bfdbfe; font-size: 15px; line-height: 1.8; color: #1e3a8a;">
                <strong style="font-size:17px;">📌 اس ٹیبل کا مقصد کیا ہے اور یہ کیسے کام کرتا ہے؟</strong><br />
                
                <p style="margin-top: 10px; margin-bottom: 10px; text-align: justify;">
                    کھاتے کے موجودہ بیلنس میں کرایہ اور نقد لین دین دونوں مکس تھے۔ اس ٹیبل کا واحد مقصد یہ نکالنا ہے کہ <b>ہر ممبر نے خادم سے خالص کتنا نقد وصول کیا ہے؟</b> تاکہ اس نقد وصولی کو نئے فکسڈ کرائے میں سے منہا (مائنس) کیا جا سکے۔
                </p>

                <p style="margin-top: 10px; margin-bottom: 10px; text-align: justify; background-color:#eff6ff; padding:10px; border-radius:6px; border-left:4px solid #3b82f6;">
                    <b>ریاضی کا اصول:</b> جب خادم کرایہ کھاتے میں <b>جمع</b> کرتا تھا تو بیلنس بڑھتا تھا، اور جب کوئی ممبر رقم <b>نکلواتا</b> تھا تو بیلنس کم ہوتا تھا۔<br>
                    اس کا مطلب ہے کہ اگر ہم جمع شدہ کل کرائے (B) میں سے نکلوائی گئی رقم (C) مائنس کریں، تو ہمارے پاس موجودہ بقایا (A) بچنا چاہیے۔ یعنی <b>(A = B ➖ C)</b>۔
                </p>

                <strong style="font-size:16px; display:inline-block; margin-top:10px;">📊 کالمز کی تفصیلی وضاحت:</strong>
                <ul style="margin-top: 5px; margin-bottom: 0; padding-right:20px;">
                    <li style="margin-bottom:5px;"><b>(A) درست شدہ بقایا:</b> کھاتے کا موجودہ فائنل بیلنس (یعنی آج کی تاریخ تک کھاتے کے مطابق خادم کے ذمے کتنے پیسے بنتے ہیں)۔</li>
                    <li style="margin-bottom:5px;"><b>(B) درج کل کرایہ:</b> کھاتے میں آج تک کرائے کی مد میں کتنی رقم جمع کی گئی تھی۔</li>
                    <li style="margin-bottom:5px;"><b>(C) نقد کٹوتی:</b> یہ وہ رقم ہے جو ممبر نے خادم سے نقد کی صورت میں نکلوائی۔ چونکہ (A = B - C) ہوتا ہے، اس لیے ہم نے نقد کٹوتی معلوم کرنے کے لیے <b>(C = B - A)</b> کا فارمولا لگایا۔</li>
                    <li style="margin-bottom:5px;"><b>(D) کل فکسڈ کرایہ:</b> یہ آپ کا وہ نیا طے شدہ فکسڈ کرایہ ہے جو سب کا برابر ہے (بغیر منافع)۔</li>
                    <li style="margin-bottom:5px;"><b>(D ➖ C) حتمی بقایا:</b> یہ آپ کا اصل فائنل حساب ہے! آپ کے نئے فکسڈ کرائے (D) میں سے وہ نقد رقم کاٹ لی گئی ہے جو آپ پہلے ہی نکلوا چکے تھے (C)۔</li>
                </ul>
            </div>

            <div class="tw">
                <table class="tbl" style="margin:0;">
                    <thead>
                        <tr>
                            <th style="background:#f1f5f9;color:#1e40af;padding:12px;">نام</th>
                            <th style="background:#f8fafc;color:#334155;padding:12px;">درست شدہ بقایا<br><small style="font-weight:normal;color:#64748b">(A)</small></th>
                            <th style="background:#fef2f2;color:#991b1b;padding:12px;">درج کل کرایہ ℹ️<br><small style="font-weight:normal;color:#ef4444">(B)</small></th>
                            <th style="background:#fefce8;color:#854d0e;padding:12px;">نقد کٹوتی ℹ️<br><small style="font-weight:normal;color:#ca8a04">(C = B - A)</small></th>
                            <th style="background:#f0fdf4;color:#16a34a;padding:12px;">کل فکسڈ کرایہ<br><small style="font-weight:normal;color:#22c55e">(D)</small></th>
                            <th style="background:#e0e7ff;color:#3730a3;padding:12px;">حتمی بقایا<br><small style="font-weight:normal;color:#6366f1">(D - C)</small></th>
                        </tr>
                    </thead>
                    <tbody>
                        ${(() => {
        let sumA = 0, sumB = 0, sumC = 0, sumD = 0, sumFinal = 0;
        let rows = allMembers.map((m, i) => {
            let ledger = ledgers[m.id] || [];
            let tDebit=0, tCredit=0, rDebit=0, rCredit=0;
            ledger.forEach(tx => {
                let d = parseInt(String(tx.debit||'').replace(/,/g, '')) || 0;
                let c = parseInt(String(tx.credit||'').replace(/,/g, '')) || 0;
                tDebit += d; tCredit += c;
                if (tx.type === 'rent') { rDebit += d; rCredit += c; }
            });
            
            let durust = tCredit - tDebit; // A
            let rentJuma = rCredit - rDebit; // B
            let cashWithdrawn = rentJuma - durust; // C = B - A
            
            let isMother = m.id === 'mother';
            let isSister = m.id.startsWith('sister');
            let newRent = isMother ? s1.mother.rent : (isSister ? s1.sisters.rent : s1.brotherBase.rent); // D
            if (m.isAdmin) newRent = 0;
            
            let finalPayable = newRent - cashWithdrawn; // D - C
            
            sumA += durust;
            sumB += rentJuma;
            sumC += cashWithdrawn;
            sumD += newRent;
            sumFinal += finalPayable;
            
            return `
            <tr style="background:${i%2===0 ? '#fff' : '#f8fafc'}; border-bottom:1px solid #e2e8f0;">
                <td style="padding:12px;font-weight:bold;">${i+1}. ${m.name}</td>
                <td class="n" style="padding:12px;">${num(durust)}</td>
                <td class="n" style="padding:12px;color:#b91c1c;cursor:pointer;background:#FEF2F2;" onclick="app.showInfo('${m.name} - کرایہ ریکارڈ', window.generateLedgerTable('${m.id}', 'rent'))">
                    ${num(rentJuma)}
                </td>
                <td class="n" style="padding:12px;color:#854d0e;font-weight:bold;cursor:pointer;background:#FEFCE8;" onclick="app.showInfo('${m.name} - نقد لین دین', window.generateLedgerTable('${m.id}', 'cash'))">
                    ${num(cashWithdrawn)} ${cashWithdrawn < 0 ? '<br><span style="font-size:11px;font-weight:normal;color:#16a34a">(خادم سے نقد جمع کروایا)</span>' : ''}
                </td>
                <td class="n" style="padding:12px;color:#16a34a;">${num(newRent)}</td>
                <td class="n" style="padding:12px;color:#3730a3;font-size:18px;font-weight:bold;background:#e0e7ff;">${num(finalPayable)}</td>
            </tr>
            `;
        }).join('');
        
        return rows + `
            <tr style="background:var(--gd); color:white; font-size:16px; font-weight:bold;">
                <td style="padding:12px; text-align:right;">کل مجموعہ</td>
                <td class="n" style="padding:12px;">${num(sumA)}</td>
                <td class="n" style="padding:12px;">${num(sumB)}</td>
                <td class="n" style="padding:12px;">${num(sumC)}</td>
                <td class="n" style="padding:12px;">${num(sumD)}</td>
                <td class="n" style="padding:12px; font-size:18px;">${num(sumFinal)}</td>
            </tr>
        `;
    })()}
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Profit Distribution Table -->
    <br>
    <div class="table-container">
        <h3 style="background:var(--gm);color:white;justify-content:center;font-size:22px;border:none;">خاندانی ممبران کے کرائے کی تفصیل (کرایہ وصولی اور منافع)</h3>
        <div style="background-color: #f8fafc; padding: 15px 20px; border-bottom: 1px solid #cbd5e1; font-size: 15px; line-height: 1.8; color: #334155;">
            <strong style="font-size:17px; color:var(--gm);">📌 اس ٹیبل کا مقصد کیا ہے اور یہ کیسے کام کرتا ہے؟</strong><br />
            <p style="margin-top: 10px; margin-bottom: 5px; text-align: justify;">
                یہ کھاتے کا <b>حتمی اور آخری ٹیبل</b> ہے جس میں تمام ممبران کے <b>حتمی فکسڈ بقایا</b> (جو پچھلے ٹیبل میں سے نکلا ہے) میں ان کا <b>جائز منافع (Capital Gain)</b> شامل کر کے فائنل ادائیگی کی رقم بتائی گئی ہے۔
            </p>
            <ul style="margin-top: 5px; margin-bottom: 0; padding-right:20px;">
                <li><b>حتمی فکسڈ بقایا (D - C):</b> یہ آپ کا اصل بقایا ہے جس میں سے آپ کے نکالے گئے پیسے پہلے ہی کاٹے جا چکے ہیں۔</li>
                <li><b>کرائے پر منافع (Capital Gain):</b> چونکہ خادم کے پاس رکا ہوا کرایہ پلاٹ میں ہی انویسٹڈ رہا، اس لیے کرائے پر اسی شرح سے منافع لگایا گیا ہے جس شرح سے پلاٹ کی قیمت میں اضافہ ہوا۔</li>
                <li><b>نیٹ بقایا وصولی:</b> یہ وہ فائنل رقم ہے جو خادم کی طرف سے خاندان کے ہر ممبر کو ادا کی جائے گی۔</li>
            </ul>
        </div>
        <div style="padding:20px;background:var(--w);font-size:15px;line-height:2;color:var(--g800);border-bottom:1px solid var(--g200);">
            یہ ٹیبل ہر ممبر کے ذاتی کھاتے کی تفصیل بتاتا ہے۔ چونکہ کرایہ سالوں تک رکا رہا، اس لیے شرعی اصول (طریقہ 2) کے تحت ہر ممبر کو اس کے کرائے پر <b>پلاٹ کی قدر میں اضافے (Capital Gain)</b> کے حساب سے منافع دیا گیا ہے۔<br>
            مثال کے طور پر: اگر کسی بھائی کا کل بنیادی کرایہ ${num(s1.brotherBase.rent)} بنتا تھا، تو پلاٹ کا منافع لگنے کے بعد اسے <b>${num(s2.brotherBase.rent - s1.brotherBase.rent)}</b> روپے کا خالص فائدہ (Profit) مل رہا ہے!
        </div>
        <div class="tw">
            <table class="tbl">
                <thead>
                    <tr>
                        <th style="background:var(--w);color:var(--g800);border-bottom:2px solid var(--gm)">#</th>
                        <th style="background:var(--w);color:var(--g800);border-bottom:2px solid var(--gm)">ممبر کا نام</th>
                        <th style="background:var(--w);color:var(--g800);border-bottom:2px solid var(--gm)">حتمی فکسڈ بقایا<br>(D - C)</th>
                        <th style="background:var(--w);color:var(--g800);border-bottom:2px solid var(--gm)">
                            کرائے پر منافع<br>(Capital Gain)
                            <span class="t-info" style="margin-right:5px;font-size:14px" onclick="app.showInfo('کرائے پر منافع کا حساب', 'یہ منافع اس بات پر مبنی ہے کہ جو کرایہ جس سال خادم کے پاس جمع ہوا، اس کی آج (2026) میں کیا قیمت ہے۔<br><br>پلاٹ کی قیمت 2017 سے لے کر آج تک جس رفتار سے بڑھی ہے (تقریباً 18.4 فیصد سالانہ)، کرائے کی رکی ہوئی رقم کو بھی اسی حساب سے ضرب دی گئی ہے۔<br>مثلاً: 2017 کا کرایہ جو آج تک رکا رہا، اس پر 9 سالوں کا منافع لگایا گیا ہے۔')">ℹ️</span>
                        </th>
                        <th style="background:var(--w);color:var(--g800);border-bottom:2px solid var(--gm)">منافع کی شرح</th>
                        <th style="background:var(--w);color:var(--g800);border-bottom:2px solid var(--gm)">نیٹ بقایا وصولی<br>(بقایا + منافع)</th>
                    </tr>
                </thead>
                <tbody>
                    ${memberRows}
                </tbody>
            </table>
        </div>
        <div class="table-expl">
            <p><strong>کرائے پر منافع (Capital Gain) کیسے حساب کیا گیا؟</strong></p>
            <p>یہ منافع اس شرعی اور منطقی اصول پر مبنی ہے کہ پیسے کی قدر وقت کے ساتھ گرتی ہے (Inflation)۔ جو کرایہ جس سال خادم کے پاس جمع ہوا، اگر اسے اسی وقت خاندانی ممبران میں تقسیم کر دیا جاتا تو وہ اسے کہیں انویسٹ کر سکتے تھے۔</p>
            <ul>
                <li>چونکہ کرائے کی رقم پلاٹ سے ہی آ رہی ہے، اس لیے <b>کرائے کو بھی پلاٹ ہی کا حصہ مان کر</b> اسے اسی رفتار سے بڑھایا گیا ہے جس رفتار سے پلاٹ کی قیمت بڑھی ہے۔</li>
                <li>پلاٹ کی قیمت 2017 سے لے کر آج تک <b>تقریباً 18.4 فیصد سالانہ</b> کے حساب سے بڑھی ہے۔</li>
                <li>اس طریقے (طریقہ 2) میں خادم کے پاس رکے ہوئے ہر سال کے کرائے کو 18.4% سالانہ کے حساب سے ضرب دے کر آج (2026) کی ویلیو نکالی گئی ہے۔ اس طرح خاندان کو ان کے رکے ہوئے پیسوں پر بہترین اور منصفانہ منافع مل رہا ہے!</li>
                <li><b>کرائے کے اتار چڑھاؤ کا حساب:</b> ابتدائی سالوں میں کرایہ کم تھا لیکن وہ رقم زیادہ عرصے تک رکی رہی، جبکہ آخری سالوں میں کرایہ زیادہ تھا لیکن وہ کم عرصے کے لیے رکا۔ ہمارا کیلکولیٹر اوسط (Average) نکالنے کے بجائے <b>ہر سال کے کرائے کا الگ الگ کمپاؤنڈ (Compound) حساب</b> کرتا ہے۔ اس طرح کم یا زیادہ کرائے کا فرق خودکار طریقے سے بالکل درست اور 100 فیصد شفافیت کے ساتھ حل ہو جاتا ہے۔</li>
            </ul>

            <!-- Practical Example Section -->
            <div style="background:var(--w); padding:20px; border-radius:8px; margin-top:20px; border-right:4px solid var(--gm); box-shadow:0 2px 4px rgba(0,0,0,0.05);">
                <h4 style="color:var(--gd); margin-top:0; font-size:18px;">🧮 عملی مثال: صرف سال 2017 کے کرائے پر ایک بھائی کا منافع</h4>
                <p>آئیے سمجھیں کہ کیلکولیٹر نے <b>صرف سال 2017</b> کے کرائے پر ایک حصہ دار بھائی (مثلاً غلام اصغر) کا منافع کس طرح نکالا (کراس ویریفکیشن کے لیے):</p>
                
                <div style="display:flex; flex-direction:column; gap:12px; font-family:Arial, sans-serif; direction:rtl; text-align:right; background:var(--g50); padding:20px; border-radius:6px; font-size:15px; border:1px solid var(--g200);">
                    <div style="display:flex; justify-content:space-between; border-bottom:1px dashed var(--g300); padding-bottom:8px;">
                        <span>1. سال 2017 کا کل کرایہ (بغیر منافع):</span>
                        <strong style="direction:ltr;text-align:right">Rs. ${num(s2.rentByYear[0].base)}</strong>
                    </div>
                    <div style="display:flex; justify-content:space-between; border-bottom:1px dashed var(--g300); padding-bottom:8px;">
                        <span>2. ایک بھائی کا 2017 کا حصہ: <br><small style="color:var(--g400)">(کل کرایہ - والدہ کا 1/8 حصہ) ÷ 10</small></span>
                        <strong style="direction:ltr;text-align:right">Rs. ${num((s2.rentByYear[0].base - (s2.rentByYear[0].base/8))/10)}</strong>
                    </div>
                    <div style="display:flex; justify-content:space-between; border-bottom:1px dashed var(--g300); padding-bottom:8px;">
                        <span>3. پلاٹ کی قدر کا منافع ملٹی پلائر (2017 تا 2026):<br><small style="color:var(--g400)">2017 میں پلاٹ کی مالیت تقریباً 93 لاکھ تھی، آج 4.25 کروڑ ہے۔ (4.25 کروڑ ÷ 93 لاکھ = 4.569)</small></span>
                        <strong style="color:var(--gm); direction:ltr;text-align:right">x ${(s2.rentByYear[0].withProfit / s2.rentByYear[0].base).toFixed(2)}</strong>
                    </div>
                    <div style="display:flex; justify-content:space-between; border-bottom:1px dashed var(--g300); padding-bottom:8px; background:#fefce8; padding:10px; border-radius:6px; margin:5px 0;">
                        <span>4. بھائی کے 2017 کے حصے کی آج (2026) میں قیمت:<br><small style="color:var(--g400)">حساب: Rs. ${num((s2.rentByYear[0].base - (s2.rentByYear[0].base/8))/10)} × ${(s2.rentByYear[0].withProfit / s2.rentByYear[0].base).toFixed(2)} ملٹی پلائر</small></span>
                        <strong style="color:var(--blu); font-size:17px; direction:ltr;text-align:right">Rs. ${num((s2.rentByYear[0].withProfit - (s2.rentByYear[0].withProfit/8))/10)}</strong>
                    </div>
                    <div style="display:flex; justify-content:space-between;">
                        <span>5. صرف 2017 کے کرائے پر ایک بھائی کا خالص منافع (Capital Gain):</span>
                        <strong style="color:var(--gd); direction:ltr;text-align:right">Rs. ${num(((s2.rentByYear[0].withProfit - (s2.rentByYear[0].withProfit/8))/10) - ((s2.rentByYear[0].base - (s2.rentByYear[0].base/8))/10))}</strong>
                    </div>
                </div>
                
                <p style="margin-top:15px; margin-bottom:0;">اس ایک سال کی مثال سے ثابت ہوتا ہے کہ بھائی کا <b>${num((s2.rentByYear[0].base - (s2.rentByYear[0].base/8))/10)}</b> روپے جو 9 سال تک رکا رہا، اب پلاٹ کے اضافے کے ساتھ بڑھ کر <b>${num((s2.rentByYear[0].withProfit - (s2.rentByYear[0].withProfit/8))/10)}</b> بن چکا ہے۔ ہمارا کیلکولیٹر اسی طرح 2018، 2019 اور ہر سال کا الگ الگ حساب کر کے تمام بھائیوں کے کھاتے مکمل شفافیت کے ساتھ کراس ویریفائی (Cross Verify) کرتا ہے۔</p>
            </div>
        </div>

    `;
}

// ════ HELPER FUNCTION FOR MODALS ════
window.generateLedgerTable = function(memberId, type) {
    if (!window.app || !window.app.ledgers) return 'ڈیٹا دستیاب نہیں';
    let ledger = window.app.ledgers[memberId] || [];
    let filtered = type === 'all' ? ledger : ledger.filter(l => l.type === type);
    
    if (filtered.length === 0) {
        return '<div style="text-align:center;padding:30px;color:#94a3b8;">اس ممبر کا کوئی ' + (type==='rent'?'کرایہ':'نقد') + ' ریکارڈ نہیں ملا</div>';
    }

    let totalCredit = 0;
    let totalDebit = 0;
    
    let rows = filtered.map((l, i) => {
        let cr = parseInt(String(l.credit||'0').replace(/,/g, '')) || 0;
        let db = parseInt(String(l.debit||'0').replace(/,/g, '')) || 0;
        totalCredit += cr;
        totalDebit += db;
        
        return `
        <tr style="background:${i%2===0 ? '#fff' : '#f8fafc'}; border-bottom:1px solid #e2e8f0;">
            <td style="padding:10px;text-align:center;font-weight:bold;color:#64748b;">${l.id}</td>
            <td style="padding:10px;color:#475569;white-space:nowrap;">${l.date}</td>
            <td style="padding:10px;color:#1e293b;">${l.description}</td>
            <td style="padding:10px;color:#16a34a;font-weight:bold;text-align:left;" dir="ltr">${cr ? num(cr) : '-'}</td>
            <td style="padding:10px;color:#dc2626;text-align:left;" dir="ltr">${db ? num(db) : '-'}</td>
        </tr>
        `;
    }).join('');

    return `
    <div style="max-height: 60vh; overflow-y: auto; direction:rtl;">
        <table style="width:100%; border-collapse:collapse; font-size:14px; border:1px solid #cbd5e1;">
            <thead>
                <tr style="background:#334155; color:white;">
                    <th style="padding:10px; width:50px;">نمبر</th>
                    <th style="padding:10px; width:90px;">تاریخ</th>
                    <th style="padding:10px;">تفصیل</th>
                    <th style="padding:10px;">جمع (Credit)</th>
                    <th style="padding:10px;">نام (Debit)</th>
                </tr>
            </thead>
            <tbody>
                ${rows}
            </tbody>
            <tfoot>
                <tr style="background:#f1f5f9; font-weight:bold; border-top:2px solid #cbd5e1;">
                    <td colspan="3" style="padding:10px;text-align:left;">کل میزان:</td>
                    <td style="padding:10px;color:#16a34a;text-align:left;" dir="ltr">${num(totalCredit)}</td>
                    <td style="padding:10px;color:#dc2626;text-align:left;" dir="ltr">${num(totalDebit)}</td>
                </tr>
                ${(() => {
                    let net = totalCredit - totalDebit;
                    let isCredit = net >= 0;
                    let absNet = Math.abs(net);
                    let title = type === 'cash' ? 'خالص نقد بیلنس:' : 'خالص کرایہ بیلنس:';
                    let typeText = isCredit ? '<span style="color:#16a34a;">جمع (Credit)</span>' : '<span style="color:#dc2626;">نام (Debit)</span>';
                    
                    return `
                    <tr style="background:#e2e8f0; font-weight:bold; font-size:15px;">
                        <td colspan="3" style="padding:12px;text-align:left;color:#0f172a;">${title}</td>
                        <td colspan="2" style="padding:12px;text-align:center;color:#0f172a;" dir="ltr">${num(absNet)} ${typeText}</td>
                    </tr>
                    `;
                })()}
            </tfoot>
        </table>
    </div>
    `;
};

export function renderProfitDistribution(config, calcDataAll, baseData) {
    let s1 = calcDataAll.s1;
    let s2 = calcDataAll.s2;
    
    // --- Detailed Status Table (Option 1) ---
    let table1Rows = '';
    config.family.brothers.forEach((b, index) => {
        const plot = b.isAdmin ? s1.khadim.plot : s1.brotherBase.plot;
        const totalRentOwed = b.isAdmin ? s1.khadim.rent : s1.brotherBase.rent;
        const received = b.receivedRent || 0;
        const pendingRent = totalRentOwed - received;
        const landShare = baseData.landPerBrother;
        const totalDueByBrother = landShare - pendingRent; 

        let status = '';
        if (totalDueByBrother > 0) status = '<span class="status-badge" style="color:var(--org);border-color:var(--org)">جزوی</span>'; 
        else if (totalDueByBrother < 0) status = '<span class="status-badge" style="color:var(--gdk);background:var(--glt);border-color:var(--gold)">زیر التواء</span>'; 
        else status = '<span class="status-badge" style="color:var(--gd);background:var(--gp);border-color:var(--gl)">مکمل</span>';

        table1Rows += `
        <tr class="hover-row">
            <td class="n">${index+1}</td>
            <td style="font-weight:bold">${b.name} ${b.isAdmin?'⭐':''}</td>
            <td class="n" style="color:var(--g400)">${num(plot)}</td>
            <td class="n">${num(landShare)}</td>
            <td class="n">${num(totalRentOwed)}</td>
            <td class="n">${num(received)}</td>
            <td class="ng n" style="color:#059669">${num(pendingRent)}</td>
            <td class="nr n" style="color:${totalDueByBrother>0?'#1F2937':'#DC2626'}">${totalDueByBrother < 0 ? '-' : ''}${num(Math.abs(totalDueByBrother))}</td>
            <td>${status}</td>
        </tr>`;
    });

    // --- Detailed Status Table (Option 2) ---
    let table2Rows = '';
    config.family.brothers.forEach((b, index) => {
        const plot = b.isAdmin ? s2.khadim.plot : s2.brotherBase.plot;
        const totalRentOwed = b.isAdmin ? s2.khadim.rent : s2.brotherBase.rent;
        const received = b.receivedRent || 0; 
        const pendingRent = totalRentOwed - received;
        const landShare = baseData.landPerBrother;
        const totalDueByBrother = landShare - pendingRent; 

        let status = '';
        if (totalDueByBrother > 0) status = '<span class="status-badge" style="color:var(--org);border-color:var(--org)">جزوی</span>'; 
        else if (totalDueByBrother < 0) status = '<span class="status-badge" style="color:var(--gdk);background:var(--glt);border-color:var(--gold)">زیر التواء</span>'; 
        else status = '<span class="status-badge" style="color:var(--gd);background:var(--gp);border-color:var(--gl)">مکمل</span>';

        table2Rows += `
        <tr class="hover-row">
            <td class="n">${index+1}</td>
            <td style="font-weight:bold">${b.name} ${b.isAdmin?'⭐':''}</td>
            <td class="n" style="color:var(--g400)">${num(plot)}</td>
            <td class="n">${num(landShare)}</td>
            <td class="n">${num(totalRentOwed)}</td>
            <td class="n">${num(received)}</td>
            <td class="ng n" style="color:#059669">${num(pendingRent)}</td>
            <td class="nr n" style="color:${totalDueByBrother>0?'#1F2937':'#DC2626'}">${totalDueByBrother < 0 ? '-' : ''}${num(Math.abs(totalDueByBrother))}</td>
            <td>${status}</td>
        </tr>`;
    });

    let rentByYearHTML = s2.rentByYear.map(y => `<tr><td class="n">${y.year}</td><td class="n">${num(y.base)}</td><td class="ng n" style="font-weight:bold">${num(y.withProfit)}</td></tr>`).join('');

    return `
    <div class="pgh">
        <div class="pgh-ico">⚖️</div>
        <div>
            <h2>منافع کی تقسیم (Profit Distribution Options)</h2>
            <p>پلاٹ کی فروخت اور رکے ہوئے کرائے پر منافع (Capital Gain) کی تقسیم کے دو مختلف طریقوں کا تفصیلی اور شفاف حساب</p>
        </div>
    </div>
    
    <!-- ======================= OPTION 1 ======================= -->
    <div style="background:var(--w);padding:25px;border-radius:12px;margin-bottom:40px;box-shadow:var(--s2);border:1px solid var(--g200); position:relative; overflow:hidden;">
        <div style="position:absolute; top:0; left:0; right:0; height:4px; background:var(--gd);"></div>
        
        <h2 style="color:var(--gd);margin-top:0;display:flex;align-items:center;gap:10px;">
            <span style="font-size:28px;">📄</span> طریقہ 1: موجودہ معاہدہ (بغیر منافع)
        </h2>
        
        <div class="card-ex" style="background:#f8fafc; border:1px solid #e2e8f0; border-right-color:#94a3b8;">
            <h3 style="margin-top:0; color:#334155;">📖 بنیادی اصول اور وضاحت</h3>
            <p style="color:#475569; font-size:15px; line-height:1.7;">اس طریقے کے مطابق 6 کنال متفقہ زمین بھائی خادم حسین کی ملکیت مانی گئی ہے کیونکہ 2017 میں کزن کو فارغ کرنے کے لیے خادم حسین نے اپنی جیب سے <b>11.02 لاکھ</b> اضافی ادا کیے تھے۔ لہٰذا پلاٹ میں خادم کا حصہ باقی تمام بھائیوں کے بالکل <b>برابر</b> رکھا گیا ہے۔ <b>لیکن</b> اس طریقے کی خامی یہ ہے کہ خاندان کا جو کرایہ 9 سال تک خادم کے پاس رکا رہا، اس پر کوئی منافع (Capital Gain) لاگو نہیں کیا گیا۔ شرعی اور معاشی لحاظ سے پیسے کی وقت کے ساتھ قدر گرتی ہے، اس لیے منافع نہ دینا ناانصافی ہو سکتا ہے۔</p>
            
            <div style="margin-top:15px; padding:15px; background:var(--w); border:1px dashed #cbd5e1; border-radius:8px;">
                <h4 style="margin-top:0; margin-bottom:8px; color:var(--gd);">🧮 ریاضیاتی فارمولہ (ہر بھائی کے خالص حصے کے لیے):</h4>
                <div class="n" style="font-size:16px; direction:ltr; text-align:left; color:#1e293b; background:#f1f5f9; padding:10px; border-radius:6px; overflow-x:auto;">
                    Net Balance = [Land Share (${num(baseData.landPerBrother)})] - [Total Rent Owed - Received Rent]
                </div>
                <p style="margin-top:10px; margin-bottom:0; font-size:13px; color:#64748b;">اگر جواب <b>Positive (+)</b> ہے، تو بھائی نے مزید رقم ادا کرنی ہے۔ اگر جواب <b>Negative (-)</b> ہے، تو بھائی نے رقم وصول کرنی ہے۔</p>
            </div>
        </div>

        <div class="tiles t4" style="margin-top:20px;">
            <div class="tile t-gold"><div class="t-head"><div class="t-ico">🤝</div><div class="t-lbl">فی بھائی زمین حصہ</div></div>
            <div class="t-val">${pkr(baseData.landPerBrother)}</div><div class="t-sub" style="text-align:right">خادم کو ادائیگی</div></div>
            
            <div class="tile t-pur"><div class="t-head"><div class="t-ico">📅</div><div class="t-lbl">فی بھائی کل کرایہ</div></div>
            <div class="t-val">${pkr(s1.brotherBase.rent)}</div><div class="t-sub" style="text-align:right">بغیر منافع کے</div></div>
            
            <div class="tile t-blue"><div class="t-head"><div class="t-ico">👨</div><div class="t-lbl">بنیادی پلاٹ حصہ</div></div>
            <div class="t-val">${pkr(s1.brotherBase.plot)}</div><div class="t-sub" style="text-align:right">بغیر اضافی انویسٹمنٹ</div></div>
            
            <div class="tile t-red"><div class="t-head"><div class="t-ico">⭐</div><div class="t-lbl">خادم کا پلاٹ حصہ</div></div>
            <div class="t-val">${pkr(s1.khadim.plot)}</div><div class="t-sub" style="text-align:right">انویسٹمنٹ شامل ہے</div></div>
        </div>

        <div class="table-container" style="margin-top:25px;">
            <h3 style="background:var(--gd);color:white;border:none;">📊 تفصیلی خاندانی تقسیم (طریقہ 1)</h3>
            <div class="tw">
                <table class="tbl">
                    <thead>
                        <tr>
                            <th>#</th><th>ممبر</th><th>پلاٹ حصہ</th><th>زمین کا حصہ (Land)</th>
                            <th>کل کرایہ (Rent)</th><th>وصول شدہ (Received)</th>
                            <th>بقایا کرایہ (Pending)</th><th>خالص ادائیگی (Net)</th><th>سٹیٹس</th>
                        </tr>
                    </thead>
                    <tbody>${table1Rows}</tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- ======================= OPTION 2 ======================= -->
    <div style="background:#faf5ff;padding:25px;border-radius:12px;margin-bottom:40px;box-shadow:var(--s2);border:1px solid #d8b4fe; position:relative; overflow:hidden;">
        <div style="position:absolute; top:0; left:0; right:0; height:4px; background:var(--pur);"></div>
        
        <h2 style="color:var(--pur);margin-top:0;display:flex;align-items:center;gap:10px;">
            <span style="font-size:28px;">🕌</span> طریقہ 2: پلاٹ منافع / شرعی طریقہ (تجویز کردہ)
        </h2>
        
        <div class="card-ex" style="background:var(--w); border:1px solid #e9d5ff; border-right-color:var(--pur);">
            <h3 style="margin-top:0; color:#6b21a8;">📖 شرعی اور منطقی اصول کا نفاذ (Mudarabah Principle)</h3>
            <p style="color:#475569; font-size:15px; line-height:1.7;">چونکہ خادم حسین نے 2017 میں 11.02 لاکھ کی انویسٹمنٹ کی، اس لیے انہیں پلاٹ کی قیمت میں ہونے والے اضافے (Capital Gain ≈ 18.4% سالانہ) کے حساب سے منافع دیا گیا ہے۔ <b>انصاف اور برابری</b> کے اصول کے تحت، خاندان کا جو کرایہ خادم کے پاس سالوں تک رکا رہا (جو کہ خادم کے استعمال میں رہا)، اس کرائے پر بھی پلاٹ کے برابر ہی منافع لگایا گیا ہے۔ اس سے خادم کو ان کی انویسٹمنٹ کا بہترین صلہ ملتا ہے اور خاندان کو ان کے رکے ہوئے پیسوں کا جائز اور شرعی منافع ملتا ہے۔</p>
            
            <div style="margin-top:15px; padding:15px; background:#faf5ff; border:1px dashed #c084fc; border-radius:8px;">
                <h4 style="margin-top:0; margin-bottom:8px; color:var(--pur);">🧮 ریاضیاتی فارمولہ (Capital Gain کے ساتھ):</h4>
                <div class="n" style="font-size:16px; direction:ltr; text-align:left; color:#1e293b; background:var(--w); padding:10px; border-radius:6px; border:1px solid #e9d5ff; overflow-x:auto;">
                    Net Balance = [Land Share] - ([Rent With Profit] - [Received Rent])
                </div>
            </div>
        </div>

        <div class="tiles t4" style="margin-top:20px;">
            <div class="tile t-pur" style="border-bottom-color:var(--pur);"><div class="t-head"><div class="t-ico">📈</div><div class="t-lbl">خادم کا انویسٹمنٹ منافع</div></div>
            <div class="t-val">${pkr(s2.khadim.plot)}</div><div class="t-sub" style="text-align:right">انویسٹمنٹ + پلاٹ گین</div></div>
            
            <div class="tile t-green" style="border-bottom-color:var(--gm);"><div class="t-head"><div class="t-ico">💰</div><div class="t-lbl">کل کرایہ (مع منافع)</div></div>
            <div class="t-val">${pkr(s2.totalRentWithProfit)}</div><div class="t-sub" style="text-align:right">کل کرایہ کی موجودہ قدر</div></div>
            
            <div class="tile t-gold" style="border-bottom-color:var(--gold);"><div class="t-head"><div class="t-ico">👨</div><div class="t-lbl">فی بھائی نیا کرایہ</div></div>
            <div class="t-val">${pkr(s2.brotherBase.rent)}</div><div class="t-sub" style="text-align:right">منافع شامل کرنے کے بعد</div></div>
            
            <div class="tile t-blue" style="border-bottom-color:var(--blu);"><div class="t-head"><div class="t-ico">⚖️</div><div class="t-lbl">فی بھائی زمین حصہ</div></div>
            <div class="t-val">${pkr(baseData.landPerBrother)}</div><div class="t-sub" style="text-align:right">زمین کی ادائیگی مستحکم ہے</div></div>
        </div>

        <div class="table-container" style="margin-top:25px;">
            <h3 style="background:var(--pur);color:white;border:none;">📊 تفصیلی خاندانی تقسیم (طریقہ 2 - منافع کے ساتھ)</h3>
            <div class="tw">
                <table class="tbl">
                    <thead>
                        <tr>
                            <th style="background:#f3e8ff">#</th><th style="background:#f3e8ff">ممبر</th><th style="background:#f3e8ff">پلاٹ حصہ</th><th style="background:#f3e8ff">زمین کا حصہ (Land)</th>
                            <th style="background:#f3e8ff">کل کرایہ <span style="color:var(--pur)">(گین شامل)</span></th><th style="background:#f3e8ff">وصول شدہ (Received)</th>
                            <th style="background:#f3e8ff">بقایا کرایہ (Pending)</th><th style="background:#f3e8ff">خالص ادائیگی (Net)</th><th style="background:#f3e8ff">سٹیٹس</th>
                        </tr>
                    </thead>
                    <tbody>${table2Rows}</tbody>
                </table>
            </div>
        </div>

        <div style="display:flex; gap:20px; margin-top:25px; flex-wrap:wrap;">
            <div style="flex:1; min-width:300px;" class="table-container">
                <h3 style="background:var(--w);color:var(--pur);border:1px solid #d8b4fe;border-bottom:none;">📅 کرایہ منافع سال بہ سال ثبوت</h3>
                <div class="tw" style="border:1px solid #d8b4fe; border-top:none; border-radius:0 0 8px 8px;">
                    <table class="tbl" style="margin:0;">
                        <thead>
                            <tr>
                                <th style="background:#faf5ff;color:#475569;border-bottom:2px solid #d8b4fe">سال</th>
                                <th style="background:#faf5ff;color:#475569;border-bottom:2px solid #d8b4fe">بنیادی کرایہ</th>
                                <th style="background:#faf5ff;color:var(--pur);border-bottom:2px solid #d8b4fe">موجودہ قدر (2026 میں)</th>
                            </tr>
                        </thead>
                        <tbody>${rentByYearHTML}</tbody>
                    </table>
                </div>
            </div>
            
            <div style="flex:1; min-width:300px; background:var(--w); padding:20px; border-radius:8px; border:1px solid #d8b4fe;">
                <h3 style="margin-top:0; color:var(--pur); border-bottom:1px solid #e9d5ff; padding-bottom:10px;">🧮 سیمپل کیلکولیشن ثبوت (2017)</h3>
                <p style="font-size:14px; color:#475569; margin-bottom:15px;">ہر سال کے کرائے پر پلاٹ کا گین کیسے لگایا گیا؟ یہ 2017 کے کرائے کی ایک مثال ہے تاکہ آپ خود تصدیق کر سکیں:</p>
                
                <div style="display:flex; justify-content:space-between; margin-bottom:10px; font-size:15px;">
                    <span style="color:#64748b">1. کل کرایہ (2017):</span>
                    <strong class="n" style="color:var(--g800)">${num(s2.rentByYear[0].base)}</strong>
                </div>
                <div style="display:flex; justify-content:space-between; margin-bottom:10px; font-size:15px;">
                    <span style="color:#64748b">2. پلاٹ ویلیو گین (2017-2026):</span>
                    <strong class="n" style="color:var(--pur)">x 4.57 (Multiplier)</strong>
                </div>
                <div style="display:flex; justify-content:space-between; margin-bottom:15px; font-size:15px; padding-bottom:10px; border-bottom:1px dashed #e2e8f0;">
                    <span style="color:#64748b">3. کرائے کی موجودہ مالیت:</span>
                    <strong class="n" style="color:var(--gm)">${num(s2.rentByYear[0].withProfit)}</strong>
                </div>
                
                <p style="font-size:14px; color:#475569; margin-bottom:10px;">اس 2017 کے کل کرائے میں سے ایک بھائی کا حصہ بنتا ہے (والدہ کا 1/8 نکالنے کے بعد):</p>
                <div style="display:flex; justify-content:space-between; margin-bottom:10px; font-size:15px;">
                    <span style="color:#64748b">بغیر منافع بھائی کا حصہ:</span>
                    <strong class="n" style="color:var(--g800)">${num((s2.rentByYear[0].base - (s2.rentByYear[0].base/8))/10)}</strong>
                </div>
                <div style="display:flex; justify-content:space-between; margin-bottom:10px; font-size:15px;">
                    <span style="color:#64748b">منافع کے ساتھ بھائی کا حصہ:</span>
                    <strong class="n" style="color:var(--gm)">${num((s2.rentByYear[0].withProfit - (s2.rentByYear[0].withProfit/8))/10)}</strong>
                </div>
            </div>
        </div>
    </div>
    `;
}


export function renderKhata(config, ledgers, idParam) {
    const allMembers = [...config.family.brothers, ...config.family.sisters, config.family.mother];
    
    let listHTML = allMembers.map(m => `
        <div onclick="location.hash='#khata/${m.id}'" style="padding:15px; cursor:pointer; border-bottom:1px solid var(--g200); transition:0.2s; ${m.id === idParam ? 'background:var(--gp); color:var(--gd); font-weight:bold; border-right:4px solid var(--gd);' : 'background:var(--w);'}">
            ${m.name}
        </div>
    `).join('');

    if(!idParam) {
        let summaryRows = allMembers.map(m => {
            const l = ledgers[m.id] || [];
            let credit = 0;
            let debit = 0;
            let lastBal = 0;
            
            l.forEach(tx => {
                if(tx.credit) credit += parseInt(String(tx.credit).replace(/,/g, '')) || 0;
                if(tx.debit) debit += parseInt(String(tx.debit).replace(/,/g, '')) || 0;
                if(tx.balance) lastBal = tx.balance;
            });
            
            let finalBalStr = lastBal ? lastBal : num(credit - debit);
            
            return `
            <tr style="cursor:pointer; background:var(--w); border-bottom:1px solid var(--g200);" onclick="location.hash='#khata/${m.id}'" onmouseover="this.style.background='var(--g50)'" onmouseout="this.style.background='var(--w)'">
                <td style="font-weight:bold;color:var(--gd);padding:15px;">${m.name}</td>
                <td class="ng n" style="padding:15px;">${num(credit)}</td>
                <td class="nr n" style="padding:15px;">${num(debit)}</td>
                <td class="nb n" style="font-weight:bold;padding:15px;background:var(--gp);">${finalBalStr}</td>
                <td style="padding:15px;text-align:left;">
                    <button style="background:var(--gd);color:white;padding:8px 15px;border-radius:6px;font-size:14px;box-shadow:var(--s1)">تفصیل دیکھیں</button>
                </td>
            </tr>
            `;
        }).join('');

        return `
        <div style="background:var(--w); padding:20px; border-radius:12px; box-shadow:var(--s1); border:1px solid var(--g200); margin-bottom:25px; text-align:center;">
            <img src="images/TaibaLogoWeb.jpg" style="height:90px; mix-blend-mode:multiply; margin-bottom:15px; border-radius:8px;">
            <h2 style="color:var(--gd); margin-top:0; margin-bottom:10px;">خاندانی کھاتہ — خلاصہ (Summary)</h2>
            <p style="color:var(--g600); margin:0;">یہ تمام ممبران کے پرانے کھاتوں کا ڈیجیٹل خلاصہ ہے۔ تفصیل دیکھنے کے لیے کسی بھی ممبر پر کلک کریں۔</p>
        </div>
        
        <div class="table-container" style="box-shadow:var(--s2); border:1px solid var(--gd);">
            <h3 style="background:var(--gd); color:white; border:none; padding:15px 20px;">👥 تمام ممبران کا کھاتہ سمری</h3>
            <div class="tw">
                <table class="tbl" style="margin:0;">
                    <thead>
                        <tr>
                            <th style="background:var(--g100);color:var(--g800);padding:15px;">ممبر کا نام</th>
                            <th style="background:var(--g100);color:var(--g800);padding:15px;">کل جمع (Credit)</th>
                            <th style="background:var(--g100);color:var(--g800);padding:15px;">کل نام (Debit)</th>
                            <th style="background:var(--g100);color:var(--g800);padding:15px;">فائنل بیلنس</th>
                            <th style="background:var(--g100);color:var(--g800);padding:15px;">ایکشن</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${summaryRows}
                    </tbody>
                </table>
            </div>
        </div>
        `;
    }

    const ledger = ledgers[idParam] || [];
    let member = allMembers.find(m=>m.id===idParam);
    const name = member ? member.name : idParam;

    let topMenuHTML = `
        <div style="display:flex; flex-wrap:wrap; gap:10px; margin-bottom:25px; justify-content:center; background:var(--w); padding:15px 20px; border-radius:12px; box-shadow:var(--s1); border:1px solid var(--g200);">
            ${allMembers.map(m => `
                <a href="#khata/${m.id}" style="padding:8px 16px; border-radius:20px; text-decoration:none; font-size:15px; transition:all 0.2s; ${m.id === idParam ? 'background:var(--gd); color:var(--w); font-weight:bold; box-shadow:0 4px 10px rgba(27,67,50,0.3); transform:translateY(-2px);' : 'background:var(--g100); color:var(--g800); border:1px solid var(--g300);'}">
                    ${m.name}
                </a>
            `).join('')}
        </div>
    `;

    return `
    <div>
        ${topMenuHTML}
        
        <div>
            <div style="background:var(--w); padding:20px; border-radius:12px; box-shadow:var(--s1); border:1px solid var(--g200); margin-bottom:20px; text-align:center;">
                <img src="images/TaibaLogoWeb.jpg" style="height:70px; mix-blend-mode:multiply; margin-bottom:10px; border-radius:8px;">
                <h2 style="color:var(--gd); margin-top:0; margin-bottom:5px;">تفصیلی کھاتہ: <span style="color:var(--gm)">${name}</span></h2>
                <p style="color:var(--g600); margin:0;">پرانے حافظ کھاتہ (HafizKhata) رجسٹر سے لیا گیا مکمل ڈیجیٹل ریکارڈ</p>
            </div>
            
            <div style="margin-bottom:15px;">
                <button onclick="location.hash='#khata'" style="padding:10px 20px; background:var(--w); border:1px solid var(--g300); border-radius:6px; font-weight:bold; color:var(--g800); box-shadow:var(--s1); cursor:pointer;">← سمری پر واپس جائیں</button>
            </div>
            
            <div class="table-container" style="box-shadow:var(--s2); border:1px solid var(--gd);">
                <h3 style="background:var(--gd); color:white; border:none; padding:15px 20px;">📜 لیجر تفصیل</h3>
                <div class="tw">
                    <table class="tbl" style="margin:0;">
                        <thead>
                            <tr>
                                <th style="background:var(--g100);color:var(--g800);padding:15px;width:60px;">نمبر</th>
                                <th style="background:var(--g100);color:var(--g800);padding:15px;width:90px;">قسم</th>
                                <th style="background:var(--g100);color:var(--g800);padding:15px;">تاریخ</th>
                                <th style="background:var(--g100);color:var(--g800);padding:15px;">تفصیل</th>
                                <th style="background:var(--g100);color:var(--g800);padding:15px;">حوالہ (Page)</th>
                                <th style="background:var(--g100);color:var(--g800);padding:15px;">جمع (Credit)</th>
                                <th style="background:var(--g100);color:var(--g800);padding:15px;">نام (Debit)</th>
                                <th style="background:var(--g100);color:var(--g800);padding:15px;">بیلنس</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${ledger.length > 0 ? ledger.map((l, i) => `
                                <tr style="background:${i%2===0 ? 'var(--w)' : 'var(--g50)'}; border-bottom:1px solid var(--g200);">
                                    <td class="n" style="padding:12px 15px; font-weight:bold; color:var(--g500); text-align:center;">${l.id || i+1}</td>
                                    <td style="padding:12px 15px; text-align:center;">
                                        <span style="font-size:12px; padding:4px 8px; border-radius:12px; font-weight:bold; ${l.type === 'rent' ? 'background:#dcfce7; color:#166534; border:1px solid #bbf7d0;' : 'background:#f1f5f9; color:#475569; border:1px solid #e2e8f0;'}">${l.type === 'rent' ? 'کرایہ' : 'نقد / دیگر'}</span>
                                    </td>
                                    <td class="n" style="padding:12px 15px; white-space:nowrap; color:var(--g600);">${l.date}</td>
                                    <td style="padding:12px 15px; line-height:1.6; color:var(--g800);">${l.description}</td>
                                    <td class="n" style="padding:12px 15px; color:var(--g400); text-align:center;">${l.page||'-'}</td>
                                    <td class="ng n" style="padding:12px 15px; font-weight:bold;">${l.credit ? num(String(l.credit).replace(/,/g, '')) : '-'}</td>
                                    <td class="nr n" style="padding:12px 15px;">${l.debit ? num(String(l.debit).replace(/,/g, '')) : '-'}</td>
                                    <td class="nb n" style="padding:12px 15px; font-weight:bold; background:${i%2===0 ? 'var(--gp)' : '#c6ebd1'}; border-right:1px solid var(--g200);">${l.balance||'-'}</td>
                                </tr>
                            `).join('') : '<tr><td colspan="8" style="text-align:center;padding:40px;color:var(--g400);font-size:18px;">اس ممبر کا کوئی پرانا کھاتہ ریکارڈ نہیں ملا</td></tr>'}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    `;
}


// ════ AGRICULTURE LEASE VIEW ════
export function renderAgriculture(config, calcDataAll) {
    const num = (x) => new Intl.NumberFormat('en-IN').format(Math.round(x));
    const A = config.agriculture;
    const agri = calcDataAll.agri;

    if (!A || !agri) return '<div style="padding:20px;text-align:center;">زرعی زمین کا ڈیٹا دستیاب نہیں ہے۔</div>';

    let yearRows = '';
    agri.years.forEach(y => {
        yearRows += `
        <tr>
            <td class="n" style="padding:10px;">${y.year}</td>
            <td class="n" style="padding:10px;">${num(y.ratePerAcre)}</td>
            <td class="n" style="padding:10px;">${num(y.ratePerKanal)}</td>
            <td style="padding:10px;">${y.cultivators}</td>
        </tr>
        `;
    });

    let opt1Rows = '';
    agri.years.forEach(y => {
        opt1Rows += `
        <tr>
            <td class="n" style="padding:10px;">${y.year}</td>
            <td class="n" style="padding:10px; color:var(--blu);">${num(y.khadimAmountOpt1)}</td>
            <td style="padding:10px; font-size:14px; color:var(--g600);">${y.cultivators} کے ذمے</td>
        </tr>
        `;
    });

    let opt2Rows = '';
    agri.years.forEach(y => {
        opt2Rows += `
        <tr>
            <td class="n" style="padding:10px;">${y.year}</td>
            <td class="n" style="padding:10px; color:var(--gm);">${num(y.khadimAmountOpt2)}</td>
            <td style="padding:10px; font-size:14px; color:var(--g600);">${y.cultivators} کے ذمے</td>
        </tr>
        `;
    });

    // We can show a summary of who owes what to Khadim
    let cultivatorsPeriod1 = A.cultivators.period1.brothers.map(b => config.family.brothers.find(br => br.id === b)?.name).join('، ');
    let cultivatorsPeriod2 = A.cultivators.period2.brothers.map(b => config.family.brothers.find(br => br.id === b)?.name).join('، ');

    let amountP1_opt1 = agri.years.filter(y => y.year <= A.cultivators.period1.end).reduce((acc, y) => acc + y.khadimAmountOpt1, 0);
    let amountP2_opt1 = agri.years.filter(y => y.year >= A.cultivators.period2.start).reduce((acc, y) => acc + y.khadimAmountOpt1, 0);
    
    let amountP1_opt2 = agri.years.filter(y => y.year <= A.cultivators.period1.end).reduce((acc, y) => acc + y.khadimAmountOpt2, 0);
    let amountP2_opt2 = agri.years.filter(y => y.year >= A.cultivators.period2.start).reduce((acc, y) => acc + y.khadimAmountOpt2, 0);

    let totalReceived = 0;
    if (A.paymentsMadeToKhadim) {
        totalReceived = (A.paymentsMadeToKhadim.ghulam_akbar || 0) + 
                        (A.paymentsMadeToKhadim.abid_hussain || 0) + 
                        (A.paymentsMadeToKhadim.abdul_qayyum || 0);
    }
    
    let netRemainingOpt1 = agri.totalOpt1 - totalReceived;
    let netRemainingOpt2 = agri.totalOpt2 - totalReceived;

    return `
    <div class="card-ex" style="background:#F0FDF4;border-color:var(--gm)">
        <h2 style="color:var(--gm)">🌾 زرعی زمین کا ٹھیکہ (Agriculture Land Lease)</h2>
        <p>اس صفحے پر کل 7 ایکڑ زرعی زمین کے ٹھیکے کا حساب درج ہے۔ 2016 سے لے کر 2026 تک، چونکہ خادم کی زمین دوسرے بھائیوں (غلام اکبر، عابد حسین، اور عبدالقیوم) نے کاشت کی، اس لیے ان پر خادم کا ٹھیکہ واجب الادا ہے۔</p>
        <p><b>بنیادی ریٹ (2016):</b> ${num(A.baseRatePerAcre2016)} روپے فی ایکڑ | <b>سالانہ اضافہ:</b> تقریباً ${agri.incrementPercent}% (2026 میں 1,20,000 ریٹ کے حساب سے)</p>
    </div>

    <!-- Annual Rates Table -->
    <div class="table-container" style="margin-bottom:30px;">
        <h3 style="background:var(--blu);color:white;font-size:20px;border:none;">سال بہ سال ٹھیکے کا ریٹ</h3>
        <table class="tbl" style="border-top:1px solid var(--g200)">
            <thead>
                <tr>
                    <th style="background:var(--w);color:var(--g800);">سال</th>
                    <th style="background:var(--w);color:var(--g800);">ریٹ فی ایکڑ</th>
                    <th style="background:var(--w);color:var(--g800);">ریٹ فی کنال</th>
                    <th style="background:var(--w);color:var(--g800);">کاشتکار (کس نے کاشت کی؟)</th>
                </tr>
            </thead>
            <tbody>
                ${yearRows}
            </tbody>
        </table>
    </div>

    <div style="display:flex; gap:20px; flex-wrap:wrap;">
        
        <!-- Option 1 -->
        <div class="table-container" style="flex:1; min-width:300px; margin:0;">
            <h3 style="background:var(--pur);color:white;font-size:18px;border:none;">آپشن 1: خادم کے پاس 6 کنال ایکسٹرا ہیں</h3>
            <div style="padding:15px; background:var(--w); border-bottom:1px solid var(--g200); font-size:14px; color:var(--g700);">
                خادم کی کل زمین = <b>10.9 کنال</b> (4.9 پیدائشی حصہ + 6 خریدا ہوا)
            </div>
            <table class="tbl" style="border-top:1px solid var(--g200)">
                <thead>
                    <tr>
                        <th style="background:var(--w);color:var(--g800);">سال</th>
                        <th style="background:var(--w);color:var(--g800);">خادم کا ٹھیکہ (Rs)</th>
                        <th style="background:var(--w);color:var(--g800);">کس کے ذمے ہے؟</th>
                    </tr>
                </thead>
                <tbody>
                    ${opt1Rows}
                    <tr class="tot" style="background:var(--pur)!important; color:white!important; font-weight:bold;">
                        <td style="padding:10px; background:var(--pur)!important; color:white!important;">کل ٹوٹل</td>
                        <td class="n" style="padding:10px; font-size:18px; background:var(--pur)!important; color:white!important;">${num(agri.totalOpt1)}</td>
                        <td style="background:var(--pur)!important; color:white!important;">-</td>
                    </tr>
                </tbody>
            </table>
            
            <div style="padding:15px; background:#faf5ff; border:1px solid #e9d5ff; border-radius:6px; margin:15px; margin-top:20px;">
                <h4 style="margin-top:0; color:var(--pur); margin-bottom:10px;">واجب الادا سمری (آپشن 1):</h4>
                <ul style="margin:0; padding-right:20px; font-size:15px;">
                    <li style="margin-bottom:5px;"><b>${cultivatorsPeriod1} (مشترکہ):</b> ${num(amountP1_opt1)} روپے (2016-2020)</li>
                    <li style="margin-bottom:15px;"><b>${cultivatorsPeriod2}:</b> ${num(amountP2_opt1)} روپے (2021-2026)</li>
                </ul>
                <div style="border-top:1px dashed #d8b4fe; margin-top:10px; padding-top:10px; display:flex; justify-content:space-between;">
                    <span><b>پہلے سے وصول شدہ:</b></span>
                    <span style="color:#b91c1c;" class="n">-${num(totalReceived)}</span>
                </div>
                <div style="border-top:2px solid #d8b4fe; margin-top:10px; padding-top:10px; display:flex; justify-content:space-between; font-size:18px; font-weight:bold;">
                    <span><b>فائنل بقایا:</b></span>
                    <span style="color:var(--pur);" class="n">${num(netRemainingOpt1)}</span>
                </div>
            </div>
        </div>

        <!-- Option 2 -->
        <div class="table-container" style="flex:1; min-width:300px; margin:0;">
            <h3 style="background:var(--gm);color:white;font-size:18px;border:none;">آپشن 2: خادم کے پاس ایکسٹرا 6 کنال نہیں ہیں</h3>
            <div style="padding:15px; background:var(--w); border-bottom:1px solid var(--g200); font-size:14px; color:var(--g700);">
                خادم کی کل زمین = <b>4.9 کنال</b> (صرف پیدائشی حصہ)
            </div>
            <table class="tbl" style="border-top:1px solid var(--g200)">
                <thead>
                    <tr>
                        <th style="background:var(--w);color:var(--g800);">سال</th>
                        <th style="background:var(--w);color:var(--g800);">خادم کا ٹھیکہ (Rs)</th>
                        <th style="background:var(--w);color:var(--g800);">کس کے ذمے ہے؟</th>
                    </tr>
                </thead>
                <tbody>
                    ${opt2Rows}
                    <tr class="tot" style="background:var(--gm)!important; color:white!important; font-weight:bold;">
                        <td style="padding:10px; background:var(--gm)!important; color:white!important;">کل ٹوٹل</td>
                        <td class="n" style="padding:10px; font-size:18px; background:var(--gm)!important; color:white!important;">${num(agri.totalOpt2)}</td>
                        <td style="background:var(--gm)!important; color:white!important;">-</td>
                    </tr>
                </tbody>
            </table>

            <div style="padding:15px; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:6px; margin:15px; margin-top:20px;">
                <h4 style="margin-top:0; color:var(--gm); margin-bottom:10px;">واجب الادا سمری (آپشن 2):</h4>
                <ul style="margin:0; padding-right:20px; font-size:15px;">
                    <li style="margin-bottom:5px;"><b>${cultivatorsPeriod1} (مشترکہ):</b> ${num(amountP1_opt2)} روپے (2016-2020)</li>
                    <li style="margin-bottom:15px;"><b>${cultivatorsPeriod2}:</b> ${num(amountP2_opt2)} روپے (2021-2026)</li>
                </ul>
                <div style="border-top:1px dashed #86efac; margin-top:10px; padding-top:10px; display:flex; justify-content:space-between;">
                    <span><b>پہلے سے وصول شدہ:</b></span>
                    <span style="color:#b91c1c;" class="n">-${num(totalReceived)}</span>
                </div>
                <div style="border-top:2px solid #86efac; margin-top:10px; padding-top:10px; display:flex; justify-content:space-between; font-size:18px; font-weight:bold;">
                    <span><b>فائنل بقایا:</b></span>
                    <span style="color:var(--gm);" class="n">${num(netRemainingOpt2)}</span>
                </div>
            </div>
        </div>

    </div>
    `;
}
