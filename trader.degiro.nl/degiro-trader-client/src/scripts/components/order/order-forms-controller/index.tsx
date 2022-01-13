import createLazyComponent from 'frontend-core/dist/components/ui-common/lazy-component/create-lazy-component';
import {logErrorLocally} from 'frontend-core/dist/loggers/local-logger';
import {TrackerEventTypes} from 'frontend-core/dist/models/analytics';
import {AppError} from 'frontend-core/dist/models/app-error';
import {Order, OrderTimeType, OrderType} from 'frontend-core/dist/models/order';
import trackAnalytics from 'frontend-core/dist/services/analytics/track-analytics';
import isAppError from 'frontend-core/dist/services/app-error/is-app-error';
import localize from 'frontend-core/dist/services/i18n/localize';
import deleteOrder from 'frontend-core/dist/services/order/delete-order';
import getOrderTimeTypes from 'frontend-core/dist/services/order/get-order-time-types';
import getOrderTypes from 'frontend-core/dist/services/order/get-order-types';
import createCancellablePromise from 'frontend-core/dist/utils/async/create-cancellable-promise';
import keyBy from 'frontend-core/dist/utils/key-by';
import parseUrlSearchParams from 'frontend-core/dist/utils/url/parse-url-search-params';
import * as React from 'react';
import {useLocation} from 'react-router-dom';
import {
    CashOrderEvents,
    CombinationOrderEvents,
    CommonOrderEvents,
    CurrencyOrderEvents
} from '../../../event-broker/event-types';
import {SubscriptionEvent, Unsubscribe, unsubscribeAll} from '../../../event-broker/subscription';
import {CashOrderInfo} from '../../../models/cash-order';
import {CommonOrderInfo, OrderTimeTypesMap, OrderTypesMap} from '../../../models/order';
import {cashOrderResultParam, newCommonOrderParam} from '../../../navigation';
import getProductName from '../../../services/product/get-product-name';
import {
    AppApiContext,
    ConfigContext,
    EventBrokerContext,
    I18nContext,
    MainClientContext
} from '../../app-component/app-context';
import {ProductParams} from '../common-order-form';
import useKeyboardShortcuts from './hooks/use-keyboard-shortcuts';

