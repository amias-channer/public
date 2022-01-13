import Icon from 'frontend-core/dist/components/ui-trader4/icon';
import * as React from 'react';
import {
    closedSection,
    detailsButton,
    fullWidthSection,
    navigationItemIcon,
    openedSection
} from './side-information-panel.css';

interface Props {
    isOpened?: boolean;
    header?: React.ReactNode | React.ReactNode[];
    className?: string;
}

const {useState, useCallback} = React;
const PanelSection: React.FunctionComponent<Props> = ({
    header,
    children,
    isOpened: isOpenedByDefault = false,
    className = ''
}) => {
    const [isOpened, setIsOpened] = useState<boolean>(isOpenedByDefault);
    const toggle = useCallback(() => setIsOpened((isOpened) => !isOpened), []);

    return (
        <section className={`${isOpened ? openedSection : closedSection} ${className}`}>
            <div
                role="button"
                data-name="toggleButton"
                tabIndex={0}
                onClick={toggle}
                className={`${detailsButton} ${fullWidthSection}`}>
                {header}
                <Icon className={navigationItemIcon} type="keyboard_arrow_down" flipped={isOpened} />
            </div>
            {isOpened ? children : null}
        </section>
    );
};

export default React.memo<React.PropsWithChildren<Props>>(PanelSection);
