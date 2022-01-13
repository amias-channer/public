const convertDegreesToRadians = (degrees: number): number => (degrees * Math.PI) / 180;
const convertRadiansToDegrees = (radians: number): number => (radians * 180) / Math.PI;

interface Options {
    firstValue: number;
    secondValue: number;
    slopeCoefficient?: number;
    height: number;
    width: number;
}

export default function getExtremesAbsoluteRange({
    firstValue,
    secondValue,
    slopeCoefficient = 1,
    height,
    width
}: Options): {min: number; max: number} {
    const average: number = (firstValue + secondValue) / 2;
    const range: number = Math.abs(secondValue - firstValue);
    const absolutePercentageDeviation: number = Math.abs(range / firstValue) * 100;
    const absolutePercentageDeviationInDegrees: number = absolutePercentageDeviation / slopeCoefficient;
    const maxAlphaInDegrees: number = convertRadiansToDegrees(Math.atan(height / width));
    const alphaInDegrees: number =
        maxAlphaInDegrees > absolutePercentageDeviationInDegrees
            ? absolutePercentageDeviationInDegrees
            : maxAlphaInDegrees;
    const tangensAlpha: number = Math.tan(convertDegreesToRadians(alphaInDegrees));
    const extremesCoefficient: number = tangensAlpha ? height / width / tangensAlpha : 0;

    return {
        min: average - (range / 2) * extremesCoefficient,
        max: average + (range / 2) * extremesCoefficient
    };
}
