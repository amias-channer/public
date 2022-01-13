import {VwdChartUpdateOptions} from './index';

export default function isStreamingEnabled(options: Partial<VwdChartUpdateOptions> | undefined): boolean {
    if (!options) {
        return false;
    }
    const {streaming, period, resolution} = options;

    // [VWD case 00025833]
    return streaming !== false && period === 'P1D' && resolution !== 'PT1S' && resolution !== 'PT15S';
}
