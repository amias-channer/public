import useToggle from 'frontend-core/dist/hooks/use-toggle';
import throttle from 'frontend-core/dist/utils/throttle';
import * as React from 'react';
import Menu, {MenuProps} from '../../menu';
import BlockMenuHeader from './block-menu-header';
import {menu, menuBody} from './block-menu.css';

type BlockMenuApi = Pick<ReturnType<typeof useToggle>, 'close' | 'open'>;

export type BlockMenuProps = React.PropsWithChildren<
    Pick<MenuProps, 'horizontalPosition' | 'verticalPosition' | 'targetWrapperClassName'> & {
        renderTarget: (props: {isOpened: boolean} & BlockMenuApi) => MenuProps['target'];
        title?: React.ReactNode;
        subTitle?: React.ReactNode;
        height?: MenuProps['height'];
    }
>;

const {memo, useCallback, useEffect, useMemo} = React;
const BlockMenu: React.FunctionComponent<BlockMenuProps> = ({
    children,
    horizontalPosition,
    verticalPosition,
    height,
    renderTarget,
    targetWrapperClassName,
    title,
    subTitle
}) => {
    const {isOpened, close, open} = useToggle();
    const throttledClose = useMemo(() => throttle(close, 100, false), []);
    const throttledOpen = useMemo(() => throttle(open, 100, false), []);
    const closeHandler = useCallback(() => {
        throttledOpen.cancel();
        throttledClose();
    }, []);
    const openHandler = useCallback(() => {
        throttledClose.cancel();
        throttledOpen();
    }, []);

    useEffect(() => {
        if (isOpened) {
            document.addEventListener('click', closeHandler, true);
            return () => document.removeEventListener('click', closeHandler, true);
        }
    }, [isOpened]);

    return (
        <Menu
            isOpened={isOpened}
            horizontalPosition={horizontalPosition}
            verticalPosition={verticalPosition}
            height={height}
            onClose={closeHandler}
            target={renderTarget({isOpened, close: closeHandler, open: openHandler})}
            targetWrapperClassName={targetWrapperClassName}>
            <div className={menu} onMouseLeave={closeHandler} onMouseOver={openHandler}>
                {title && <BlockMenuHeader title={title} subTitle={subTitle} />}
                <div className={menuBody}>{children}</div>
            </div>
        </Menu>
    );
};

export default memo(BlockMenu);
