let pendingPromise;
function loadScript(url) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.defer = true;
        script.async = false;
        script.onload = resolve;
        script.onerror = reject;
        script.src = url;
        document.body.appendChild(script);
    });
}
export default function getFirebaseAnalytics() {
    const { firebase } = self;
    if (typeof (firebase === null || firebase === void 0 ? void 0 : firebase.analytics) === 'function') {
        return Promise.resolve(firebase.analytics());
    }
    if (typeof pendingPromise !== 'undefined') {
        return pendingPromise;
    }
    pendingPromise = loadScript('https://www.gstatic.com/firebasejs/7.5.0/firebase-app.js')
        .then(() => loadScript('https://www.gstatic.com/firebasejs/7.5.0/firebase-analytics.js'))
        .then(() => {
        pendingPromise = undefined;
        const { firebase } = self;
        if (typeof (firebase === null || firebase === void 0 ? void 0 : firebase.analytics) === 'function') {
            firebase.initializeApp({
                apiKey: 'AIzaSyDs-0s_9qZRaS1ebkbcH958jPmE7ava-UI',
                authDomain: 'degiro-2018f.firebaseapp.com',
                databaseURL: 'https://degiro-2018f.firebaseio.com',
                projectId: 'degiro-2018f',
                storageBucket: 'degiro-2018f.appspot.com',
                messagingSenderId: '82883883953',
                appId: '1:82883883953:web:baf06d212689bc749bc390',
                measurementId: 'G-L69XHC4W9Q'
            });
            return firebase.analytics();
        }
        throw new Error('Firebase is not loaded');
    })
        .catch((error) => {
        pendingPromise = undefined;
        throw error;
    });
    return pendingPromise;
}
//# sourceMappingURL=get-firebase-analytics.js.map