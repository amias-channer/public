import {VwdChart} from '../../models/vwd-api';

export type CancelSchedule = () => void;

export default function scheduleChartSizeCalculation(chart: VwdChart): CancelSchedule {
    let frameRequestId: number;
    let chartBox: DOMRect | ClientRect | undefined;
    const onFrame = () => {
        const chartContainer = chart && chart.container;
        const highcharts = chart && chart.internal && chart.internal.component;

        if (chartContainer && highcharts) {
            const newChartBox = chartContainer.getBoundingClientRect();
            const {width, height} = newChartBox;
            const sizeChangeThreshold = 20;

            if (
                !chartBox ||
                Math.abs(chartBox.width - width) > sizeChangeThreshold ||
                Math.abs(chartBox.height - height) > sizeChangeThreshold
            ) {
                // [width, height, animation] https://api.highcharts.com/class-reference/Highcharts.Chart#setSize
                highcharts.setSize(width, height, false);
            }
            chartBox = newChartBox;
        }

        frameRequestId = requestAnimationFrame(onFrame);
    };

    frameRequestId = requestAnimationFrame(onFrame);

    return () => {
        cancelAnimationFrame(frameRequestId);
        chartBox = undefined;
    };
}
