import InnerHtml from 'frontend-core/dist/components/ui-common/inner-html';
import {WaitingListError} from 'frontend-core/dist/models/app-error';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {I18nContext} from '../app-component/app-context';
import {footer, greeting, layout, positionTitle, positionValue, title} from './waiting-list.css';

interface Props {
    error: WaitingListError;
}

const {useContext} = React;
const WaitingList: React.FunctionComponent<Props> = ({error}) => {
    const i18n = useContext(I18nContext);

    return (
        <article className={layout}>
            <h1 className={greeting}>{localize(i18n, 'waitingList.greeting')}</h1>
            <InnerHtml className={title}>{localize(i18n, 'waitingList.title')}</InnerHtml>
            <h2 className={positionTitle}>
                {localize(i18n, 'waitingList.position.title')}
                <span className={positionValue} data-field="waitingListPosition">
                    {error.waitingListPosition}
                </span>
            </h2>
            <InnerHtml>{localize(i18n, 'waitingList.description')}</InnerHtml>
            <InnerHtml className={footer}>{localize(i18n, 'waitingList.footer')}</InnerHtml>
        </article>
    );
};

export default React.memo(WaitingList);
