interface Options {
    min: number;
    max: number;
    numberOfValues: number;
    fractionSize?: number;
}

export default function getValues({min, max, numberOfValues, fractionSize = 0}: Options): number[] {
    const decimalPrecisionCoefficient: number = Math.pow(10, fractionSize);
    const adjustedMin: number = Math.floor(min * decimalPrecisionCoefficient);
    const adjustedMax: number = Math.ceil(max * decimalPrecisionCoefficient);
    const range: number = adjustedMax - adjustedMin;
    const numberOfIntervals: number = numberOfValues - 1;
    const intervalSize: number = Math.ceil(range / numberOfIntervals);
    const shortage: number = numberOfIntervals * intervalSize - range;
    const values: number[] = [];

    for (let i = 0; i < numberOfValues; i++) {
        const value: number =
            i === 0
                ? (adjustedMin - Math.ceil(shortage / 2)) / decimalPrecisionCoefficient
                : values[values.length - 1] + intervalSize / decimalPrecisionCoefficient;

        values.push(Number(value.toFixed(fractionSize)));
    }

    return values;
}
