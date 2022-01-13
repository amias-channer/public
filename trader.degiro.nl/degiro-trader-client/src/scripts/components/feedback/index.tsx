import {logErrorLocally} from 'frontend-core/dist/loggers/local-logger';
import {Feedback as FeedbackModel} from 'frontend-core/dist/models/feedback';
import getPlatformMetadata from 'frontend-core/dist/platform/get-platform-metadata';
import addFeedback from 'frontend-core/dist/services/feedback/add-feedback';
import getRecentFeedback from 'frontend-core/dist/services/feedback/get-recent-feedback';
import {isInAppReviewSupported, requestInAppReview} from 'frontend-core/dist/services/feedback/in-app-review';
import isFeedbackExpected from 'frontend-core/dist/services/feedback/is-feedback-expected';
import * as React from 'react';
import {FeedbackEvents} from '../../event-broker/event-types';
import {Unsubscribe, unsubscribeAll} from '../../event-broker/subscription';
import getFeedbackSource from '../../services/feedback/get-feedback-source';
import {AppApiContext, ConfigContext, EventBrokerContext, I18nContext} from '../app-component/app-context';
import {NewFeedbackData} from './new-feedback';
import openCommonFeedbackResultModal from './view-helpers/open-common-feedback-result-modal';
import openFeedbackFormModal from './view-helpers/open-feedback-form-modal';
import openPositiveFeedbackResultModal from './view-helpers/open-positive-feedback-result-modal';
import openRecentFeedbackWarningModal from './view-helpers/open-recent-feedback-warning-modal';

const {useRef, useEffect, useContext} = React;
const Feedback: React.FunctionComponent = () => {
    const config = useContext(ConfigContext);
    const eventBroker = useContext(EventBrokerContext);
    const app = useContext(AppApiContext);
    const i18n = useContext(I18nContext);
    const feedbackPushingTimerRef = useRef<number | undefined>(undefined);
    const recentFeedbackRef = useRef<FeedbackModel | undefined>(undefined);
    const onAddFeedback = (data: NewFeedbackData, options: {inAppReview?: true; isForced?: boolean}) => {
        const {inAppReview, isForced} = options;
        const feedback: FeedbackModel = {...data, source: getFeedbackSource()};

        addFeedback(
            config,
            {
                ...feedback,
                metadata: {
                    isForced,
                    appVersion: String(appVersion),
                    deviceInfo: getPlatformMetadata()
                }
            },
            {inAppReview}
        )
            .then(() => (recentFeedbackRef.current = feedback))
            .catch(logErrorLocally);
    };
    const stopFeedbackPushing = () => clearTimeout(feedbackPushingTimerRef.current);
    const showFeedbackForm = (props: {isForced?: boolean}) => {
        // stop previous schedule
        stopFeedbackPushing();

        if (recentFeedbackRef.current) {
            return openRecentFeedbackWarningModal(app, i18n);
        }

        const onFeedbackSubmit = (data: NewFeedbackData) => {
            onAddFeedback(data, props);

            if (data.rating < 5) {
                return openCommonFeedbackResultModal(app, i18n);
            }

            openPositiveFeedbackResultModal(app, i18n);

            if (isInAppReviewSupported()) {
                requestInAppReview()
                    .then(() => onAddFeedback({rating: 0, comment: ''}, {inAppReview: true, ...props}))
                    .catch(logErrorLocally);
            }
        };

        openFeedbackFormModal(app, i18n, onFeedbackSubmit);
    };
    const startFeedbackPushing = () => {
        // stop previous schedule
        stopFeedbackPushing();

        const onReady = () => {
            isFeedbackExpected(config, {source: getFeedbackSource()})
                .then((isExpected: boolean) => {
                    if (isExpected) {
                        showFeedbackForm({isForced: true});
                    }
                })
                .catch(logErrorLocally);
        };

        // delay before we show feedback form
        feedbackPushingTimerRef.current = window.setTimeout(onReady, 5000);
    };

    useEffect(() => {
        getRecentFeedback(config, {source: getFeedbackSource()})
            .then((feedback) => (recentFeedbackRef.current = feedback))
            .catch(logErrorLocally);

        const unsubscribeHandlers: Unsubscribe[] = [
            eventBroker.on(FeedbackEvents.FORCE, startFeedbackPushing),
            eventBroker.on(FeedbackEvents.OPEN, showFeedbackForm.bind(null, {}))
        ];

        return () => {
            unsubscribeAll(unsubscribeHandlers);
            stopFeedbackPushing();
        };
    }, []);

    return null;
};

export default React.memo(Feedback);
