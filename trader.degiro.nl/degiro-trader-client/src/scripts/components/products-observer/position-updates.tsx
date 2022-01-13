import {Position} from 'frontend-core/dist/models/product';
import * as React from 'react';
import usePositionUpdates, {PositionUpdateField} from '../../hooks/use-position-updates';

interface Props {
    position: Position;
    fields: PositionUpdateField[];
    children(values: ReturnType<typeof usePositionUpdates>): React.ReactElement;
}

const PositionUpdates: React.FunctionComponent<Props> = ({position, fields, children}) => {
    const values = usePositionUpdates(position, fields);

    return children(values);
};

export default React.memo(PositionUpdates);
