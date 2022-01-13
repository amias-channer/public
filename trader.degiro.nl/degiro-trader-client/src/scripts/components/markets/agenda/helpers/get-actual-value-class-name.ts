import {AgendaEconomicItem} from '../../../../models/agenda';
import {positiveValue, negativeValue} from '../../../value/value.css';

export default function getActualValueClassName(
    actual: AgendaEconomicItem['actual'],
    previous: AgendaEconomicItem['previous']
): string | undefined {
    const delta = Number(actual) - Number(previous);

    if (delta) {
        return delta > 0 ? positiveValue : negativeValue;
    }
}
