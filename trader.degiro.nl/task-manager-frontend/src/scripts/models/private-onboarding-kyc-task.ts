import {DocumentScannerResult, MrzInfo, MrzInfoGenders, ScannerDocumentTypes} from './fourthline';
import {PhoneNumberInformation} from './phone-information';
import {AdditionalQuestionsFields} from './private-onboarding-information-task';

export enum PrivateOnboardingKycTaskSteps {
    ACCOUNT_VERIFICATION = 'ACCOUNT_VERIFICATION',
    ADDRESS = 'ADDRESS',
    BANK_ACCOUNT = 'BANK_ACCOUNT',
    BIRTH_DATA = 'BIRTH_DATA',
    DUAL_NATIONALITY = 'DUAL_NATIONALITY',
    DUAL_NATIONALITY_INFORMATION = 'DUAL_NATIONALITY_INFORMATION',
    DUAL_NATIONALITY_SELECT = 'DUAL_NATIONALITY_SELECT',
    ERRORS_INFORMATION = 'ERRORS_INFORMATION',
    ID_UPLOAD = 'ID_UPLOAD',
    ID_UPLOAD_CONFIRMATION = 'ID_UPLOAD_CONFIRMATION',
    ID_UPLOAD_COUNTRY = 'ID_UPLOAD_COUNTRY',
    ID_UPLOAD_DOCUMENT_TYPE = 'ID_UPLOAD_DOCUMENT_TYPE',
    ID_UPLOAD_EDITING = 'ID_UPLOAD_EDITING',
    ID_UPLOAD_INSTRUCTION = 'ID_UPLOAD_INSTRUCTION',
    METADATA = 'METADATA',
    METADATA_INSTRUCTION = 'METADATA_INSTRUCTION',
    NFC_SCAN = 'NFC_SCAN',
    NFC_SCAN_CONFIRMATION = 'NFC_SCAN_CONFIRMATION',
    PERSONAL_INFORMATION = 'PERSONAL_INFORMATION',
    PERSONAL_INFORMATION_INSTRUCTION = 'PERSONAL_INFORMATION_INSTRUCTION',
    PHONE_VERIFICATION = 'PHONE_VERIFICATION',
    PHONE_VERIFICATION_CONFIRMATION = 'PHONE_VERIFICATION_CONFIRMATION',
    PROFESSIONAL_INFORMATION = 'PROFESSIONAL_INFORMATION',
    SELFIE = 'SELFIE',
    SELFIE_CONFIRMATION = 'SELFIE_CONFIRMATION',
    US_PERSON = 'US_PERSON',
    WELCOME = 'WELCOME'
}

export interface CountryInformation {
    country: string;
}

export interface DocumentTypeInformation {
    documentType: ScannerDocumentTypes;
}

export interface FullNameInformation {
    firstName: string;
    lastName: string;
}

export interface ProfessionalCategory {
    id: string;
    label: string;
}

export interface ProfessionInformation {
    professionalCategory: string;
    industry: string;
    profession: string;
}

export interface DualNationalityInformation {
    hasDualNationality: boolean;
    secondNationality: string;
}

export enum DocumentTypes {
    ID_CARD = 'ID_CARD',
    ID_PASSPORT = 'ID_PASSPORT'
}

export interface MifidIdNumber {
    documentType?: DocumentTypes;
    name: string;
}

export interface MifidIdNumberData {
    isMifidIdNumberRequired: boolean;
    mifidNationality: string;
    mifidIdNumbers: [MifidIdNumber, ...MifidIdNumber[]];
    canSkipAllIdNumbers: boolean;
}

export interface DualNationalityUpdateResult {
    mifidIdNumberData?: MifidIdNumberData;
    status: TaskStatusInformation;
}

export interface IdNumber {
    name: string;
    value: string;
}

export interface IdMifidNumber {
    nationality: string;
    idNumber: IdNumber;
}

export interface PhoneInformation {
    phoneNumber: Partial<PhoneNumberInformation>;
}

export interface PlaceOfBirthInformation {
    placeOfBirth: string;
    countryOfBirth: string;
}

export enum EligibleIdDocumentTypes {
    ID_CARD = 'ID_CARD',
    ID_CARD_PAPER = 'ID_CARD_PAPER',
    ID_PASSPORT = 'ID_PASSPORT'
}

export enum ScanImageType {
    BACK = 'BACK',
    FRONT = 'FRONT',
    INSIDE_LEFT = 'INSIDE_LEFT',
    INSIDE_RIGHT = 'INSIDE_RIGHT'
}

export interface ScanImage {
    scanImage: string; // base64-encoded data uri
    type: ScanImageType;
}

export interface IdUploadDocument {
    nationality: string;
    firstName: string;
    lastName: string;
    documentType: EligibleIdDocumentTypes;
    idNumber: string;
    dateOfBirth: string;
    dateOfExpiration: string;
    gender: MrzInfoGenders;
}

export type IdUploadDocumentResponse = Omit<IdUploadDocument, 'nationality'>;

export interface IdUploadDocumentScannerResult extends Pick<DocumentScannerResult, 'documentType'> {
    mrzInfo: MrzInfo;
}

export interface UploadDocument {
    idUploadDocument: Partial<IdUploadDocument>;
    documentScan: {
        scanImages: ScanImage[];
        scanRawData: string; // all the mrzInfo fields in JSON format
    };
    documentVideo?: string;
}

export interface NfcUploadDocument {
    idUploadDocument: Partial<IdUploadDocument>;
    scanRawMrzData: MrzInfo['rawMrz'];
    nfcScanImage?: ScanImage;
}

export interface MetadataInformation {
    latitude: number;
    longitude: number;
    deviceLanguage: string;
    deviceRegion: string;
    deviceModel: string;
}

export interface UsPersonStepData {
    isUsPerson?: boolean;
    approvedQuestionField?: AdditionalQuestionsFields;
}

export enum TaskStatus {
    ERROR = 'ERROR',
    FRAUD = 'FRAUD',
    INCONSISTENT_DATA = 'INCONSISTENT_DATA',
    INVALID_DATA = 'INVALID_DATA',
    OPEN = 'OPEN',
    PENDING = 'PENDING',
    PEP = 'PEP',
    READY_TO_SEND = 'READY_TO_SEND',
    REJECTED = 'REJECTED',
    SCHEDULED = 'SCHEDULED',
    SUCCESS = 'SUCCESS'
}

export type InconsistentDataErrors = Record<PrivateOnboardingKycTaskSteps, string[]>;

export interface TaskStatusInformation {
    status: TaskStatus;
    step: PrivateOnboardingKycTaskSteps;
    nextTaskId?: number;
    globalErrors?: string[]; // list of i18n errors code
    inconsistentDataErrors?: InconsistentDataErrors; // map of i18n errors codes by step
}
