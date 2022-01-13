function getMagnitude(num: number): number {
    return Math.pow(10, Math.floor(Math.log(num) / Math.LN10)) || 1;
}

const scaleMultiples = [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10];

export default function getTickInterval(min: number, max: number, count: number): number {
    const tickInterval = (max - min) / Math.max(count - 1, 1);
    const magnitude = getMagnitude(tickInterval);
    const intervalMultiple = Number(scaleMultiples.find((multiple) => multiple * magnitude >= tickInterval));

    return intervalMultiple * magnitude;
}
