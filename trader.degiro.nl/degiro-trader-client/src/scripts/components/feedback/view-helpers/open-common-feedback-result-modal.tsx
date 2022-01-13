import {I18n} from 'frontend-core/dist/models/i18n';
import localize from 'frontend-core/dist/services/i18n/localize';
import {AppComponentApi} from '../../app-component';

export default function openCommonFeedbackResultModal(app: AppComponentApi, i18n: I18n) {
    app.openModal({
        title: localize(i18n, 'trader.feedback.result.title'),
        content: localize(i18n, 'trader.feedback.description', {
            helpDeskUrl: localize(i18n, 'help.desk.url')
        })
    });
}
