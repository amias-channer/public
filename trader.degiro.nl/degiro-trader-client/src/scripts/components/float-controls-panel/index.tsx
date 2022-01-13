import Portal from 'frontend-core/dist/components/ui-common/portal/index';
import useMediaQuery from 'frontend-core/dist/hooks/use-media-query';
import * as React from 'react';
import {globalFullLayout} from '../../media-queries';
import ClosedVisualKeyboard from '../closed-visual-keyboard/index';
import {layout, floatLayout, floatLayoutContent} from './float-controls-panel.css';

interface Props {
    children: React.ReactNode | ((hasStaticLayout: boolean) => React.ReactNode);
    className?: string;
}

const {memo} = React;
const FloatControlsPanel = memo<Props>(({children, className = ''}) => {
    const hasStaticLayout: boolean = useMediaQuery(globalFullLayout);
    const content: React.ReactElement = typeof children === 'function' ? children(hasStaticLayout) : children;

    return hasStaticLayout ? (
        content
    ) : (
        // [WF-2583] to fix iOS bug with `position: fixed` we render float buttons to the DOM body via Portal
        <ClosedVisualKeyboard>
            <Portal>
                <div className={`${layout} ${floatLayout} ${className}`}>
                    <div className={floatLayoutContent}>{content}</div>
                </div>
            </Portal>
        </ClosedVisualKeyboard>
    );
});

FloatControlsPanel.displayName = 'FloatControlsPanel';
export default FloatControlsPanel;
