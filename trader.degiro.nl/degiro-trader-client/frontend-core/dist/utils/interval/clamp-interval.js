import getIntervalSize from './get-interval-size';
export default function clampInterval(boundaries, target) {
    const targetSize = getIntervalSize(target);
    const boundariesSize = getIntervalSize(boundaries);
    if (targetSize > boundariesSize) {
        return { start: boundaries.start, end: boundaries.start + targetSize };
    }
    if (target.start < boundaries.start) {
        return { start: boundaries.start, end: boundaries.start + targetSize };
    }
    if (target.end > boundaries.end) {
        return { start: boundaries.end - targetSize, end: boundaries.end };
    }
    return target;
}
//# sourceMappingURL=clamp-interval.js.map