import getIntervalMiddle from './get-interval-middle';
import getIntervalSize from './get-interval-size';
/**
 * [--[t]--]
 * @param {Interval} target
 * @param {Interval} ref
 * @returns {Interval}
 */
export default function putIntervalInMiddle(target, ref) {
    const center = getIntervalMiddle(ref);
    const targetSize = getIntervalSize(target);
    return { start: center - targetSize / 2, end: center + targetSize / 2 };
}
//# sourceMappingURL=put-interval-in-middle.js.map