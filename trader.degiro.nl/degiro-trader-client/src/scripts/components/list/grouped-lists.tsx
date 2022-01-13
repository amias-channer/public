import * as React from 'react';
import {card, cardsDivider, cardsGrid} from '../card-obsolete/card.css';
import {list} from './list.css';

interface Props<T extends object> {
    items: T[];
    getGroupingValue(item: T): string;
    renderListsDivider(item: T, index: number): React.ReactNode;
    renderListItem(item: T, index: number): React.ReactNode;
    renderListFooter(item: T, index: number): React.ReactNode;
}

/**
 * @description This component renders a group of separated lists.
 *  From design point of view each list should be wrapped in a card to work on multi-column layouts.
 * @example
 *  items -> [{id: 1, date: '2020-07-17'}, {id: 2, date: '2020-07-17'}, {id: 3, date: '2020-06-17'}]
 *  getGroupingValue -> returns a string which used to form a group, most of the time it's a date field,
 *      e.g. '2020-07-17' for the first item
 *  renderListItem -> renders each item row inside the list, e.g <div data-name="item" data-index={index}/>
 *  renderListFooter -> renders optional footer for the list, e.g. footer
 *  renderListsDivider -> renders a divider BETWEEN LISTS, e.g. "Group #"
 *  As an output of GroupedLists rendering you will get a structure like
 *      div.cardsGrid
 *          div.cardsDivider
 *              Group #
 *          div.card
 *              div.list
 *                  div[data-name="item"][data-index=0]
 *                  div[data-name="item"][data-index=1]
 *                  footer
 *          div.cardsDivider
 *              Group #
 *          div.card
 *              div.list
 *                  div[data-name="item"][data-index=2]
 *                  footer
 * @param {Function} renderListItem
 * @param {Function} renderListsDivider
 * @param {Function} renderListFooter
 * @param {Function} getGroupingValue
 * @param {object[]} items
 * @constructor
 */
const GroupedLists = <T extends object>({
    renderListItem,
    renderListsDivider,
    renderListFooter,
    getGroupingValue,
    items
}: React.PropsWithChildren<Props<T>>) => {
    const itemLastIndex: number = items.length - 1;
    let lastGroupingValue: string | undefined;
    let listNodes: React.ReactNodeArray;

    return (
        <div className={cardsGrid}>
            {items.reduce((groups: React.ReactNodeArray, item: T, index: number) => {
                const groupingValue: string = getGroupingValue(item);

                if (!listNodes || groupingValue !== lastGroupingValue) {
                    lastGroupingValue = groupingValue;
                    listNodes = [];
                    groups.push(
                        <div key={`divider-${groupingValue}`} className={cardsDivider}>
                            {renderListsDivider(item, index)}
                        </div>,
                        <div key={`card-${groupingValue}`} className={card}>
                            <div className={list}>{listNodes}</div>
                        </div>
                    );
                }

                listNodes.push(renderListItem(item, index));

                if (index === itemLastIndex) {
                    listNodes.push(renderListFooter(item, index));
                }

                return groups;
            }, [])}
        </div>
    );
};

export default React.memo(GroupedLists) as <T extends object>(props: React.PropsWithChildren<Props<T>>) => JSX.Element;
