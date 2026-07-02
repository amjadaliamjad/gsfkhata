const fs = require('fs');
let uiJs = fs.readFileSync('js/ui.js', 'utf8');

// Use regex to find the end of renderDashboard
let newDashboardEnd = `        <div class="table-expl">
            <p><strong>طریقہ 2 کی مکمل تاریخ اور شرعی اصول:</strong></p>
            <p>\${historyText2}</p>
        </div>
    </div>
    \` : ''}
    \`;
}`;

uiJs = uiJs.replace(/<div class="table-expl">[\s\S]*?طریقہ 2 کی مکمل تاریخ اور شرعی اصول:[\s\S]*?<\/p>\r?\n\s+<\/div>\r?\n\s+<\/div>\r?\n\s+`;\r?\n\}/, newDashboardEnd);

fs.writeFileSync('js/ui.js', uiJs, 'utf8');
console.log("Syntax fixed!");
