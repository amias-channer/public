import Portal from 'frontend-core/dist/components/ui-common/portal/index';
import Icon from 'frontend-core/dist/components/ui-trader4/icon/index';
import useDeviceBackButton from 'frontend-core/dist/hooks/use-device-back-button';
import useMediaQuery from 'frontend-core/dist/hooks/use-media-query';
import * as React from 'react';
import {globalFullLayout} from '../../../media-queries';
import {controlButton} from './compact-header.css';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    onClick(): void;
}

/**
 * @description On the page we can have multiple navigation buttons which covert each other by z-index
 * (e.g. Product details + Order panel). This is used for "Back button" event handling
 * @type {number}
 */
let mountedButtonsCount: number = 0;
const {useRef, useEffect, useCallback} = React;
const HeaderNavigationButton: React.FunctionComponent<Props> = (props) => {
    const {onClick} = props;
    const mountedButtonIndexRef = useRef<number>(-1);
    const onBackButtonClick = useCallback(() => {
        // [WF-2552]: Trigger a callback only for the top navigation button (if there are several ones) on page
        if (mountedButtonIndexRef.current === mountedButtonsCount - 1) {
            onClick();
        }
    }, [onClick]);

    useDeviceBackButton(onBackButtonClick);

    useEffect(() => {
        mountedButtonIndexRef.current = mountedButtonsCount;
        mountedButtonsCount++;

        return () => {
            mountedButtonsCount--;
        };
    }, []);

    const isVisible: boolean = !useMediaQuery(globalFullLayout);

    return isVisible ? (
        <Portal>
            <button type="button" data-name="headerBackButton" {...props} className={controlButton}>
                <Icon type="arrow_back" />
            </button>
        </Portal>
    ) : null;
};

export default React.memo(HeaderNavigationButton);
