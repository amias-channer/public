import * as React from 'react';
import Grid from '../../grid';
import {LayoutColumnsCount} from '../index';

interface Props {
    layoutColumnsCount: LayoutColumnsCount;
    keyProjections: React.ReactElement;
    buySellSurvey: React.ReactElement;
    estimations: React.ReactElement;
    disclaimer: React.ReactElement;
}

const ProductAnalystViewsLayout: React.FunctionComponent<Props> = ({
    layoutColumnsCount,
    keyProjections,
    buySellSurvey,
    estimations,
    disclaimer
}) => {
    if (layoutColumnsCount >= 3) {
        return (
            <Grid container={true} size={12}>
                <Grid container={true} size={8}>
                    <Grid size={12}>{keyProjections}</Grid>
                </Grid>
                <Grid container={true} size={4}>
                    <Grid size={12}>{buySellSurvey}</Grid>
                </Grid>
                <Grid size={12}>{estimations}</Grid>
                <Grid size={12}>{disclaimer}</Grid>
            </Grid>
        );
    }

    return (
        <Grid container={true}>
            <Grid size={12}>{buySellSurvey}</Grid>
            <Grid size={12}>{keyProjections}</Grid>
            <Grid size={12}>{estimations}</Grid>
            <Grid size={12}>{disclaimer}</Grid>
        </Grid>
    );
};

export default React.memo(ProductAnalystViewsLayout);
