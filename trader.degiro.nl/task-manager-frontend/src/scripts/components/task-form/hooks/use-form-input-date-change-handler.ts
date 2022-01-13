import * as React from 'react';

export default function useFormInputDateChangeHandler<T extends {}>(
    setFormData: React.Dispatch<React.SetStateAction<T>>
) {
    return (value: string, name: string) => setFormData((formData) => ({...formData, [name]: value}));
}
