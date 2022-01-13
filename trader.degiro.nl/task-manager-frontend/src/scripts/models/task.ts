const currentYear = new Date().getFullYear();

export const minDateOfBirthYear: number = currentYear - 120;

// possible for MINOR accounts
export const maxDateOfBirthYear: number = currentYear;

// [CLM-3502] Spanish customer above 75 years old are issued an ID card with expiration date 1.1.9999
export const maxDateOfExpirationYear: number = 9999;

export enum TaskConfirmationTypes {
    AGREEMENT_CHECKBOX = 'AGREEMENT_CHECKBOX'
}

export interface TaskResult {
    nextTaskId?: number;
    confirmationType?: TaskConfirmationTypes;
}

export enum TaskConfirmationMethods {
    CALL = 'CALL',
    EMAIL = 'EMAIL',
    SMS = 'SMS'
}
