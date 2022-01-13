import {Position} from 'frontend-core/dist/models/product';
import {useContext, useEffect, useState} from 'react';
import {EventBrokerContext} from '../components/app-component/app-context';
import {PortfolioEvents} from '../event-broker/event-types';
import {SubscriptionEvent} from '../event-broker/subscription';

export type PositionUpdateValues = Partial<
    Omit<Position, 'id' | 'productInfo' | 'plBase' | 'todayPlBase' | 'shouldEmitChange'>
>;

export type PositionUpdateField = keyof PositionUpdateValues;

const getInitialValues = (position: Position, fields: PositionUpdateField[]): Readonly<PositionUpdateValues> =>
    fields.reduce((values, field) => {
        (values as Record<string, any>)[field] = position[field];
        return values;
    }, {} as PositionUpdateValues);

export default function usePositionUpdates(
    position: Position,
    fields: PositionUpdateField[]
): Readonly<PositionUpdateValues> {
    const eventBroker = useContext(EventBrokerContext);
    const [values, setValues] = useState<PositionUpdateValues>(() => getInitialValues(position, fields));
    const positionId: string = String(position.id);

    useEffect(() => {
        setValues(getInitialValues(position, fields));

        const {productInfo} = position;
        const onPositionsUpdate = (_event: SubscriptionEvent, positions: Position[]) => {
            const updatedPosition: Position | undefined = positions.find(({id}) => String(id) === positionId);

            if (!updatedPosition) {
                return;
            }

            const nextValues: PositionUpdateValues = {...values};
            let isUpdated: boolean = false;

            fields.forEach((field: PositionUpdateField) => {
                const value = updatedPosition[field];

                if (value !== nextValues[field]) {
                    // we need to mutate a position to keep it updated
                    (position as Record<string, any>)[field] = value;

                    // store new value
                    (nextValues as Record<string, any>)[field] = value;
                    isUpdated = true;
                }
            });

            if (isUpdated) {
                setValues(nextValues);
            }
        };

        // in inactive positions `productInfo` can be optional
        return productInfo
            ? eventBroker.on(PortfolioEvents.CHANGE, {productTypeId: productInfo.productTypeId}, onPositionsUpdate)
            : eventBroker.on(PortfolioEvents.CHANGE, onPositionsUpdate);
    }, [positionId]);

    return values;
}
