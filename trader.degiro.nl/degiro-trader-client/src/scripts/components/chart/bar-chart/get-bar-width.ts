import {defaultBarWidth, grid, minBarGap} from '../constants';

export default function getBarWidth(plotWidth: number, barCount: number): number {
    let barWidth = defaultBarWidth;

    while ((barWidth + minBarGap) * barCount > plotWidth && barWidth > grid) {
        barWidth -= grid;
    }

    return barWidth;
}
