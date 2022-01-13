export default function getEconomicPeriodLabelSuffix(period: string): string {
    if (!period) {
        return '';
    }
    let labelSuffix = `(${period})`;
    const matches = period.match(/(,\s*)?(\d{4})/) || [];
    const year = matches[2] || '0';
    const fullMatch = matches[0] || '';
    const currentYear = new Date().getFullYear();

    if (year && fullMatch && parseInt(year, 10) >= currentYear) {
        labelSuffix = `(${period.replace(fullMatch, '').trim()})`;
    }

    return labelSuffix;
}
