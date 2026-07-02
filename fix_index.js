const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Remove the toggle from near the logo
const toggleBlockStart = html.indexOf('<div style="display:flex; align-items:center; gap:10px;">');
const styleBlockEnd = html.indexOf('</style>') + 8;

if (toggleBlockStart !== -1 && styleBlockEnd !== -1) {
    html = html.substring(0, toggleBlockStart) + html.substring(styleBlockEnd);
}

// Add toggle to the end of .nav-links
const navLinksEnd = html.indexOf('</div>\r\n        <button class="nav-toggle"');
if (navLinksEnd === -1) {
    console.error("Could not find nav-links end");
} else {
    const toggleHTML = `
                <div style="display:flex; align-items:center; gap:10px; margin-right:15px; border-right: 1px solid var(--g200); padding-right:15px;">
                    <span style="font-size:14px; font-weight:bold; color:var(--g800);">Islamic Mode</span>
                    <label class="switch" style="position:relative; display:inline-block; width:50px; height:24px;">
                      <input type="checkbox" id="islamic-mode-toggle" onchange="app.toggleIslamicMode(this.checked)" style="opacity:0; width:0; height:0;">
                      <span class="slider" style="position:absolute; cursor:pointer; top:0; left:0; right:0; bottom:0; background-color:#dc2626; transition:.4s; border-radius:4px;"></span>
                    </label>
                </div>
`;
    html = html.substring(0, navLinksEnd) + toggleHTML + html.substring(navLinksEnd);
}

// Also add styles at the end of head
const headEnd = html.indexOf('</head>');
const toggleStyles = `
<style>
  .switch input:checked + .slider { background-color: #16a34a; }
  .switch input:focus + .slider { box-shadow: 0 0 1px #16a34a; }
  .switch input:checked + .slider:before { transform: translateX(26px); }
  .slider:before {
    position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px;
    background-color: white; transition: .4s; border-radius: 4px;
  }
</style>
`;
html = html.substring(0, headEnd) + toggleStyles + html.substring(headEnd);

fs.writeFileSync('index.html', html, 'utf8');
console.log('Fixed index.html');
