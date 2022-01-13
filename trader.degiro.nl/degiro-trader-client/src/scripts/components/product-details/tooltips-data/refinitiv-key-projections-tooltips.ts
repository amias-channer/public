export default {
    Price: {
        label: 'Price',
        title: "Price Instrument's Price, Closing Or Last Bid:",
        content: `This is the close price for the issue from the day it last traded. 
            It is also referred to as the Current Price.  Note that some issues may not trade every day, 
            and therefore it is possible for this price to come from a date prior to the last business day.`
    },
    LongTermGrowthRate: {
        label: 'Long Term Growth Rate',
        title: 'Growth Rate%, Revenue, 3 Year:',
        content: `The Revenue Growth Rate is the compound annual growth rate of Revenue Per Share. 
            REVGR% is calculated for 3 years whenever 4 years of Revenue are available and the Revenues are positive. 
            If the required 4 years are not available for any given company, 
            the result is a NM (Not Meaningful) or a NA (Not Available) depending on the condition.`
    },
    PEINCLXOR: {
        label: 'PE (TTM)',
        title: 'Price To Earnings (P/E) Including Extraordinary Items, Trailing 12 Months (TTM):',
        content: `This ratio is calculated by dividing the current Price by the sum of the Diluted Earnings Per 
            Share including discontinued operations AFTER Extraordinary Items and Accounting Changes over the 
            last four interim periods.`
    },
    APR2REV: {
        label: 'Price/Sales (LFY)',
        title: 'Price To Sales (P/S), Last Fiscal Year (LFY):',
        content: 'This is the current Price divided by the Sales Per Share for the most recent fiscal year.'
    },
    AREVPS: {
        label: 'Sales/Shares (LFY)',
        title: 'Revenue/Share, Last Fiscal Year (LFY):',
        content: `This value is the Total Revenue for the most recent fiscal year divided by 
            the Average Diluted Shares Outstanding for the same period.`
    },
    AREV: {
        label: 'Sales (LFY)',
        title: 'Revenue, Last Fiscal Year (LFY):',
        content: 'This is the sum of all sales reported for all operating divisions for the most recent fiscal year.'
    },
    SREV: {
        label: 'Quarterly Sales (MRQ)',
        title: 'Revenue, Most Recent Quarter (MRQ):',
        content: 'This is the sum of all sales reported for all operating divisions for the most recent fiscal quarter.'
    },
    TTMEPSINCX: {
        label: 'EPS (TTM)',
        title: 'Earnings Per Share (EPS) Including Extraordinary Items, Trailing 12 Months (TTM):',
        content: `This is the Adjusted Income Available to Common Stockholders for the trailing twelve 
            months plus Discontinued Operations, Extraordinary Items, and Cumulative Effect of Accounting Changes 
            for the same period divided by the trailing twelve month Diluted Weighted Average Shares Outstanding`
    },
    EPSActualQ: {
        label: 'Quarterly EPS (MRQ)',
        title: 'Earnings Per Share (EPS) Including Extraordinary Items, Most Recent Quarter (MRQ):',
        content: `This is the Adjusted Income Available to Common Stockholders for the last quarter plus 
            Discontinued Operations, Extraordinary Items, and Cumulative Effect of Accounting Changes 
            for the same period divided by the quarter Diluted Weighted Average Shares Outstanding`
    },
    ADIVSHR: {
        label: 'DPS (LFY)',
        title: 'Dividend Per Share, Last Fiscal Year (LFY):',
        content: 'This is the Dividend Per Share amount paid by the company for the most recent fiscal year.'
    }
};
