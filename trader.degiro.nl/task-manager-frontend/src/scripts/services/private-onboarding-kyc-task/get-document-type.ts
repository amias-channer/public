import {ScannerDocumentTypes} from '../../models/fourthline';
import {EligibleIdDocumentTypes} from '../../models/private-onboarding-kyc-task';

const documentTypesMap: Record<EligibleIdDocumentTypes, ScannerDocumentTypes> = {
    [EligibleIdDocumentTypes.ID_CARD]: ScannerDocumentTypes.ID_CARD,
    [EligibleIdDocumentTypes.ID_PASSPORT]: ScannerDocumentTypes.PASSPORT,
    [EligibleIdDocumentTypes.ID_CARD_PAPER]: ScannerDocumentTypes.PAPER_ID
};

export default function getDocumentType(eligibleIdDocumentTypes: EligibleIdDocumentTypes): ScannerDocumentTypes {
    return documentTypesMap[eligibleIdDocumentTypes];
}
