import {ScannerDocumentTypes} from '../../models/fourthline';
import {EligibleIdDocumentTypes} from '../../models/private-onboarding-kyc-task';

const documentTypesMap: Record<ScannerDocumentTypes, EligibleIdDocumentTypes> = {
    [ScannerDocumentTypes.ID_CARD]: EligibleIdDocumentTypes.ID_CARD,
    [ScannerDocumentTypes.PASSPORT]: EligibleIdDocumentTypes.ID_PASSPORT,
    [ScannerDocumentTypes.PAPER_ID]: EligibleIdDocumentTypes.ID_CARD_PAPER
};

export default function getEligibleDocumentType(documentType: ScannerDocumentTypes): EligibleIdDocumentTypes {
    return documentTypesMap[documentType];
}
