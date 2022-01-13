import getIntervalSize from './get-interval-size';
import range from '../range';
export default function divideIntervalIntoEqualParts(interval, numberOfParts) {
    const partSize = getIntervalSize(interval) / numberOfParts;
    return range(0, numberOfParts - 1).map((_, i) => ({
        start: interval.start + partSize * i,
        end: interval.start + partSize * (i + 1)
    }));
}
//# sourceMappingURL=divide-interval-into-equal-parts.js.map