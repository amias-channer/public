import {keyCurrentRatiosIds, keyForecastDataIds, KeyFigures} from '../../../models/analyst-views';

export default function hasSomeKeyFigures(keyFigures: KeyFigures): boolean {
    return [...keyCurrentRatiosIds, ...keyForecastDataIds].some((id) => typeof keyFigures[id] !== 'undefined');
}
