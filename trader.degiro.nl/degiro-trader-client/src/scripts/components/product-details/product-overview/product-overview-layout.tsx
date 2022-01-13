import * as React from 'react';
import Grid from '../../grid';
import {LayoutColumnsCount} from '../index';

interface Props {
    layoutColumnsCount: LayoutColumnsCount;
    chart: React.ReactElement;
    pricingData: React.ReactElement;
    productNote: React.ReactElement;
    warning?: React.ReactElement;
    orderBook?: React.ReactElement;
    news?: React.ReactElement;
    information?: React.ReactElement;
    companyRatios?: React.ReactElement;
    financials?: React.ReactElement;
    analyst?: React.ReactElement;
    agenda?: React.ReactElement;
    keyFigures?: React.ReactElement;
}

const ProductOverviewLayout: React.FunctionComponent<Props> = ({
    layoutColumnsCount,
    warning,
    chart,
    pricingData,
    orderBook,
    news,
    information,
    companyRatios,
    financials,
    analyst,
    agenda,
    keyFigures,
    productNote
}) => {
    if (layoutColumnsCount === 3) {
        return (
            <Grid container={true}>
                {warning && <Grid size={12}>{warning}</Grid>}
                <Grid container={true} size={8}>
                    <Grid size={12}>{chart}</Grid>
                    {news && <Grid size={12}>{news}</Grid>}
                    {information && (
                        <Grid stretch={true} size={6}>
                            {information}
                        </Grid>
                    )}
                    {companyRatios && (
                        <Grid stretch={true} size={6}>
                            {companyRatios}
                        </Grid>
                    )}
                    {financials && (
                        <Grid stretch={true} size={6}>
                            {financials}
                        </Grid>
                    )}
                    {analyst && (
                        <Grid stretch={true} size={6}>
                            {analyst}
                        </Grid>
                    )}
                </Grid>
                <Grid container={true} size={4}>
                    <Grid size={12}>{productNote}</Grid>
                    <Grid size={12}>{pricingData}</Grid>
                    {orderBook && <Grid size={12}>{orderBook}</Grid>}
                    {agenda && <Grid size={12}>{agenda}</Grid>}
                    {keyFigures && <Grid size={12}>{keyFigures}</Grid>}
                </Grid>
            </Grid>
        );
    }

    if (layoutColumnsCount === 2) {
        return (
            <Grid container={true}>
                {warning && <Grid size={12}>{warning}</Grid>}
                <Grid size={12}>{chart}</Grid>
                <Grid container={true} size={6}>
                    <Grid size={12}>{productNote}</Grid>
                    <Grid size={12}>{pricingData}</Grid>
                </Grid>
                <Grid container={true} size={6}>
                    {orderBook && <Grid size={12}>{orderBook}</Grid>}
                    {agenda && <Grid size={12}>{agenda}</Grid>}
                    {keyFigures && <Grid size={12}>{keyFigures}</Grid>}
                </Grid>
                {news && <Grid size={12}>{news}</Grid>}
                {information && (
                    <Grid stretch={true} size={6}>
                        {information}
                    </Grid>
                )}
                {companyRatios && (
                    <Grid stretch={true} size={6}>
                        {companyRatios}
                    </Grid>
                )}
                {financials && (
                    <Grid stretch={true} size={6}>
                        {financials}
                    </Grid>
                )}
                {analyst && (
                    <Grid stretch={true} size={6}>
                        {analyst}
                    </Grid>
                )}
            </Grid>
        );
    }

    // layoutColumnsCount === 1
    return (
        <Grid container={true}>
            {warning && <Grid size={12}>{warning}</Grid>}
            <Grid size={12}>{chart}</Grid>
            <Grid size={12}>{productNote}</Grid>
            <Grid size={12}>{pricingData}</Grid>
            {orderBook && <Grid size={12}>{orderBook}</Grid>}
            {agenda && <Grid size={12}>{agenda}</Grid>}
            {keyFigures && <Grid size={12}>{keyFigures}</Grid>}
            {news && <Grid size={12}>{news}</Grid>}
            {information && <Grid size={12}>{information}</Grid>}
            {companyRatios && <Grid size={12}>{companyRatios}</Grid>}
            {financials && <Grid size={12}>{financials}</Grid>}
            {analyst && <Grid size={12}>{analyst}</Grid>}
        </Grid>
    );
};

export default React.memo(ProductOverviewLayout);
