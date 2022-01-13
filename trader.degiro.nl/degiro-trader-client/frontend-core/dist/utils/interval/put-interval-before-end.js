import getIntervalSize from './get-interval-size';
/**
 * [---[t]]
 * @param {Interval} target
 * @param {Interval} ref
 * @returns {Interval}
 */
export default function putIntervalBeforeEnd(target, ref) {
    return {
        start: ref.end - getIntervalSize(target),
        end: ref.end
    };
}
//# sourceMappingURL=put-interval-before-end.js.map