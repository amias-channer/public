import useVisualViewport from 'frontend-core/dist/hooks/use-visual-viewport';
import isTouchDevice from 'frontend-core/dist/platform/is-touch-device';
import * as React from 'react';

interface Props {
    children: React.ReactElement;
}

const {useLayoutEffect, useState} = React;
// this component doesn't render its children when virtual keyboard (mostly mobile devices) is opened
const ClosedVisualKeyboard: React.FunctionComponent<Props> = ({children}) => {
    const viewport = useVisualViewport();
    const [isKeyboardOpened, setIsKeyboardOpened] = useState<boolean>(false);
    const [prevViewportHeight, setPrevViewportHeight] = useState<number>(viewport.height);

    useLayoutEffect(() => {
        // keyboard checks are not applicable for non-touch devices
        if (!isTouchDevice()) {
            return setIsKeyboardOpened(false);
        }

        const viewportHeight: number = viewport.height;
        const tagName: string | undefined | null = document.activeElement?.tagName;

        // we suppose that keyboard is opened if viewport height became smaller and focus is in the "input" element
        setIsKeyboardOpened(viewportHeight < prevViewportHeight && (tagName === 'INPUT' || tagName === 'TEXTAREA'));
        setPrevViewportHeight(viewportHeight);
    }, [viewport.height]);

    return isKeyboardOpened ? null : children;
};

export default ClosedVisualKeyboard;
