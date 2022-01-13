export default function getTotalPortfolioCostTypes(user) {
    const costTypes = [];
    if (user.hasMarginReport) {
        costTypes.push({
            translation: 'trader.totalPortfolio.marginReport',
            id: 'marginReport'
        });
    }
    if (user.hasOvernightReport) {
        costTypes.push({
            translation: 'trader.totalPortfolio.overnightReport',
            id: 'overnightReport'
        });
    }
    return costTypes;
}
//# sourceMappingURL=get-total-portfolio-cost-types.js.map