import getIntervalSize from './get-interval-size';
/**
 * [t][----]
 * @param {Interval} target
 * @param {Interval} ref
 * @returns {Interval}
 */
export default function putIntervalBefore(target, ref) {
    return {
        start: ref.start - getIntervalSize(target),
        end: ref.start
    };
}
//# sourceMappingURL=put-interval-before.js.map