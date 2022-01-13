import * as React from 'react';
import range from 'frontend-core/dist/utils/range';
import {passCodeLength} from '../../../models/user';
import {passCodeIndicator, passCodeIndicatorItem, passCodeIndicatorItemActive} from './passcode-indicator.css';

interface Props {
    passCode: string;
}

const PassCodeIndicator: React.FunctionComponent<Props> = ({passCode}) => (
    <div className={passCodeIndicator}>
        {range(0, passCodeLength - 1).map((i) => (
            <span
                key={`passCodeIndicatorItem-${i}`}
                aria-label={passCode[i]}
                className={`
                    ${passCodeIndicatorItem}
                    ${i < passCode.length ? passCodeIndicatorItemActive : ''}
                `}
            />
        ))}
    </div>
);

export default React.memo(PassCodeIndicator);
