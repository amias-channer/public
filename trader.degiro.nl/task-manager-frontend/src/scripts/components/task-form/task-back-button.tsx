import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {I18nContext} from '../app-component/app-context';
import InlineButton from '../button/inline';
import Icon from '../icon';
import * as taskFormStyles from './task-form.css';

interface Props {
    onClick(): void;
}

const {useCallback, useContext} = React;
const TaskBackButton: React.FunctionComponent<Props> = ({onClick}) => {
    const i18n = useContext(I18nContext);
    // We should avoid passing event object to onClick
    const onClickHandler = useCallback(() => onClick(), [onClick]);

    return (
        <InlineButton data-name="taskBackButton" className={taskFormStyles.formBackButton} onClick={onClickHandler}>
            <Icon type="chevron-left_regular" />
            {localize(i18n, 'taskManager.task.navigateBackAction')}
        </InlineButton>
    );
};

export default React.memo(TaskBackButton);
