import * as React from 'react';
import {valuePlaceholder, ValueProps} from './index';

type Props = Pick<ValueProps<string>, 'id' | 'field' | 'className' | 'value'>;

const TextValue: React.FunctionComponent<Props> = ({id, field, className, value}) => (
    <span data-id={id} data-field={field} className={className}>
        {value || valuePlaceholder}
    </span>
);

export default React.memo(TextValue);
