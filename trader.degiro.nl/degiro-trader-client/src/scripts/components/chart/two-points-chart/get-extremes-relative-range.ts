import getExtremesCoefficient from './get-extremes-coefficient';

interface Options {
    firstValue: number;
    secondValue: number;
}

export default function getExtremesRelativeRange({firstValue, secondValue}: Options): {min: number; max: number} {
    const average: number = (firstValue + secondValue) / 2;
    const range: number = Math.abs(secondValue - firstValue);
    const extremesCoefficient: number = getExtremesCoefficient((range / firstValue) * 100);

    return {
        min: average - (range / 2) * extremesCoefficient,
        max: average + (range / 2) * extremesCoefficient
    };
}
