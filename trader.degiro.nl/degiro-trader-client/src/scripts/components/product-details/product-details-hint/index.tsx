import Icon from 'frontend-core/dist/components/ui-trader4/icon/index';
import useToggle from 'frontend-core/dist/hooks/use-toggle';
import * as React from 'react';
import {closeButton, closeButtonIcon} from '../../hint/hint.css';
import Menu from '../../menu';
import {baseContentWrapper, contentWrapper, icon} from './product-details-hint.css';

interface Props {
    tooltip: React.ReactNode;
    className?: string;
    activeClassName?: string;
}

const ProductDetailsHint: React.FunctionComponent<Props> = ({className = '', tooltip, activeClassName = ''}) => {
    const toggle = useToggle(false);

    return (
        <Menu
            targetWrapperClassName={className}
            isOpened={toggle.isOpened}
            target={
                <button
                    data-test-key="target-button"
                    type="button"
                    className={toggle.isOpened ? activeClassName : undefined}
                    aria-label="Hint"
                    onClick={toggle.toggle}>
                    <Icon className={icon} hintIcon={true} />
                </button>
            }
            onClose={toggle.close}>
            <button type="button" className={closeButton} onClick={toggle.close}>
                <Icon className={closeButtonIcon} type="close" />
            </button>
            <div className={`${baseContentWrapper} ${contentWrapper}`}>{tooltip}</div>
        </Menu>
    );
};

export default React.memo(ProductDetailsHint);
