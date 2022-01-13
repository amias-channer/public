import getIntervalSize from './get-interval-size';
/**
 * [[t]----]
 * @param {Interval} target
 * @param {Interval} ref
 * @returns {Interval}
 */
export default function putIntervalAfterStart(target, ref) {
    return {
        start: ref.start,
        end: ref.start + getIntervalSize(target)
    };
}
//# sourceMappingURL=put-interval-after-start.js.map