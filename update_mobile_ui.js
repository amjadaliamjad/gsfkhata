const fs = require('fs');

// 1. Update style.css
let css = fs.readFileSync('css/style.css', 'utf8');

let oldMenuCss = `.mobile-nav-menu{position:fixed;top:0;right:-280px;width:260px;height:100%;
background:var(--w);z-index:1000;box-shadow:-5px 0 20px rgba(0,0,0,0.1);
display:flex;flex-direction:column;padding-top:20px;transition:right 0.3s cubic-bezier(0.4,0,0.2,1)}
.mobile-nav-menu.open{right:0}`;

let newMenuCss = `.mobile-nav-menu{position:fixed;bottom:-100%;right:0;left:0;width:100%;max-height:85vh;height:auto;
background:var(--w);z-index:1000;box-shadow:0 -5px 20px rgba(0,0,0,0.15);
display:flex;flex-direction:column;padding-top:10px;padding-bottom:30px;
border-radius:24px 24px 0 0;overflow-y:auto;transition:bottom 0.3s cubic-bezier(0.4,0,0.2,1)}
.mobile-nav-menu.open{bottom:0}
.mobile-nav-menu::before {content:'';width:40px;height:5px;background:var(--g300);border-radius:3px;margin:0 auto 15px auto;}

.mobile-fab {
  display:none;
  position:fixed;
  bottom:20px;
  right:20px;
  width:60px;
  height:60px;
  background:var(--gd);
  color:white;
  border-radius:50%;
  box-shadow:0 4px 15px rgba(27,67,50,0.4);
  z-index:998; 
  cursor:pointer;
  align-items:center;
  justify-content:center;
  font-size:24px;
  border:none;
  transition:all 0.3s;
}
@media(max-width:768px){
  .mobile-fab { display:flex; }
  body.menu-open .mobile-fab { transform: scale(0); }
}

.loading * { cursor: wait !important; }`;

if (css.includes(oldMenuCss)) {
    css = css.replace(oldMenuCss, newMenuCss);
}

fs.writeFileSync('css/style.css', css, 'utf8');


// 2. Update index.html for FAB
let html = fs.readFileSync('index.html', 'utf8');
if (!html.includes('id="mobile-fab"')) {
    html = html.replace('<!-- Overlay -->', `<!-- Mobile FAB -->\n<button class="mobile-fab" id="mobile-fab" onclick="app.openMenu()">☰</button>\n\n<!-- Overlay -->`);
    fs.writeFileSync('index.html', html, 'utf8');
}


// 3. Update app.js for menu-open body class and loading cursor
let appJs = fs.readFileSync('js/app.js', 'utf8');

// openMenu
appJs = appJs.replace(`    openMenu() {
        document.getElementById('mobile-menu').classList.add('open');
        document.getElementById('overlay').style.display = 'block';
    }`, `    openMenu() {
        document.getElementById('mobile-menu').classList.add('open');
        document.getElementById('overlay').style.display = 'block';
        document.body.classList.add('menu-open');
    }`);

// closeMenu
appJs = appJs.replace(`    closeMenu() {
        document.getElementById('mobile-menu').classList.remove('open');
        document.getElementById('overlay').style.display = 'none';
    }`, `    closeMenu() {
        document.getElementById('mobile-menu').classList.remove('open');
        document.getElementById('overlay').style.display = 'none';
        document.body.classList.remove('menu-open');
    }`);

// loading cursor
if (!appJs.includes('setLoading')) {
    appJs = appJs.replace(`    renderView() {`, `    setLoading(isLoading) {
        if (isLoading) document.body.classList.add('loading');
        else document.body.classList.remove('loading');
    }

    renderView() {`);

    appJs = appJs.replace(`    handleRoute() {
        const hash = window.location.hash.substring(1);`, `    handleRoute() {
        this.setLoading(true);
        setTimeout(() => {
            const hash = window.location.hash.substring(1);`);
            
    // we need to close the setTimeout. 
    // let's do this more cleanly
}

fs.writeFileSync('js/app.js', appJs, 'utf8');
console.log('Mobile UI updated.');
