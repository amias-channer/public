import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import {cell, headerCell, inlineEndContentCell, row, table as tableClassName} from '../../table/table.css';
import Amount from '../../value/amount';
import {CashFundCompensationsViewProps} from './index';
import {I18nContext} from '../../app-component/app-context';

const {useContext} = React;
const hasTruthyValue = (list: any[]) => list.length !== 0 && list.some((a) => a);
const CashFundCompensationsFullView = React.memo<CashFundCompensationsViewProps>(({tableItems, getPayoutControl}) => {
    const i18n = useContext(I18nContext);
    const payoutControls = tableItems.map(getPayoutControl);
    const hasControlsColumn = hasTruthyValue(payoutControls);

    return (
        <table className={tableClassName}>
            <thead>
                <tr className={row}>
                    <th className={headerCell}>{localize(i18n, 'trader.cashFundCompensations.descriptionColumn')}</th>
                    <th className={headerCell}>{localize(i18n, 'trader.cashFundCompensations.currencyColumn')}</th>
                    <th className={`${headerCell} ${inlineEndContentCell}`}>
                        {localize(i18n, 'trader.cashFundCompensations.totalValueColumn')}
                    </th>
                    {hasControlsColumn ? <th className={`${headerCell} ${inlineEndContentCell}`} /> : null}
                </tr>
            </thead>
            <tbody>
                {tableItems.map((compensationItem, index) => {
                    const {id, translation, currency, amount} = compensationItem;

                    return (
                        <tr key={id} data-name="compensationItem" className={row}>
                            <td className={cell}>{localize(i18n, translation)}</td>
                            <td className={cell}>{currency}</td>
                            <td className={`${cell} ${inlineEndContentCell}`}>
                                <Amount field="amount" value={amount} id={id} />
                            </td>
                            {hasControlsColumn && (
                                <td className={`${cell} ${inlineEndContentCell}`}>{payoutControls[index]}</td>
                            )}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
});

CashFundCompensationsFullView.displayName = 'CashFundCompensationsFullView';
export default CashFundCompensationsFullView;
