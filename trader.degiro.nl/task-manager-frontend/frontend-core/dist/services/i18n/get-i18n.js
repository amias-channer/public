import requestToApi from '../api-requester/request-to-api';
export default function getI18n(config, options) {
    // TODO: remove this dirty hack when [TRADER-2186] is fixed on BE:
    // 'no' code is set in our client model, see User.language, User.displayLanguage, User.locale,
    // but the new Translation Manager uses 'nb' !!!
    const language = options.language === 'no' ? 'nb' : options.language;
    return requestToApi({
        config: {
            ...config,
            // do not send credentials
            intAccount: undefined,
            sessionId: undefined
        },
        params: { ...options, language },
        url: config.translationsUrl
    });
}
//# sourceMappingURL=get-i18n.js.map