const fs = require('fs');

let uiJs = fs.readFileSync('js/ui.js', 'utf8');

let target = `        <div class="table-expl">
            <p><strong>طریقہ 2 کی مکمل تاریخ اور شرعی اصول:</strong></p>
            <p>\${historyText2}</p>
        </div>
    </div>
    \`;
}`;

let replacement = `        <div class="table-expl">
            <p><strong>طریقہ 2 کی مکمل تاریخ اور شرعی اصول:</strong></p>
            <p>\${historyText2}</p>
        </div>
    </div>
    \` : ''}
    \`;
}`;

if (uiJs.includes(target)) {
    uiJs = uiJs.replace(target, replacement);
    fs.writeFileSync('js/ui.js', uiJs, 'utf8');
    console.log("Fixed syntax error in ui.js");
} else {
    console.log("Could not find the target string in ui.js to fix syntax error");
}
