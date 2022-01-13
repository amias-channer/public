import * as React from 'react';
import prepareFormValue from '../prepare-form-value';

export default function useFormInputChangeHandler<T extends {}>(setFormData: React.Dispatch<React.SetStateAction<T>>) {
    return (event: React.FormEvent<HTMLInputElement | HTMLSelectElement>) => {
        const el = event.currentTarget;
        const {name} = el;
        const value = prepareFormValue(el);

        setFormData((formData) => (name in formData ? {...formData, [name]: value} : formData));
    };
}
