import isValidDate from 'frontend-core/dist/utils/date/is-valid-date';

export default function prepareFormValue(el: HTMLElement): undefined | boolean | string {
    const {type, checked, value} = el as HTMLInputElement;

    if (type === 'date') {
        const date: Date = new Date(value as string);

        if (isValidDate(date)) {
            return date.toISOString().split('T')[0];
        }

        return;
    }

    if (type === 'checkbox') {
        return checked;
    }

    if (type === 'radio') {
        // [WF-1767] IE11 doesn't support a custom [value] attribute for the radio buttons
        const radioValue: string | null = el.getAttribute('data-value');

        if (radioValue != null) {
            if (radioValue === 'true' || radioValue === 'false') {
                return radioValue === 'true';
            }

            return radioValue;
        }

        if (['on', 'off', 'true', 'false'].includes(value as string)) {
            return value === 'true' || value === 'on';
        }
    }

    return value;
}
