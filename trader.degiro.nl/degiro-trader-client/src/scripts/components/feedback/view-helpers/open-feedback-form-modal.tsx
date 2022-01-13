import {I18n} from 'frontend-core/dist/models/i18n';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {AppComponentApi} from '../../app-component';
import {ModalSizes} from '../../modal';
import FeedbackForm from '../form';
import {NewFeedbackData} from '../new-feedback';

type OnSubmit = (data: NewFeedbackData) => void;

export default function openFeedbackFormModal(app: AppComponentApi, i18n: I18n, onSubmit: OnSubmit) {
    const onFormSubmit: OnSubmit = (data: NewFeedbackData) => {
        app.closeModal();
        onSubmit(data);
    };

    app.openModal({
        size: ModalSizes.MEDIUM,
        title: localize(i18n, 'trader.feedback.appFeedbackTitle'),
        footer: null,
        content: <FeedbackForm onCancel={app.closeModal} onSubmit={onFormSubmit.bind(null)} />
    });
}
