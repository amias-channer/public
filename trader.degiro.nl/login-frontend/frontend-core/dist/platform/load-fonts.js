import * as FontFaceObserver from 'fontfaceobserver';
const defaultFonts = {
    'Suisse Intl': null
};
const whitespacesPattern = /\s+/g;
export default function loadFonts(fonts, options) {
    // By default timeout is 60sec.
    const { timeout = 60000 } = options || {};
    const fontsToLoad = {
        ...defaultFonts,
        ...fonts
    };
    // all fonts from the file styles/fonts.css
    const queue = Object.keys(fontsToLoad).map((fontFamily) => {
        const testValue = fontsToLoad[fontFamily];
        if (testValue === false) {
            return;
        }
        return new FontFaceObserver(fontFamily).load(testValue || undefined, timeout).then(() => {
            /**
             * @description Add a class based on the FontFamily:
             *  CustomName - custom-name-font-loaded
             * @type {string}
             */
            document.body.classList.add(`${fontFamily.toLowerCase().replace(whitespacesPattern, '-')}-font-loaded`);
        });
    });
    return Promise.all(queue);
}
//# sourceMappingURL=load-fonts.js.map