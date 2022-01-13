import * as React from 'react';
import {photo} from './news-article-item/news-article-item.css';

interface Props {
    className?: string;
    src: string;
    alt: string;
    // Dimensions should be specified to avoid perf problems (reflow) with lazy loading images. See
    // https://bugs.chromium.org/p/chromium/issues/detail?id=954323
    // https://web.dev/native-lazy-loading/#image-loading
    height: number;
    width: number;
}

const NewsArticleImage: React.FunctionComponent<Props> = ({className = '', ...props}) => (
    <img {...props} className={`${photo} ${className}`} loading="lazy" />
);

export default React.memo(NewsArticleImage);
