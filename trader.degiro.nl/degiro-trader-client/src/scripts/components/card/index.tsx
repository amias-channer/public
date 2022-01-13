import * as React from 'react';
import {card, cardBodyPlaceholder, contentHorizontalMargin, headerPlaceholder, footerPlaceholder} from './card.css';

type Props = React.PropsWithChildren<{
    innerHorizontalGap?: boolean;
    header?: React.ReactNode | boolean;
    footer?: React.ReactNode | boolean;

    // [TRADER-1983] this prop is used mostly for UI or integration tests purposes
    'data-name'?: string;
}>;

const Card: React.FunctionComponent<Props> = ({innerHorizontalGap = true, header, footer, children, ...domProps}) => (
    <section {...domProps} className={card}>
        {header !== undefined && <div className={`${headerPlaceholder} ${contentHorizontalMargin}`}>{header}</div>}
        <div className={`${cardBodyPlaceholder} ${innerHorizontalGap ? contentHorizontalMargin : ''}`}>{children}</div>
        {footer !== undefined && <div className={`${footerPlaceholder} ${contentHorizontalMargin}`}>{footer}</div>}
    </section>
);

export default React.memo(Card);
