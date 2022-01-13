import parseNumber from '../../utils/number/parse-number';
/**
 * @param {HTMLFormElement | null | undefined} form
 * @param {Object} [options]
 * @returns {Object} formData
 */
export default function getFormData(form, options) {
    const formData = {};
    const keepOriginValue = Boolean(options && options.keepOriginValue);
    const elements = form
        ? form.querySelectorAll('input[name],select[name],textarea[name]')
        : [];
    [].forEach.call(elements, (el) => {
        const { value, type, name, inputMode } = el;
        if (!keepOriginValue &&
            // [PROSET-2029]
            (inputMode === 'decimal' ||
                inputMode === 'numeric' ||
                type === 'number' ||
                type === 'tel' ||
                el.getAttribute('data-type') === 'number')) {
            if (value.trim() !== '') {
                formData[name] = parseNumber(value);
            }
        }
        else if (type === 'checkbox') {
            formData[name] = el.checked;
        }
        else if (type === 'radio') {
            const { checked } = el;
            if (checked) {
                formData[name] = el.getAttribute('data-value') || checked;
            }
        }
        else {
            formData[name] = value;
        }
    });
    return formData;
}
//# sourceMappingURL=get-form-data.js.map