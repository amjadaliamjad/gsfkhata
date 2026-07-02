const fs = require('fs');

let calcJs = fs.readFileSync('js/calculator.js', 'utf8');

// Replace the Plot Base Division
let oldPlotDivision = `    // Plot Base Division (2009 Family Share vs 2017 Cousin Share)
    const cousinOneThird = Math.round(P.salePrice2026 / 3);
    const familyTwoThird = P.salePrice2026 - cousinOneThird;`;

let newPlotDivision = `    // Deductions from Sale Price
    const netSalePrice2026 = P.salePrice2026 
        - (P.expenses2026 || 0) 
        - (P.shahidBonus2026 || 0) 
        - (P.collectiveReserve2026 || 0);

    // Plot Base Division (2009 Family Share vs 2017 Cousin Share)
    const cousinOneThird = Math.round(netSalePrice2026 / 3);
    const familyTwoThird = netSalePrice2026 - cousinOneThird;`;

if (calcJs.includes(oldPlotDivision)) {
    calcJs = calcJs.replace(oldPlotDivision, newPlotDivision);
} else {
    console.log("Could not find oldPlotDivision");
}

let oldCagr = `    const cagr = Math.pow(P.salePrice2026 / P.cousinDemandPrice2017, 1/9) - 1; // approx 18.4%
    const growthMultiplier = P.salePrice2026 / P.cousinDemandPrice2017;`;

let newCagr = `    const cagr = Math.pow(netSalePrice2026 / P.cousinDemandPrice2017, 1/9) - 1; 
    const growthMultiplier = netSalePrice2026 / P.cousinDemandPrice2017;`;

if (calcJs.includes(oldCagr)) {
    calcJs = calcJs.replace(oldCagr, newCagr);
} else {
    console.log("Could not find oldCagr");
}

fs.writeFileSync('js/calculator.js', calcJs, 'utf8');
console.log('calculator.js updated successfully.');
