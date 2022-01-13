import requestToApi from '../api-requester/request-to-api';
export default function getRecentFeedback(config, params) {
    return requestToApi({
        config,
        url: `${config.paUrl}feedbacks/${params.source}/recent`
    }).then((feedback) => {
        // server might return empty object
        if (!feedback.rating) {
            return;
        }
        // server doesn't return 'comment' field instead of empty string for positive rating
        return {
            ...feedback,
            comment: feedback.comment || ''
        };
    });
}
//# sourceMappingURL=get-recent-feedback.js.map