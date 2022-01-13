import * as React from 'react';
import {emptyTableMessage} from './products-table.css';
import NoProductsMessage from '../../no-products-message';

interface Props {
    columnsCount: number;
}

const {memo} = React;
const EmptyTableBody = memo<Props>(({columnsCount}) => (
    <tbody>
        <tr>
            <td className={emptyTableMessage} colSpan={columnsCount}>
                <NoProductsMessage />
            </td>
        </tr>
    </tbody>
));

EmptyTableBody.displayName = 'EmptyTableBody';
export default EmptyTableBody;
