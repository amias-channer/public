import getIntervalSize from './get-interval-size';
/**
 * [----][t]
 * @param {Interval} target
 * @param {Interval} ref
 * @returns {Interval}
 */
export default function putIntervalAfter(target, ref) {
    return {
        start: ref.end,
        end: ref.end + getIntervalSize(target)
    };
}
//# sourceMappingURL=put-interval-after.js.map