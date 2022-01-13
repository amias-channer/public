import {PortfolioResourceData} from 'frontend-core/dist/models/portfolio';
import {Position} from 'frontend-core/dist/models/product';
import {ProductTypeIds} from 'frontend-core/dist/models/product-type';
import {useContext, useEffect, useState} from 'react';
import {EventBrokerContext} from '../components/app-component/app-context';
import {PortfolioEvents} from '../event-broker/event-types';
import {PortfolioUpdateParams} from '../event-broker/resources/portfolio';
import {SubscriptionEvent, Unsubscribe, unsubscribeAll} from '../event-broker/subscription';

interface State {
    isLoading: boolean;
    positions: Position[];
}

type PositionsIds = Set<string>;
type PositionsDictionary = Map<string, Position>;

const initialState: Readonly<State> = {isLoading: true, positions: []};
const canStorePositionByDefault = () => true;
const pickPositionsIds = (positions: Position[]): PositionsIds =>
    new Set(positions.map((position: Position) => String(position.id)));
const createPositionsDictionary = (positions: Position[]): PositionsDictionary =>
    new Map(positions.map((position: Position) => [String(position.id), position]));
const excludePositionsById = (positions: Position[], positionsIds: PositionsIds): Position[] =>
    positions.filter((position: Position) => !positionsIds.has(String(position.id)));

/**
 * @description
 *  - this hook doesn't save position fields updates (!!!) Use `usePositionUpdates()` or <PositionUpdates/> instead
 * @param {ProductTypeIds} [productTypeId]
 * @param {Function} [canStorePosition] - store guard. It validates if we can store a position in the current state
 * @returns {State}
 */
export default function usePortfolioPositions(
    productTypeId?: ProductTypeIds,
    canStorePosition: (position: Position) => boolean = canStorePositionByDefault
): Readonly<State> {
    const eventBroker = useContext(EventBrokerContext);
    const [state, setState] = useState<State>(initialState);

    useEffect(() => {
        setState(initialState);
        const params: PortfolioUpdateParams | undefined = productTypeId === undefined ? undefined : {productTypeId};
        const onPortfolioSnapshot = (_event: SubscriptionEvent, data: PortfolioResourceData) => {
            const {activePositions = {}, inactivePositions = {}} = data;

            setState({
                isLoading: false,
                positions: [...Object.values(activePositions), ...Object.values(inactivePositions)].filter(
                    canStorePosition
                )
            });
        };
        const onAddedPositions = (_event: SubscriptionEvent, positions: Position[]) => {
            const positionsToAdd: Position[] = positions.filter(canStorePosition);

            // no positions to add, exit to not trigger unnecessary re-render
            if (!positionsToAdd.length) {
                return;
            }

            setState((state) => ({
                isLoading: false,
                positions: [...positionsToAdd, ...state.positions]
            }));
        };
        const onUpdatePositions = (_event: SubscriptionEvent, positions: Position[]) => {
            setState((state) => {
                const storedPositionsDictionary: PositionsDictionary = createPositionsDictionary(state.positions);
                const storedPositionsCount: number = storedPositionsDictionary.size;

                positions.forEach((position: Position) => {
                    const positionId: string = String(position.id);
                    const isUpdatedPositionStored: boolean = storedPositionsDictionary.has(positionId);
                    const canStoreUpdatedPosition: boolean = canStorePosition(position);

                    // we need to remove a position, canStorePosition:true => canStorePosition:false
                    if (isUpdatedPositionStored && !canStoreUpdatedPosition) {
                        storedPositionsDictionary.delete(positionId);
                    } else if (!isUpdatedPositionStored && canStoreUpdatedPosition) {
                        // we need to add a position, canStorePosition:false => canStorePosition:true
                        storedPositionsDictionary.set(positionId, position);
                    }
                });

                // no positions were removed, nor added, return current state to not trigger unnecessary re-render
                if (storedPositionsCount === storedPositionsDictionary.size) {
                    return state;
                }

                return {isLoading: false, positions: [...storedPositionsDictionary.values()]};
            });
        };
        const onRemovedPositions = (_event: SubscriptionEvent, positions: Position[]) => {
            const positionsToRemoveIds: PositionsIds = pickPositionsIds(positions.filter(canStorePosition));

            // no positions to remove, exit to not trigger unnecessary re-render
            if (!positionsToRemoveIds.size) {
                return;
            }

            setState((state) => ({
                isLoading: false,
                positions: excludePositionsById(state.positions, positionsToRemoveIds)
            }));
        };
        const unsubscribeHandlers: Unsubscribe[] = [
            params
                ? eventBroker.once(PortfolioEvents.LAST_DATA, params, onPortfolioSnapshot)
                : eventBroker.once(PortfolioEvents.LAST_DATA, onPortfolioSnapshot),
            params
                ? eventBroker.on(PortfolioEvents.RESET, params, onPortfolioSnapshot)
                : eventBroker.on(PortfolioEvents.RESET, onPortfolioSnapshot),
            params
                ? eventBroker.on(PortfolioEvents.ADD, params, onAddedPositions)
                : eventBroker.on(PortfolioEvents.ADD, onAddedPositions),
            params
                ? eventBroker.on(PortfolioEvents.CHANGE, params, onUpdatePositions)
                : eventBroker.on(PortfolioEvents.CHANGE, onUpdatePositions),
            params
                ? eventBroker.on(PortfolioEvents.REMOVE, params, onRemovedPositions)
                : eventBroker.on(PortfolioEvents.REMOVE, onRemovedPositions)
        ];

        return () => unsubscribeAll(unsubscribeHandlers);
    }, [productTypeId]);

    return state;
}
