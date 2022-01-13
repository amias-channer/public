import * as React from 'react';
import {grid, container as containerClass} from './grid.css';

type Props = React.PropsWithChildren<{
    container?: true;
    size?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    stretch?: true;
}>;

const Grid: React.FunctionComponent<Props> = ({container, size, children, stretch}) => {
    return (
        <div
            className={`${grid} ${container ? containerClass : ''}`}
            // eslint-disable-next-line react/forbid-dom-props
            style={{
                gridColumn: size ? `span ${size}` : 'auto',
                alignSelf: stretch ? 'stretch' : undefined
            }}>
            {children}
        </div>
    );
};

export default React.memo(Grid);
