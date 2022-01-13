export enum FileSides {
    BACK = 'back',
    FRONT = 'front',
    INSIDE_LEFT = 'insideLeft',
    INSIDE_RIGHT = 'insideRight'
}

export enum MrzValidationPolicies {
    NORMAL = 'normal',
    STRONG = 'strong',
    WEAK = 'weak'
}

export enum MrzInfoGenders {
    FEMALE = 'female',
    MALE = 'male',
    UNKNOWN = 'unknown'
}

export enum ScannerDocumentTypes {
    ID_CARD = 'idCard',
    PAPER_ID = 'paperId',
    PASSPORT = 'passport'
}

export enum DocumentScannerErrorCodes {
    CAMERA_PERMISSION_NOT_GRANTED = 1,
    INVALID_CONFIGURATION = 4,
    RECORDING_FAILED = 2,
    RESULT_SERIALIZATION_ERROR = 5,
    SCANNER_INTERRUPTED = 3,
    SCANNER_TIMEOUT = 0,
    UNKNOWN = 6,
    USER_DISMISS = 7
}

export enum SelfieScannerErrorCodes {
    CAMERA_PERMISSION_NOT_GRANTED = 1,
    FACE_DISAPPEARED = 4,
    INVALID_CONFIGURATION = 5,
    RECORDING_FAILED = 2,
    RESULT_SERIALIZATION_ERROR = 6,
    SCANNER_INTERRUPTED = 3,
    SCANNER_TIMEOUT = 0,
    UNKNOWN = 7,
    USER_DISMISS = 8
}

export type ErrorDescriptionLabels<T extends keyof any> = Partial<Record<T, string>>;

export enum LivenessCheckTypes {
    HEAD_TURN = 'headTurn',
    NONE = 'none'
}

export enum ScannerImageDataTypes {
    BASE64 = 'base64',
    FILE_URL = 'fileUrl'
}

export interface GeolocationCoordinates {
    latitude: number;
    longitude: number;
}

export interface DocumentScannerParams {
    debugModeEnabled: boolean;
    shouldRecordVideo: boolean;
    includeAngledSteps: boolean;
    requestStepByStepConfirmation: boolean;
    documentType: ScannerDocumentTypes;
    mrzValidationPolicy: MrzValidationPolicies;
    returnImagesAs: ScannerImageDataTypes;
}

export interface SelfieScannerParams {
    debugModeEnabled: boolean;
    shouldRecordVideo: boolean;
    includeManualSelfiePolicy: boolean;
    livenessCheckType: LivenessCheckTypes;
    returnImagesAs: ScannerImageDataTypes;
}

export interface NFCScannerParams {
    documentNumber: string;
    documentExpirationDate: string;
    birthDate: string;
    returnImagesAs: ScannerImageDataTypes;
}

export interface Metadata {
    timestamp: string;
    location?: GeolocationCoordinates;
}

export interface DocumentScansMetadata extends Metadata {
    isAngled: boolean;
    fileSide: FileSides;
}

export interface OriginDocumentScannerResult {
    documentScans: DocumentScansItem[];
    mrtdMrzInfo?: OriginMrzInfo;
    videoUrl: string;
}

export interface DocumentScannerResult extends Omit<OriginDocumentScannerResult, 'mrtdMrzInfo' | 'videoUrl'> {
    documentType: ScannerDocumentTypes;
    mrzInfo?: Partial<MrzInfo>;
    documentVideo: string;
}

export interface OriginSelfieScannerResult {
    image: string;
    metadata?: Metadata;
    videoUrl: string;
}

export interface SelfieScannerResult {
    selfieImage: string;
    selfieVideo: string;
    metadata?: Metadata;
}

export interface OriginNFCScannerResult {
    image: string;
    metadata?: Metadata;
    mrzInfo: OriginMrzInfo;
}

export interface NFCScannerResult extends Omit<OriginNFCScannerResult, 'mrzInfo' | 'image'> {
    mrzInfo: Partial<MrzInfo>;
    documentType?: ScannerDocumentTypes;
    image?: string;
}

export interface NFCScannerSupportInfo {
    isNotSupported: boolean;
}

export interface NFCScanningAttemptsResult {
    areAttemptsExceeded: boolean;
}

export interface DocumentScansItem {
    image: string;
    metadata: DocumentScansMetadata;
}

export interface OriginMrzInfo {
    rawMrz?: string;
    documentCode?: string;
    issuingCountry?: string;
    documentNumber: string;
    expirationDate: string;
    firstNames: string[];
    lastNames: string[];
    birthDate: string;
    nationality?: string;
    gender?: MrzInfoGenders;
}

export interface MrzInfo
    extends Pick<
        OriginMrzInfo,
        'documentNumber' | 'expirationDate' | 'birthDate' | 'nationality' | 'gender' | 'rawMrz'
    > {
    firstName?: string;
    lastName?: string;
}

export interface ScannerErrorDetails {
    errorCode: number;
    errorDescription: string;
}
