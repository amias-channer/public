type OptionalNumber = number | undefined;

export default function getFractionSize(values: [OptionalNumber, ...OptionalNumber[]]): number {
    const absoluteMin: number = Math.min(...values.map((value) => Math.abs(value || Infinity)));

    if (absoluteMin > 1000) {
        return 0;
    }

    if (absoluteMin > 100) {
        return 1;
    }

    if (absoluteMin > 1) {
        return 2;
    }

    return 3;
}
