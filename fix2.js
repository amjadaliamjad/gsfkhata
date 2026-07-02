const fs = require('fs');
let content = fs.readFileSync('js/ui.js', 'utf8');
let idx = content.lastIndexOf('    `;\\n}');
if(idx === -1) idx = content.lastIndexOf('    `;\\r\\n}');

// Let's just use regex to replace the last occurrence of   </div>\n    `;\n}
content = content.replace(/<\\/div>\\s+<\\/div>\\s+\`;\\s+\\}/, "</div>\\n    </div>\\n    ` : ''}\\n    `;\\n}");
fs.writeFileSync('js/ui.js', content, 'utf8');
