import * as React from 'react';
import {cardHeader, cardHeaderTitle} from './card.css';

type Props = React.PropsWithChildren<{
    className?: string;
    title?: React.ReactNode;
}>;

const CardHeader: React.FunctionComponent<Props> = React.memo(({title, className = '', children}) => (
    <header className={`${cardHeader} ${className}`}>
        {title && <h2 className={cardHeaderTitle}>{title}</h2>}
        {children}
    </header>
));

CardHeader.displayName = 'CardHeader';
export default CardHeader;
