import {PortfolioResourceData} from 'frontend-core/dist/models/portfolio';
import {Position, ProductInfo} from 'frontend-core/dist/models/product';
import {useContext, useEffect, useState} from 'react';
import {EventBrokerContext} from '../components/app-component/app-context';
import {PortfolioEvents} from '../event-broker/event-types';
import {PortfolioUpdateParams} from '../event-broker/resources/portfolio';
import {SubscriptionEvent, Unsubscribe, unsubscribeAll} from '../event-broker/subscription';

type State = Position | undefined;

/**
 * @param {ProductInfo | undefined} productInfo – it's a required param but it can have value `undefined` for conditions
 * @returns {State}
 */
export default function useProductPosition(productInfo: ProductInfo | undefined): Readonly<State> {
    const eventBroker = useContext(EventBrokerContext);
    const [position, setPosition] = useState<State>(undefined);
    const productId: string | undefined = productInfo && String(productInfo.id);

    useEffect(() => {
        setPosition(undefined);

        if (!productId || !productInfo) {
            return;
        }

        const portfolioParams: PortfolioUpdateParams = {productTypeId: productInfo.productTypeId};
        const onPortfolioSnapshot = (_e: SubscriptionEvent, data: PortfolioResourceData) => {
            const {activePositions = {}, inactivePositions = {}} = data;

            setPosition(activePositions[productId] || inactivePositions[productId]);
        };
        const onPositionsUpdate = (event: SubscriptionEvent, positions: Position[]) => {
            const position: Position | undefined = positions.find((position: Position) => {
                return String(position.id) === productId;
            });

            // check if it's an update related to the current position
            if (position) {
                setPosition(event.name === PortfolioEvents.REMOVE ? undefined : position);
            }
        };
        const unsubscribeHandlers: Unsubscribe[] = [
            eventBroker.once(PortfolioEvents.LAST_DATA, portfolioParams, onPortfolioSnapshot),
            eventBroker.on(PortfolioEvents.RESET, portfolioParams, onPortfolioSnapshot),
            eventBroker.on(PortfolioEvents.ADD, portfolioParams, onPositionsUpdate),
            eventBroker.on(PortfolioEvents.CHANGE, portfolioParams, onPositionsUpdate),
            eventBroker.on(PortfolioEvents.REMOVE, portfolioParams, onPositionsUpdate)
        ];

        return () => unsubscribeAll(unsubscribeHandlers);
    }, [productId]);

    return position;
}
