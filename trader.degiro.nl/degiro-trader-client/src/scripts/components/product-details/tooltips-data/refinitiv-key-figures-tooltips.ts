export default {
    MKTCAP: {
        label: 'Market Cap',
        title: 'Market Capitalization:',
        content:
            'This value is calculated by multiplying the current Price by the current number of Shares Outstanding.'
    },
    TTMREV: {
        label: 'Revenue (TTM)',
        title: 'Revenue, Trailing 12 Months (TTM):',
        content: `This is the sum of all revenue (sales) 
        reported for all operating divisions for the most recent TTM period. 
        NOTE: Most banks and Insurance companies do not report revenues 
        when they announce their preliminary quarterly financial results in the press. 
        When this happens, the quarterly value will not be available (NA).`
    },
    TTMEBITD: {
        label: 'EBITDA (TTM)',
        title: 'EBITD, Trailing 12 Months (TTM):',
        content: `Earnings Before Interest, Taxes, Depreciation and Amortization (EBITDA) is 
        EBIT for the trailing twelve months plus the same period's Depreciation 
        and Amortization expenses (from the Statement of Cash Flows). 
        NOTE: This item is only available for Industrial and Utility companies.`
    },
    TTMNIAC: {
        label: 'Rev/Shr (TTM)',
        title: 'Net Income Available To Common Shareholders, Trailing 12 Months (TTM):',
        content: `This is the trailing twelve month dollar amount accruing to
        common shareholders for dividends and retained earnings. 
        Income Available to Common Shareholders is calculated as trailing twelve month Income After Taxes plus 
        Minority Interest and Equity in Affiliates plus Preferred Dividends, 
        General Partner Distributions and US GAAP Adjustments. 
        NOTE: Any adjustment that is negative (ie. Preferred Stock Dividends) would be 
        subtracted from Income After Taxes.`
    },
    PEEXCLXOR: {
        label: 'PE Exc xOr Itms',
        title: 'Price To Earnings (P/E) Excluding Extraordinary Items, Last Fiscal Year (LFY):',
        content: `This ratio is calculated by dividing the current Price by 
        the sum of the Diluted Earnings Per Share from 
        continuing operations BEFORE Extraordinary Items and 
        Accounting Changes for the latest annual period.`
    },
    TargetPrice: {
        label: 'Target Price',
        title: 'Target Price:',
        content: `A target price is an estimate of a stock's future price, 
        based on earnings forecasts and assumed valuation multiples. 
        When it comes to evaluating stocks, target prices can be even more useful than an equity analyst's rating.`
    },
    ProjEPS: {
        label: 'Proj EPS',
        title: 'Projected Earnings Per Share (EPS)',
        content: ''
    },
    TTMDIVSHR: {
        label: 'Div/Shr (TTM)',
        title: 'Dividends Per Share, Trailing 12 Months (TTM):',
        content: `This is the sum of the Cash Dividends per share paid to 
        common stockholders during the last trailing twelve month period.`
    }
};
