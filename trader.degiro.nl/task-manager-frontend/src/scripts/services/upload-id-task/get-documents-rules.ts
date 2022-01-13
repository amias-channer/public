import requestToApi from 'frontend-core/dist/services/api-requester/request-to-api';
import {Config} from '../../models/config';
import {CountryDocumentsRules} from '../../models/upload-id-mifid-task';

export default function getDocumentsRules(config: Config): Promise<CountryDocumentsRules> {
    return requestToApi({
        config,
        url: `${config.paUrl}clienttasks/id/upload/documents`
    });
}
