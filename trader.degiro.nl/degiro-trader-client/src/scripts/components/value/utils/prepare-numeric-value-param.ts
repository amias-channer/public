export default function prepareNumericValueParam(value: number | string | undefined | null): number | undefined | null {
    return typeof value === 'string' ? parseFloat(value) : value;
}
