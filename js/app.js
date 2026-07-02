// GSFKhata - Main Application Controller
import { calculateScenarios } from './calculator.js?v=2';
import * as UI from './ui.js?v=2';

class App {
    constructor() {
        this.config = null;
        this.ledgers = {};
        this.calculations = null;
        this.currentView = 'dash';
    }

    async init() {
        try {
            const res = await fetch('data/config.json');
            this.config = await res.json();

            const members = [...this.config.family.brothers, ...this.config.family.sisters, this.config.family.mother];
            for (let m of members) {
                try {
                    let lr = await fetch(`data/ledgers/${m.id}.json`);
                    if (lr.ok) {
                        this.ledgers[m.id] = await lr.json();
                    } else {
                        this.ledgers[m.id] = [];
                    }
                } catch(e) {
                    this.ledgers[m.id] = [];
                }
                
                // Dynamically calculate cashWithdrawn from ledger and inject into config
                let ledger = this.ledgers[m.id] || [];
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
                m.receivedRent = cashWithdrawn;
            }

            this.calculations = calculateScenarios(this.config, this.ledgers);

            window.addEventListener('hashchange', () => this.handleRoute());
            this.handleRoute();

        } catch (error) {
            console.error("Failed to initialize app:", error);
            document.getElementById('view-container').innerHTML = `<div style="padding:20px;text-align:center;color:red;font-weight:bold;">ایپ لوڈ کرنے میں مسئلہ: ${error.message}</div>`;
        }
    }

    handleRoute() {
        let hash = window.location.hash.substring(1) || 'dash';
        const parts = hash.split('/');
        this.currentView = parts[0];
        this.viewParam = parts[1];
        this.subParam = parts[2];

        // Update active nav desktop
        document.querySelectorAll('.navbar .nav-item').forEach(n => n.classList.remove('active'));
        document.querySelectorAll('.nav-dropdown').forEach(n => n.classList.remove('active'));
        
        const navEl = document.getElementById('nav-' + this.currentView);
        if (navEl) navEl.classList.add('active');
        
        // Update active nav mobile
        document.querySelectorAll('.mobile-nav-menu .nav-item').forEach(n => n.classList.remove('active'));
        const mobNavEl = document.getElementById('mob-nav-' + this.currentView);
        if (mobNavEl) mobNavEl.classList.add('active');

        this.renderView();
    }

    renderView() {
        const container = document.getElementById('view-container');
        
        if (this.currentView === 'dash') {
            container.innerHTML = UI.renderDashboard(this.config, this.calculations, this.calculations.base, this.ledgers);
        } else if (this.currentView === 'rent') {
            container.innerHTML = UI.renderRent(this.config, this.calculations, this.calculations.base, this.ledgers);
        } else if (this.currentView === 'profit') {
            container.innerHTML = UI.renderProfitDistribution(this.config, this.calculations, this.calculations.base);
        } else if (this.currentView === 'agri') {
            container.innerHTML = UI.renderAgriculture(this.config, this.calculations);
        } else if (this.currentView === 'cashprofit') {
            container.innerHTML = UI.renderCashProfit(this.config, this.calculations, this.viewParam);
        } else if (this.currentView === 'summary') {
            container.innerHTML = UI.renderExplanation(this.config, this.calculations);
        } else if (this.currentView.startsWith('khata')) {
            container.innerHTML = UI.renderKhata(this.config, this.ledgers, this.viewParam, this.subParam);
        } else {
            container.innerHTML = `<h2>صفحہ نہیں ملا</h2>`;
        }
    }

    openMenu() {
        document.getElementById('mobile-menu').classList.add('open');
        document.getElementById('overlay').style.display = 'block';
    }

    closeMenu() {
        document.getElementById('mobile-menu').classList.remove('open');
        document.getElementById('overlay').style.display = 'none';
    }

    showInfo(title, text) {
        document.getElementById('modal-title').innerText = title;
        document.getElementById('modal-text').innerHTML = text;
        document.getElementById('info-modal').classList.add('show');
    }

    closeInfo() {
        document.getElementById('info-modal').classList.remove('show');
    }
}

const app = new App();
window.app = app; // Expose globally for onclicks
app.init();
