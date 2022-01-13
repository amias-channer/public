export default function getTickPositions(tickInterval: number, min: number, max: number): number[] {
    const roundedMin = tickInterval === 0 ? 0 : Math.floor(min / tickInterval) * tickInterval;
    const roundedMax = tickInterval === 0 ? 0 : Math.ceil(max / tickInterval) * tickInterval;
    const ticks: number[] = [];
    let currentTick = roundedMin;

    while (currentTick < roundedMax) {
        ticks.push(currentTick);
        currentTick += tickInterval;
    }
    ticks.push(currentTick);

    return ticks;
}
