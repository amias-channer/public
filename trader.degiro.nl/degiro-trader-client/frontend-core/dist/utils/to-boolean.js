const booleanValuePattern = /^true|false$/i;
export default function toBoolean(value) {
    const preparedValue = String(value);
    if (booleanValuePattern.test(preparedValue)) {
        return preparedValue.toLowerCase() === 'true';
    }
    return Boolean(value);
}
//# sourceMappingURL=to-boolean.js.map