import areComponentChildrenEmpty from 'frontend-core/dist/components/ui-common/component/are-component-children-empty';
import {link} from 'frontend-core/dist/components/ui-trader3/index.css';
import {Routes as TraderRoutes} from 'frontend-core/dist/components/ui-trader4/navigation';
import {Task} from 'frontend-core/dist/models/task/task';
import localize from 'frontend-core/dist/services/i18n/localize';
import isDebitMoneyQuestionnaireTask from 'frontend-core/dist/services/task/is-debit-money-questionnaire-task';
import isDebitSecuritiesQuestionnaireTask from 'frontend-core/dist/services/task/is-debit-securities-questionnaire-task';
import isKnowledgeQuestionnaireTask from 'frontend-core/dist/services/task/is-knowledge-questionnaire-task';
import isPrivateUpgradeAgreementsTask from 'frontend-core/dist/services/task/is-private-upgrade-agreements-task';
import * as React from 'react';
import shouldUseMobileVersion from '../../services/config/should-use-mobile-version';
import {AppParamsContext, ConfigContext, I18nContext} from '../app-component/app-context';

export interface TraderLinkProps {
    task?: Task;
    className?: string;
    onClick?: React.MouseEventHandler<HTMLElement>;
    children?: React.ReactNode | React.ReactNode[];
}

const {useContext} = React;
const TraderLink: React.FunctionComponent<TraderLinkProps> = ({task, children, className = '', onClick}) => {
    const appParams = useContext(AppParamsContext);
    const i18n = useContext(I18nContext);
    const {traderUrl} = useContext(ConfigContext);
    const searchParams: string[] = [];
    let targetPage: TraderRoutes | undefined;

    if (task) {
        if (
            isPrivateUpgradeAgreementsTask(task) ||
            isDebitMoneyQuestionnaireTask(task) ||
            isDebitSecuritiesQuestionnaireTask(task)
        ) {
            targetPage = TraderRoutes.TRADING_PROFILE;
        } else if (isKnowledgeQuestionnaireTask(task)) {
            targetPage = TraderRoutes.PRODUCT_GOVERNANCE_SETTINGS;
        }
    }

    if (shouldUseMobileVersion(appParams)) {
        searchParams.push('mobile');
    }

    if (targetPage) {
        searchParams.push(`targetPage=${targetPage}`);
    }

    return (
        <a
            data-name="traderLink"
            onClick={onClick}
            href={traderUrl && `${traderUrl}?${searchParams.join('&')}`}
            className={`${link} ${className}`}>
            {areComponentChildrenEmpty(children)
                ? localize(i18n, 'taskManager.task.successResult.redirectLink')
                : children}
        </a>
    );
};

export default React.memo(TraderLink);
