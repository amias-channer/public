import {useLayoutEffect} from 'react';

export default function useAppProtectedMode(): void {
    useLayoutEffect(() => {
        const startProtectedMode = () => (document.body.style.opacity = '0');
        const stopProtectedMode = () => (document.body.style.opacity = '1');
        const onAppVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                stopProtectedMode();
            } else {
                startProtectedMode();
            }
        };

        // iOS Cordova specific event https://cordova.apache.org/docs/en/latest/cordova/events/events.html#ios-quirks
        document.addEventListener('resign', startProtectedMode, false);
        document.addEventListener('pause', startProtectedMode, false);
        document.addEventListener('active', stopProtectedMode, false);
        document.addEventListener('resume', stopProtectedMode, false);
        document.addEventListener('visibilitychange', onAppVisibilityChange, false);

        return () => {
            document.removeEventListener('resign', startProtectedMode, false);
            document.removeEventListener('pause', startProtectedMode, false);
            document.removeEventListener('active', stopProtectedMode, false);
            document.removeEventListener('resume', stopProtectedMode, false);
            document.removeEventListener('visibilitychange', onAppVisibilityChange, false);
        };
    }, []);
}
