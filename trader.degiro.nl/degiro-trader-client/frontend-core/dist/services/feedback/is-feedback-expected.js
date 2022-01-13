import requestToApi from '../api-requester/request-to-api';
export default function isFeedbackExpected(config, params) {
    return requestToApi({
        config,
        url: `${config.paUrl}feedbacks/${params.source}/showFeedbackNotification`
    });
}
//# sourceMappingURL=is-feedback-expected.js.map