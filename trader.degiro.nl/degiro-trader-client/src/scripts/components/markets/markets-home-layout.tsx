import * as React from 'react';
import {LayoutColumnsCount} from './index';
import Grid from '../grid';

interface Props {
    layoutColumnsCount: LayoutColumnsCount;
    indices: React.ReactElement;
    movers: React.ReactElement;
    currencies: React.ReactElement;
    futures: React.ReactElement;
    commodity: React.ReactElement;
    agenda: React.ReactElement;
    latestNews: React.ReactElement;
    topNews: React.ReactElement;
    latestVideos: React.ReactElement;
    invitationPromotion?: React.ReactElement;
    feedbackPromotion?: React.ReactElement;
}

const MarketsHomeLayout: React.FunctionComponent<Props> = ({
    layoutColumnsCount,
    indices,
    movers,
    currencies,
    futures,
    commodity,
    agenda,
    latestNews,
    topNews,
    latestVideos,
    invitationPromotion,
    feedbackPromotion
}) => {
    // IMPORTANT: try to keep the tree of the nested Grid components as stable as possible!
    // This allows VDOM reconciler to keep the cards without mounting/unmounting.
    // E.g. when a right side panel appears or a user rotates his tablet we switch the layout from 3 columns to 2 and
    // this makes Indices, Latest News, Chart, etc. to reload
    //
    // Author: @dkniazevych
    if (layoutColumnsCount === 1) {
        return (
            <Grid container={true}>
                <Grid container={true} size={12}>
                    <Grid size={12}>{indices}</Grid>
                    <Grid size={12}>{movers}</Grid>
                    <Grid size={12}>{currencies}</Grid>
                    <Grid size={12}>{futures}</Grid>
                    <Grid size={12}>{commodity}</Grid>
                    <Grid size={12}>{latestVideos}</Grid>
                    <Grid size={12}>{invitationPromotion}</Grid>
                    <Grid size={12}>{feedbackPromotion}</Grid>
                </Grid>
            </Grid>
        );
    }

    if (layoutColumnsCount === 2) {
        return (
            <Grid container={true}>
                <Grid container={true} size={12}>
                    <Grid size={12}>{indices}</Grid>
                    <Grid container={true} size={12}>
                        <Grid size={6}>{latestNews}</Grid>
                        <Grid size={6}>{topNews}</Grid>
                    </Grid>
                    <Grid container={true} size={6}>
                        <Grid size={12}>{agenda}</Grid>
                        <Grid size={12}>{currencies}</Grid>
                        <Grid size={12}>{latestVideos}</Grid>
                    </Grid>
                    <Grid container={true} size={6}>
                        <Grid size={12}>{movers}</Grid>
                        <Grid size={12}>{futures}</Grid>
                        <Grid size={12}>{commodity}</Grid>
                        <Grid size={12}>{invitationPromotion}</Grid>
                        <Grid size={12}>{feedbackPromotion}</Grid>
                    </Grid>
                </Grid>
            </Grid>
        );
    }

    if (layoutColumnsCount === 3) {
        return (
            <Grid container={true}>
                <Grid container={true} size={8}>
                    <Grid size={12}>{indices}</Grid>
                    <Grid container={true} size={12}>
                        <Grid stretch={true} size={6}>
                            {latestNews}
                        </Grid>
                        <Grid size={6}>{topNews}</Grid>
                        <Grid size={12}>{latestVideos}</Grid>
                    </Grid>
                </Grid>
                <Grid container={true} size={4}>
                    <Grid size={12}>{movers}</Grid>
                    <Grid size={12}>{agenda}</Grid>
                    <Grid size={12}>{currencies}</Grid>
                    <Grid size={12}>{futures}</Grid>
                    <Grid size={12}>{commodity}</Grid>
                    <Grid size={12}>{invitationPromotion}</Grid>
                    <Grid size={12}>{feedbackPromotion}</Grid>
                </Grid>
            </Grid>
        );
    }

    return (
        <Grid container={true}>
            <Grid container={true} size={9}>
                <Grid container={true} size={12}>
                    <Grid size={4} stretch={true}>
                        {agenda}
                    </Grid>
                    <Grid size={8}>{indices}</Grid>
                </Grid>
                <Grid container={true} size={12}>
                    <Grid size={4}>{latestNews}</Grid>
                    <Grid container={true} size={8}>
                        <Grid size={12}>{topNews}</Grid>
                        <Grid size={12}>{latestVideos}</Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid container={true} size={3}>
                <Grid size={12}>{movers}</Grid>
                <Grid size={12}>{currencies}</Grid>
                <Grid size={12}>{futures}</Grid>
                <Grid size={12}>{commodity}</Grid>
                <Grid size={12}>{invitationPromotion}</Grid>
                <Grid size={12}>{feedbackPromotion}</Grid>
            </Grid>
        </Grid>
    );
};

export default React.memo(MarketsHomeLayout);
