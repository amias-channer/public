function toNumericVersion(version) {
    const versionParts = version.split('.').map((value) => Number(value));
    return versionParts[0] * 100000 + versionParts[1] * 100 + versionParts[2];
}
export default function compareSemversions(firstVersion, secondVersion, comparisonOperator) {
    const firstNumericVersion = toNumericVersion(firstVersion);
    const secondNumericVersion = toNumericVersion(secondVersion);
    if (isNaN(firstNumericVersion) || isNaN(secondNumericVersion)) {
        return false;
    }
    switch (comparisonOperator) {
        case '>':
            return firstNumericVersion > secondNumericVersion;
        case '<':
            return firstNumericVersion < secondNumericVersion;
        case '>=':
            return firstNumericVersion >= secondNumericVersion;
        case '<=':
            return firstNumericVersion <= secondNumericVersion;
        case '==':
            return firstNumericVersion === secondNumericVersion;
    }
}
//# sourceMappingURL=compare-semversions.js.map