import {orderModeParam} from '../navigation';

/**
 * Do not confuse `window.location` with `props.location`
 * In app we use  ReactRouter navigation by hash. ex: #/products
 * But `orderModeParam` goes as part of main navigation.
 * @example
 *         orderModeParam              App navigation
 *                  ____↓____   ____________________↓_______________________
 * `localhost:9000/?orderMode#/markets?newOrder&action=buy&productId=837930`
 * @returns {boolean}
 */
export default function useGlobalOrderModeFlag(): boolean {
    return window.location.search.includes(orderModeParam);
}
