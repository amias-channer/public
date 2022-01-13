export default function getTotalPortfolioFieldByCostType(costType) {
    const { id } = costType || {};
    if (id === 'marginReport' || id === 'overnightReport') {
        return id;
    }
    // for example, BASIC account
    return 'availableToSpend';
}
//# sourceMappingURL=get-total-portfolio-field-by-cost-type.js.map