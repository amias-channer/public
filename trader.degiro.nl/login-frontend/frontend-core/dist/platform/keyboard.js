const keyCodes = {
    40: 'ArrowDown',
    38: 'ArrowUp',
    39: 'ArrowRight',
    37: 'ArrowLeft',
    13: 'Enter',
    8: 'Backspace',
    46: 'Delete',
    9: 'Tab',
    27: 'Esc',
    // NumLock keys
    96: '0',
    97: '1',
    98: '2',
    99: '3',
    100: '4',
    101: '5',
    102: '6',
    103: '7',
    104: '8',
    105: '9',
    190: '.',
    188: ','
};
/**
 * @type {RegExp}
 */
const digitKeyPattern = /^[0-9]+$/;
/**
 * @param {KbEvent} event
 * @returns {string}
 */
export function getKeyString(event) {
    const { key, keyCode, keyIdentifier } = event;
    if (key && key !== 'Unidentified') {
        return key;
    }
    // fallback for special controls
    if (keyCodes[keyCode]) {
        return keyCodes[keyCode];
    }
    // fallback for Safari
    if (keyIdentifier) {
        const charCode = parseInt(keyIdentifier.substr(2), 16);
        return String.fromCharCode(charCode);
    }
    // fallback for browsers with non-standard behaviour
    return String.fromCharCode(keyCode);
}
/**
 * @param {KbEvent} event
 * @param {string} keyName
 * @returns {boolean}
 */
export function isKey(event, keyName) {
    return getKeyString(event) === keyName;
}
/**
 * @param {KbEvent} event
 * @returns {boolean}
 */
export function isDigitKey(event) {
    const key = getKeyString(event);
    return digitKeyPattern.test(key);
}
//# sourceMappingURL=keyboard.js.map