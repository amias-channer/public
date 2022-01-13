import PersistentHorizontalScrollSection from 'frontend-core/dist/components/ui-trader4/scroll-panel/persistent-horizontal-scroll-section';
import * as React from 'react';
import {useLocation} from 'react-router-dom';
import useGlobalFullLayoutFlag from '../../../hooks/use-global-full-layout-flag';
import {
    activeNavigationItem,
    compactLayout,
    layout,
    layoutWithGlobalHorizontalGap,
    navigation,
    scrollPanel
} from './sub-navigation.css';

export type SubNavigationProps = React.PropsWithChildren<{
    compact: boolean;
    className?: string;
    contentClassName?: string;
}>;
const {memo} = React;
const SubNavigation = memo<SubNavigationProps>(({children, compact, className = '', contentClassName = ''}) => {
    const hasGlobalFullLayout = useGlobalFullLayoutFlag();

    useLocation(); // `useLocation` is used to trigger a re-render by location change

    return (
        <div
            className={`${layout} ${compact ? compactLayout : ''} ${
                hasGlobalFullLayout ? layoutWithGlobalHorizontalGap : ''
            } ${className}`}>
            <PersistentHorizontalScrollSection
                activeItemSelector={`.${activeNavigationItem}`}
                className={`${scrollPanel} ${contentClassName}`}>
                <div className={navigation} role="tabpanel">
                    {children}
                </div>
            </PersistentHorizontalScrollSection>
        </div>
    );
});

SubNavigation.displayName = 'SubNavigation';
export default SubNavigation;
