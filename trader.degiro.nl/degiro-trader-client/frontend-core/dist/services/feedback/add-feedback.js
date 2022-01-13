import requestToApi from '../api-requester/request-to-api';
export default function addFeedback(config, feedback, options) {
    const { inAppReview = false } = options || {};
    return requestToApi({
        config,
        url: `${config.paUrl}feedbacks`,
        method: 'PUT',
        // [WEB-2863], do not send `comment` and `rating` fields for in-app review
        body: inAppReview
            ? {
                ...feedback,
                comment: undefined,
                rating: undefined,
                inAppReview
            }
            : feedback
    });
}
//# sourceMappingURL=add-feedback.js.map