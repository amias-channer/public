export default {
    CurrentPrice: {
        label: 'Latest',
        title: 'Latest Price:',
        content: 'The price of the most recent transaction.'
    },
    CombinedLastDateTime: {
        label: 'Last Deal',
        title: 'Last Deal Time:',
        content: 'The time of the most recent transaction.'
    },
    CumulativeVolume: {
        label: 'Volume',
        title: 'Volume:',
        content: `Volume of trade is the total accumulated quantity of 
contracts traded during a trading day for a specified instrument.`
    },
    VOL10DAVG: {
        label: 'Volume 10D Day Average',
        title: 'Average Trading Volume For The Last 10 Days:',
        content: 'This is the daily average of the cumulative trading volume for the last 10 days.'
    },
    BidPrice: {
        label: 'Bid',
        title: 'Bid Price:',
        content: `A Bid is an offer made by an investor, trader, or dealer in an effort to buy a 
security, commodity, currency or other. A Bid stipulates the price the potential buyer is willing to pay, as well as 
the quantity he or she will purchase, for that proposed price. In opposite the Ask is the price a seller is willing 
to accept, and the Ask will always be higher than the Bid.`
    },
    AskPrice: {
        label: 'Ask',
        title: 'Ask Price:',
        content: `The Ask is the price a seller is willing to accept for a security, commodity, 
currency or other, which is often referred to as the offer price. 
Along with the price, the Ask quote might also stipulate the amount available to be sold at the stated price. 
In opposite the Bid is the price a buyer is willing to pay, and the Ask will always be higher than the Bid.`
    },
    BidVolume: {
        label: 'Bid Vol.',
        title: 'Bid Volume:',
        content: `
Order Book's current top Bid Volume`
    },
    AskVolume: {
        label: 'Ask Vol.',
        title: 'Ask Volume:',
        content: `
Order Book's current top Ask Volume`
    },
    AbsoluteDifference: {
        label: '+/-',
        title: 'Nominal Price Change:',
        content: `This is the nominal change in the company's stock 
price since the close of the last trading day.`
    },
    RelativeDifference: {
        label: '+/-%',
        title: 'Percentage Price Change:',
        content: `This is the percentage change in the company's stock 
price since the close of the last trading day.`
    },
    LowPrice: {
        label: 'Low',
        title: 'Low Price:',
        content: `Today’s low is a security's intraday low trading price. Today's low is the 
lowest price at which a stock trades over the course of a trading day. Today's low is typically lower than the opening 
or closing price, as it is unusual that the lowest price of the day would happen to occur at those particular moments. 
Today's low and today's high are important to day traders and technical analysts, who seek to earn profits from a 
security's short-term price movements and identify and track trends. Studying these benchmarks can help investors 
and analysts spot emerging trends, which can also allow them to react quickly to evolving shifts.`
    },
    HighPrice: {
        label: 'High',
        title: 'High Price:',
        content: `Today's high refers to a security's intraday high trading price. 
Today's high is the highest price at which a stock traded during the course of the trading day. 
Today's high is typically higher than the closing or opening price. More often than not this is higher than the 
closing price. It may be used when calculating a moving average. 
This can be contrasted with today's low, or the trading day's intraday low price.`
    },
    OpenPrice: {
        label: 'Open',
        title: 'Open Price:',
        content: `The opening price is the price at which a security first trades upon the 
opening of an exchange on a trading day; for example, the New York Stock Exchange (NYSE) opens at precisely 9:30 a.m. 
Eastern time. The price of the first trade for any listed stock is its daily opening price. The opening price is an 
important marker for that day's trading activity, particularly for those interested in measuring short-term results 
such as day traders.`
    },
    CurrentClosePrice: {
        label: 'Close',
        title: 'Close Price:',
        content: `Even in the era of 24-hour trading, there is a closing price for any stock 
or other security, and it is the final price at which it trades during regular market hours on any given day. 
The closing price is considered the most accurate valuation of a stock or other security until trading resumes 
on the next trading day. Most stocks and other financial instruments are traded after-hours, although in far 
smaller volumes. Therefore, the closing price of any security is often different from its after-hours price.`
    },
    PRYTDPCT: {
        label: 'YTD +/-%',
        title: 'Price, YTD Price Percent Change:',
        content: `This is the percentage change in the company's 
stock price since the close of the last trading day of the previous year.`
    },
    VOL3MAVG: {
        label: 'Volume 3M Month Average',
        title: 'Average Trading Volume For The Last 3 Months:',
        content: `This is the monthly average of the 
cumulative trading volume during the last three months. It is calculated by dividing the cumulative trading 
volume of the last 91 days by 3.`
    },
    NLOW: {
        label: '12M Low',
        title: 'Price, 12 Month Low:',
        content: `This price is the lowest Price the stock traded at 
in the last 12 months. This could be an intra-day low.`
    },
    NHIG: {
        label: '12M High',
        title: 'Price, 12 Month High:',
        content: `This price is the highest Price the stock traded at 
in the last 12 months. This could be an intra-day high.`
    },
    symbol: {
        label: 'Symbol',
        title: 'Ticker Symbol:',
        content: `A ticker symbol is an arrangement of characters—usually 
letters—representing particular securities listed on an exchange or otherwise traded publicly. 
When a company issues securities to the public marketplace, it selects an available ticker symbol for its securities 
that investors and traders use to transact orders. Every listed security has a unique ticker symbol, facilitating 
the vast array of trade orders that flow through the financial markets every day.`
    },
    totalFloat: {
        label: 'Shares Floating',
        title: 'Shares Floating:',
        content: `Floating stock is the number of shares available for trading of a 
particular stock. Low float stocks are those with a low number of shares. Floating stock is calculated by subtracting 
closely-held shares and restricted stock from a firm’s total outstanding shares. Closely-held shares are those 
owned by insiders, major shareholders, and employees. Restricted stock refers to insider shares that cannot be 
traded because of a temporary restriction such as the lock-up period after an initial public offering.`
    },
    sharesOut: {
        label: 'Shares Outstanding',
        title: 'Shares Outstanding:',
        content: `A company’s shares outstanding are the total number of shares 
issued and actively held by shareholders. A company may provide executives with stock options that allow conversion 
to stock but such stock benefits are not included in shares outstanding until shares have been fully issued. 
Stock benefits are one consideration in the number of authorized shares as they count in the authorized share bucket.`
    },
    ISIN: {
        label: 'ISIN',
        title: 'International Securities Identification Number (ISIN):',
        content: `This is a code that uniquely identifies a specific securities issue. 
The organization that allocates ISINs in any particular country is 
the country's respective National Numbering Agency (NNA). An ISIN is often confused with a ticker symbol, 
which identifies the stock at the exchange level. For example, according to ISIN Organization, 
IBM common stock is traded on close to 25 trading exchanges and platforms, and its stock 
has a different ticker symbol depending on where it is traded. However, IBM stock has only one 
ISIN for each security. The ISIN code identifies the securities, but it is the only common 
securities identification number that is universally recognized. ISINs are used for 
numerous reasons including clearing and settlement.`
    },
    exchange: {
        label: 'Exchange',
        title: 'Exchange:',
        content: `An Exchange is a centralized location where the publicly 
traded standardized investment instruments are bought and sold under strict regulation rules 
on the companies/assets listed, on investors and speculators behavior and others, 
all as necessary to provide maximum safety for everyone's investments.`
    },
    valueInProductCurrency: {
        label: 'Position',
        title: 'Current Position:',
        content: `This is the amount of a particular financial instrument held, 
based on the quantity and its current price.`
    },
    breakEvenPrice: {
        label: 'Break-Even Price',
        title: 'Break-Even Price:',
        content: `Break-even price is the amount of money, or change in value, 
for which an asset must be sold to cover the costs of acquiring and owning it. In trading, the break-even price is 
the stock price at which investors can choose to exercise or dispose of the contract without incurring a loss.`
    },
    todayPL: {
        label: 'P/L',
        title: 'Today’s Profit and Loss (P/L):',
        content: `This is the nominal change in the position's 
Profit and Loss (P/L) since the close of the last trading day.`
    },
    unrealisedPL: {
        label: 'Unrealised P/L',
        title: 'Unrealised Profit and Loss (P/L):',
        content: `Profits (gains) or Losses are said to be "realized" when 
a stock (or other investment) that you own is actually sold. 
Unrealized gains and losses are also commonly known as "paper" profits or losses. 
An unrealized loss occurs when a stock decreases after an investor buys it, 
but has yet to sell it. If a large loss remains unrealized, the investor is probably hoping the stock's 
fortunes will turn around and the stock's worth will increase past the price at which it was purchased 
(risking further losses). If the stock rises above the original purchase price, then the investor would 
have an unrealized gain for the time they hold onto the stock.`
    },
    totalPL: {
        label: 'Total P/L',
        title: 'Total Profit and Loss (P/L):',
        content: `The Total Profit and Loss (P/L) is a financial 
result that summarizes the total income and total expenses (realized and unrealized) of the trading activity so far.`
    }
};
