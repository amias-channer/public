export default function getExtremesCoefficient(percentageDifference: number): number {
    const absolutePercentageDifference: number = Math.abs(percentageDifference);

    if (absolutePercentageDifference > 10) {
        return 1 / 0.75;
    }

    if (absolutePercentageDifference > 5) {
        return 1 / 0.5;
    }

    if (absolutePercentageDifference > 0) {
        return 1 / 0.25;
    }

    return 0;
}
