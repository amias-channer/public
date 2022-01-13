const strategyTypes: {
    [key: string]: string;
} = {
    CallButterfly: 'Call Butterfly',
    PutButterfly: 'Put Butterfly',
    FuturesButterfly: 'Futures Butterfly',
    CallSpread: 'Call Spread',
    PutSpread: 'Put Spread',
    CallCalendarSpread: 'Call Calendar Spread',
    PutCalendarSpread: 'Put Calendar Spread',
    CalendarSpread: 'Calendar Spread',
    CallDiagonalCalendarSpread: 'Call Diagonal Calendar Spread',
    PutDiagonalCalendarSpread: 'Put Diagonal Calendar Spread',
    Guts: 'Guts',
    _2x1RatioCallSpread: '2x1 Ratio Call Spread',
    _2x1RatioPutSpread: '2x1 Ratio Put Spread',
    IronButterfly: 'Iron Butterfly',
    Combo: 'Combo',
    Strangle: 'Strangle',
    CallLadder: 'Call Ladder',
    PutLadder: 'Put Ladder',
    Strip: 'Strip',
    CallStrip: 'Call Strip',
    PutStrip: 'Put Strip',
    StraddleStrip: 'Straddle Strip',
    StraddleCalendarSpread: 'Straddle Calendar Spread',
    Pack: 'Pack',
    DiagonalStraddleCalendarSpread: 'Diagonal Straddle Calendar Spread',
    ReversalConversion: 'Reversal Conversion',
    Straddle: 'Straddle',
    OptionsCondor: 'Options Condor',
    Condor: 'Condor',
    IronCondor: 'Iron Condor',
    Box: 'Box',
    SyntheticUnderlying: 'Synthetic Underlying'
};

export default function getCombinationOrderStrategy(strategyId: string): string | undefined {
    return strategyTypes[strategyId.replace('combi.strategy.', '')];
}
