import getTickInterval from './get-tick-interval';
import getTickPositions from './get-tick-positions';

export default function getSingleAxisTicks(min: number, max: number, ticksCount: number): number[] {
    const tickInterval: number = getTickInterval(min, max, ticksCount);

    return getTickPositions(tickInterval, min, max);
}
