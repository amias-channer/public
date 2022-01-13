import { useEffect, useState } from 'react';
export default function useMediaQuery(mediaQuery) {
    const [isMatching, setIsMatching] = useState(mediaQuery.matches);
    useEffect(() => {
        const onChange = () => setIsMatching(mediaQuery.matches);
        mediaQuery.addListener(onChange);
        // set an initial value of changed `mediaQuery`
        onChange();
        return () => mediaQuery.removeListener(onChange);
    }, [mediaQuery]);
    return isMatching;
}
//# sourceMappingURL=use-media-query.js.map