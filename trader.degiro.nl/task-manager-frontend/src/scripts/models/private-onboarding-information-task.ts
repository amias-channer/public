import {BankAccountInfo, BankAccountStatuses} from 'frontend-core/dist/models/bank';

export interface PrivateOnboardingBankAccountInfo extends Partial<BankAccountInfo> {
    status?: BankAccountStatuses;
}

export interface PrivateOnboardingInformation {
    // Full name form
    firstName: string;
    lastName: string;

    // Address
    streetAddress: string;
    streetAddressNumber: string;
    streetAddressExt: string;
    zip: string;
    city: string;
    country: string;

    // Birth data
    dateOfBirth: string;
    placeOfBirth: string;
    countryOfBirth: string;

    // Us person
    isUsPerson: boolean;

    // Bank account
    bankAccount: PrivateOnboardingBankAccountInfo;
}

export type UsPersonInformation = Pick<PrivateOnboardingInformation, 'isUsPerson'>;

export interface PersonInformationUsPersonData {
    isUsPerson: boolean;
    isBirthPlaceQuestionApproved?: boolean;
    isParentsQuestionApproved?: boolean;
    isPassportQuestionApproved?: boolean;
    isCitizenshipQuestionApproved?: boolean;
    isResidencePermitQuestionApproved?: boolean;
    isSubstantialPresenceQuestionApproved?: boolean;
    isOtherReasonQuestionApproved?: boolean;
    [key: string]: boolean | undefined;
}

export enum AdditionalQuestionsFields {
    BIRTH_PLACE = 'isBirthPlaceQuestionApproved',
    CITIZENSHIP = 'isCitizenshipQuestionApproved',
    OTHER_REASON = 'isOtherReasonQuestionApproved',
    PARENTS = 'isParentsQuestionApproved',
    PASSPORT = 'isPassportQuestionApproved',
    RESIDENCE_PERMIT = 'isResidencePermitQuestionApproved',
    SUBSTANTIAL_PRESENCE = 'isSubstantialPresenceQuestionApproved'
}

export const additionalQuestionsFields: AdditionalQuestionsFields[] = [
    AdditionalQuestionsFields.BIRTH_PLACE,
    AdditionalQuestionsFields.PARENTS,
    AdditionalQuestionsFields.PASSPORT,
    AdditionalQuestionsFields.CITIZENSHIP,
    AdditionalQuestionsFields.RESIDENCE_PERMIT,
    AdditionalQuestionsFields.SUBSTANTIAL_PRESENCE,
    AdditionalQuestionsFields.OTHER_REASON
];
