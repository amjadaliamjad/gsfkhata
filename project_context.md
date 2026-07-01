# GSFKhata - Project Transfer Context

This document contains the complete context of the **GSFKhata (غلام سرور فیملی کھاتہ)** project. You can provide this file to your AI assistant on your new machine to instantly resume work exactly where we left off.

## 1. Project Overview
GSFKhata is a client-side vanilla JavaScript web application designed to handle complex Islamic family inheritance, plot rent, and agricultural lease calculations. It focuses heavily on transparency, displaying step-by-step math (Capital Gain, Base Shares, Cash Deductions) to prevent family disputes.

- **Stack:** HTML5, Vanilla JS (ES6 modules), Vanilla CSS.
- **Architecture:** 
  - `index.html`: Main shell, mobile/desktop navigation, view container.
  - `css/style.css`: Design system, CSS variables, Urdu typography (`Noto Nastaliq Urdu`).
  - `data/config.json`: Master configuration (Plot values, Land shares, Family members, Agriculture rules, Rent arrays).
  - `data/ledgers/*.json`: Individual transaction histories for cash and rent per family member.
  - `js/app.js`: Core application router and state manager.
  - `js/calculator.js`: The mathematical engine. Processes scenarios (Standard vs. Islamic Equity/Capital Gain).
  - `js/ui.js`: Massive UI rendering engine using Template Literals to generate tables and modals.

## 2. Core Features Implemented

### A. Rent Distribution & Capital Gain (طریقہ 2)
- Calculates the base share for Mother (1/8), Sisters (1/20), and Brothers (2/20) for plot rent from 2017 to 2026.
- Applies an Islamic Equity "Capital Gain" model. The rent that was kept by Khadim Hussain is multiplied by the growth rate of the plot (from ~9.3M to 42.5M, approx 18.4% CAGR) based on how many years the rent was held.
- UI Tables explicitly show `D - C` (Fixed Rent - Cash Withdrawn = Actual Remaining), the Capital Gain addition, and the Final Net Payable.

### B. Dynamic Ledger Modals
- Clicking on rent or cash amounts in tables opens a detailed modal showing the exact history of debit/credit transactions parsed from the `data/ledgers/` JSON files.

### C. Agriculture Land Lease (زرعی زمین کا ٹھیکہ)
- Calculates lease owed to Khadim Hussain by brothers who cultivated his share of land.
- **Dynamic Increment:** Automatically calculates a compound yearly percentage (e.g., ~9.15%) to increase the lease from a base rate of `50,000` per acre in 2016 to exactly `120,000` per acre in 2026.
- **Two Options:** 
  - *Option 1:* Khadim has 10.9 Kanals (Base share + 6 Kanals extra).
  - *Option 2:* Khadim has 4.9 Kanals (Base share only).
- **Payments & Summary:** Tracks cultivators across two periods (2016-2020: Ghulam Akbar, Abid Hussain, Abdul Qayyum; 2021-2026: Abid Hussain). Incorporates a `paymentsMadeToKhadim` config object to deduct already received amounts and display the exact net pending balance.

## 3. Current State & Next Steps
- **Git Status:** All source code changes have been committed and pushed to the `main` branch on GitHub. Working tree is entirely clean.
- **Next Steps on New Machine:**
  1. `git clone` the repository onto your new machine.
  2. Start a new Antigravity session.
  3. Upload or paste this document to give the agent immediate context.
  4. The next pending task (as discussed) is to collect the exact values from the physical lease ledgers and update the `paymentsMadeToKhadim` object in `data/config.json`.
