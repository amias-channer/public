import { useEffect } from 'react';
export default function useDeviceBackButton(callback) {
    useEffect(() => {
        if (!callback) {
            return;
        }
        const onBackButtonPressed = (event) => {
            // cancel webview navigation, e.g. [WF-514]
            event.preventDefault();
            callback();
        };
        // cordova.js event
        document.addEventListener('backbutton', onBackButtonPressed, false);
        return () => document.removeEventListener('backbutton', onBackButtonPressed, false);
    }, [callback]);
}
//# sourceMappingURL=use-device-back-button.js.map