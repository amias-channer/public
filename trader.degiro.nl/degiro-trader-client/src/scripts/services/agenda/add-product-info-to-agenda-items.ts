import {ProductInfo} from 'frontend-core/dist/models/product';
import {AgendaAnyTypeItem} from '../../models/agenda';

export default function addProductInfoToAgendaItems<T extends AgendaAnyTypeItem>(
    agendaItems: T[],
    products: ProductInfo[]
): T[] {
    return agendaItems.map((agendaItem: T) => {
        const productInfo: ProductInfo | undefined = products.find(
            (productInfo: ProductInfo) => productInfo.isin === agendaItem.isin
        );

        return {...agendaItem, productInfo};
    });
}
