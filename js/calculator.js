// GSFKhata - Core Calculation Engine

export function calculateScenarios(config) {
    const P = config.plot;
    const L = config.land;
    const R = config.rent;

    // --- Base Math ---
    const totalRent = R.years.reduce((acc, y) => acc + (y.monthly * y.months), 0);
    const rentPerMother = Math.round(totalRent / 8);
    const rentRemaining = totalRent - rentPerMother;
    const rentPerSibling = Math.round(rentRemaining / 10);
    // Mother = 1/8, Sisters = 1/20 each (which is rentPerSibling/2), Brothers = 2/20 (rentPerSibling)
    const rentPerSister = Math.round(rentPerSibling / 2);
    const rentPerBrother = rentPerSibling;

    // Land calculation
    const landValue = L.useMarketRate ? (L.marketPrice8Canal / 8 * 6) : L.agreedSixCanalPrice;
    const landPerBrother = Math.round(landValue / 9);

    // Plot Base Division (2009 Family Share vs 2017 Cousin Share)
    const cousinOneThird = Math.round(P.salePrice2026 / 3);
    const familyTwoThird = P.salePrice2026 - cousinOneThird;
    
    const motherPlot = Math.round(familyTwoThird / 8);
    const siblingsPlotPool = familyTwoThird - motherPlot;
    const sisterPlot = Math.round(siblingsPlotPool / 20);
    const brotherFamilyPlot = sisterPlot * 2;

    // --- AGGREGATES FOR DASHBOARD ---
    const totalMembers = 12; // 9 brothers, 2 sisters, 1 mother
    let totalReceivedRent = 0;
    config.family.brothers.forEach(b => {
        totalReceivedRent += b.receivedRent || 0;
    });
    // Add sisters/mother if they received anything (assuming 0 for now based on config)
    const totalPendingRent = totalRent - totalReceivedRent;

    // Khadim special payment: e.g. Khadim's rent + the 6 kanal land price? 
    // Wait, the screenshot says "خادم کو خاص ادائیگی 403,064". 
    // 3,375,000 (Land) - 2,971,936 (Total Pending Rent) = 403,064.
    // Yes! Khadim owes the family 2,971,936 in rent. The family owes Khadim 3,375,000 for the land.
    // So the net family payment to Khadim (Special Payment) is simply Land - Pending Rent!
    const specialPaymentToKhadim = landValue - totalPendingRent;

    // --- SCENARIO 1 (Standard / Current Agreement) ---
    const s1_perOtherBrotherCousinPlot = Math.round(cousinOneThird * (P.brothersBaseInvestment2017 / P.cousinSharePrice2017));
    
    let scenario1 = {
        name: "Scenario 1 (Original Agreement)",
        mother: { plot: motherPlot, rent: rentPerMother, total: motherPlot + rentPerMother },
        sisters: { plot: sisterPlot, rent: rentPerSister, total: sisterPlot + rentPerSister },
        brotherBase: { plot: brotherFamilyPlot + s1_perOtherBrotherCousinPlot, rent: rentPerBrother },
        khadim: { plot: brotherFamilyPlot + s1_perOtherBrotherCousinPlot, rent: rentPerBrother },
        landValue,
        landPerBrother
    };

    // --- SCENARIO 2 (Plot Growth & Rent Profit) ---
    const cagr = Math.pow(P.salePrice2026 / P.cousinDemandPrice2017, 1/9) - 1; // approx 18.4%
    const growthMultiplier = P.salePrice2026 / P.cousinDemandPrice2017;
    const s2_khadimExtraProfit = Math.round(P.khadimExtraInvestment2017 * growthMultiplier);
    
    let s2_totalRentWithProfit = 0;
    let s2_rentByYear = R.years.map(y => {
        const amount = y.monthly * y.months;
        const yearsHeld = 2026 - y.year;
        const amountWithProfit = Math.round(amount * Math.pow(1 + cagr, yearsHeld));
        s2_totalRentWithProfit += amountWithProfit;
        return { year: y.year, base: amount, withProfit: amountWithProfit };
    });

    const s2_rentPerMother = Math.round(s2_totalRentWithProfit / 8);
    const s2_rentRemaining = s2_totalRentWithProfit - s2_rentPerMother;
    const s2_rentPerSibling = Math.round(s2_rentRemaining / 10);
    const s2_rentPerSister = Math.round(s2_rentPerSibling / 2);
    const s2_rentPerBrother = s2_rentPerSibling;

    let scenario2 = {
        name: "Scenario 2 (Plot Growth / Islamic Equity)",
        cagr: cagr, 
        growthMultiplier: growthMultiplier,
        mother: { plot: motherPlot, rent: s2_rentPerMother, total: motherPlot + s2_rentPerMother },
        sisters: { plot: sisterPlot, rent: s2_rentPerSister, total: sisterPlot + s2_rentPerSister },
        brotherBase: { plot: brotherFamilyPlot + s1_perOtherBrotherCousinPlot, rent: s2_rentPerBrother },
        khadim: { plot: brotherFamilyPlot + s1_perOtherBrotherCousinPlot + s2_khadimExtraProfit, rent: s2_rentPerBrother },
        rentByYear: s2_rentByYear,
        totalRentWithProfit: s2_totalRentWithProfit,
        landValue,
        landPerBrother
    };

    // --- Agriculture Lease Math ---
    const A = config.agriculture;
    let agri = { years: [], totalOpt1: 0, totalOpt2: 0 };
    if (A) {
        let currentRate = A.baseRatePerAcre2016;
        let yearlyData = [];
        let totalOpt1 = 0;
        let totalOpt2 = 0;

        let khadimOpt1Kanals = 10.9;
        let khadimOpt2Kanals = 4.9;

        for (let y = A.startYear; y <= A.endYear; y++) {
            let ratePerKanal = Math.round(currentRate / A.kanalsPerAcre);
            let opt1Amount = Math.round(khadimOpt1Kanals * ratePerKanal);
            let opt2Amount = Math.round(khadimOpt2Kanals * ratePerKanal);
            
            totalOpt1 += opt1Amount;
            totalOpt2 += opt2Amount;

            let cultivators = "";
            if (y >= A.cultivators.period1.start && y <= A.cultivators.period1.end) {
                cultivators = "غلام اکبر، عابد حسین، عبدالقیوم";
            } else if (y >= A.cultivators.period2.start && y <= A.cultivators.period2.end) {
                cultivators = "عابد حسین";
            }

            yearlyData.push({
                year: y,
                ratePerAcre: currentRate,
                ratePerKanal: ratePerKanal,
                khadimAmountOpt1: opt1Amount,
                khadimAmountOpt2: opt2Amount,
                cultivators: cultivators
            });

            currentRate = Math.round(currentRate * (1 + (A.annualIncrementPercent/100)));
        }
        
        agri.years = yearlyData;
        agri.totalOpt1 = totalOpt1;
        agri.totalOpt2 = totalOpt2;
    }

    return {
        base: { 
            totalRent, 
            landValue, 
            landPerBrother, 
            plotSale: P.salePrice2026,
            totalMembers,
            totalReceivedRent,
            totalPendingRent,
            specialPaymentToKhadim
        },
        s1: scenario1,
        s2: scenario2,
        agri: agri
    };
}
