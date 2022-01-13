import getPathCredentials from '../api-requester/get-path-credentials';
import requestToApi from '../api-requester/request-to-api';
export default function confirmExperienceCheck(config, experienceCheck) {
    return requestToApi({
        config,
        url: `${config.tradingUrl}v5/confirmExperienceCheck${getPathCredentials(config)}`,
        method: 'POST',
        body: {
            checkId: experienceCheck.id
        }
    });
}
//# sourceMappingURL=confirm-experience-check.js.map