const {useEffect, useState, useCallback, useRef, useContext} = React;
const CashOrderForm = createLazyComponent(() => import(/* webpackChunkName: "cash-order-form" */ '../cash-order-form'));
const CombinationOrderForm = createLazyComponent(
    () => import(/* webpackChunkName: "combination-order-form" */ '../combination-order-form')
);
const CommonOpenOrderDetails = createLazyComponent(
    () => import(/* webpackChunkName: "common-open-order-details" */ '../open-order-details')
);
const CommonOrderForm = createLazyComponent(
    () => import(/* webpackChunkName: "common-order-form" */ '../common-order-form')
);
const CurrencyOrderForm = createLazyComponent(
    () => import(/* webpackChunkName: "currency-order-form" */ '../currency-order-form')
);
// This component is responsible for opening order form by receiving specific global App events
// or URL params
const OrderFormsController: React.FunctionComponent = () => {
    const app = useContext(AppApiContext);
    const i18n = useContext(I18nContext);
    const config = useContext(ConfigContext);
    const mainClient = useContext(MainClientContext);
    const eventBroker = useContext(EventBrokerContext);
    const location = useLocation();
    const orderTypesMapRef = useRef<OrderTypesMap>({});
    const orderTimeTypesMapRef = useRef<OrderTimeTypesMap>({});
    const [cashOrderInfo, setCashOrderInfo] = useState<CashOrderInfo | undefined>();
    const closeNewCashOrderForm = useCallback(() => setCashOrderInfo(undefined), []);
    const openCommonOrderForm = (orderInfo: CommonOrderInfo = {}, productParams?: ProductParams) => {
        app.openSideInformationPanel({
            content: (
                <CommonOrderForm
                    onClose={app.closeSideInformationPanel}
                    orderInfo={orderInfo}
                    productParams={productParams}
                />
            )
        });
    };
    const openCommonOrderDetails = (order: Order, options?: {isEditable: boolean}) => {
        app.openSideInformationPanel({
            content: (
                <CommonOpenOrderDetails
                    orderTypesMap={orderTypesMapRef.current}
                    orderTimeTypesMap={orderTimeTypesMapRef.current}
                    order={order}
                    isEditable={options && options.isEditable}
                    onClose={app.closeSideInformationPanel}
                />
            )
        });
    };
    const onCommonOrderEditEvent = (_event: SubscriptionEvent, order: Order) => {
        openCommonOrderDetails(order, {isEditable: true});
    };
    const onCommonOrderViewEvent = (_event: SubscriptionEvent, order: Order) => {
        openCommonOrderDetails(order);
    };
    const onCommonOrderOpenEvent = (_event: SubscriptionEvent, commonOrderInfo: CommonOrderInfo) => {
        openCommonOrderForm(commonOrderInfo);
    };
    const onCommonOrderDeleteEvent = (_event: SubscriptionEvent, order: Order) => {
        const {productInfo} = order;
        const productName: string = (productInfo && getProductName(mainClient, productInfo)) || '';

        app.openModal({
            title: localize(i18n, 'trader.openOrders.deleteOrderConfirmation.title', {productName}),
            content: localize(i18n, 'trader.openOrders.deleteOrderConfirmation.description'),
            onConfirm() {
                deleteOrder(config, order).catch((error: Error | AppError) => {
                    const errorText: string = (isAppError(error) && error.text) || 'order.error.default';

                    logErrorLocally(error);
                    app.openModal({
                        error: new AppError({...error, text: errorText})
                    });
                });

                trackAnalytics(TrackerEventTypes.ORDER_DELETED, {
                    orderTypeId: order.orderTypeId,
                    orderTimeTypeId: order.orderTimeTypeId
                });
            }
        });
    };
    const onCashOrderOpenEvent = (_event: SubscriptionEvent, cashOrderInfo: CashOrderInfo) => {
        // [TRADER-1346] set a new copy of order info to allow re-opening order form with same object reference
        setCashOrderInfo({...cashOrderInfo});
    };
    const onCurrencyOrderOpenEvent = () => {
        app.openSideInformationPanel({
            content: <CurrencyOrderForm onClose={app.closeSideInformationPanel} />
        });
    };
    const onCombinationOrderOpenEvent = () => {
        app.openSideInformationPanel({
            content: <CombinationOrderForm onClose={app.closeSideInformationPanel} />
        });
    };

    useKeyboardShortcuts(openCommonOrderForm);

    useEffect(() => {
        const unsubscribeHandlers: Unsubscribe[] = [
            eventBroker.on(CommonOrderEvents.DELETE, onCommonOrderDeleteEvent),
            eventBroker.on(CommonOrderEvents.EDIT, onCommonOrderEditEvent),
            eventBroker.on(CommonOrderEvents.OPEN, onCommonOrderOpenEvent),
            eventBroker.on(CommonOrderEvents.VIEW, onCommonOrderViewEvent),
            eventBroker.on(CashOrderEvents.OPEN, onCashOrderOpenEvent),
            eventBroker.on(CurrencyOrderEvents.OPEN, onCurrencyOrderOpenEvent),
            eventBroker.on(CombinationOrderEvents.OPEN, onCombinationOrderOpenEvent)
        ];
        const initialDataPromise = createCancellablePromise(Promise.all([getOrderTypes(), getOrderTimeTypes()]));

        initialDataPromise.promise
            .then(([orderTypes, orderTimeTypes]: [OrderType[], OrderTimeType[]]) => {
                orderTypesMapRef.current = keyBy<OrderType>(orderTypes);
                orderTimeTypesMapRef.current = keyBy<OrderTimeType>(orderTimeTypes);
            })
            .catch(logErrorLocally);

        return () => {
            initialDataPromise.cancel();
            unsubscribeAll(unsubscribeHandlers);
        };
    }, []);

    useEffect(() => {
        const searchParams = parseUrlSearchParams(location.search);

        if (newCommonOrderParam in searchParams) {
            openCommonOrderForm({isBuyAction: searchParams.action !== 'sell'}, searchParams);
        } else if (cashOrderResultParam in searchParams) {
            setCashOrderInfo({});
        }
    }, [location.pathname, location.search]);

    return cashOrderInfo ? <CashOrderForm orderInfo={cashOrderInfo} onClose={closeNewCashOrderForm} /> : null;
};

export default React.memo(OrderFormsController);
