import {ProductInfo, VwdIdentifierTypes} from 'frontend-core/dist/models/product';
import isTouchDevice from 'frontend-core/dist/platform/is-touch-device';
import getQueryString from 'frontend-core/dist/utils/url/get-query-string';
import * as React from 'react';
import getVwdIdParams from '../../services/vwd-chart/get-vwd-id-params';
import {CurrentClientContext} from '../app-component/app-context';
import {image} from './product-performance-chart.css';

interface Props {
    productInfo: ProductInfo;
    height?: number;
    width?: number;
    className?: string;
    media?: MediaQueryList;
}

const {useState, useEffect, useContext} = React;
const baseUrl: string = 'https://solutions.vwdservices.com/customers/degiro.nl/charts/static-chart';
const ProductPerformanceChart: React.FunctionComponent<Props> = ({
    productInfo,
    media,
    // non-touch device: default size is 40x20
    // touch device: default size is 48x24
    height = isTouchDevice() ? 24 : 20,
    width = height * 2,
    className = ''
}) => {
    const currentClient = useContext(CurrentClientContext);
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [vwdId, setVwdId] = useState<ProductInfo['vwdId']>(undefined);
    const [vwdIdentifierType, setVwdIdentifierType] = useState<ProductInfo['vwdIdentifierType']>(null);
    const onImageLoadingError = (event: React.SyntheticEvent<HTMLImageElement>) => {
        const imgProductId: string | undefined = event.currentTarget.dataset.id;

        // check if it's not an error for previous product
        if (imgProductId === String(productInfo.id)) {
            // remove image to not show browser's default icon for missing image & to not keep unused DOM node
            setVwdId(undefined);
        }
    };

    useEffect(() => {
        const onMediaChange = () => setIsVisible(!media || media.matches);

        onMediaChange();
        media?.addListener(onMediaChange);

        return () => media?.removeListener(onMediaChange);
    }, [media]);

    useEffect(() => {
        const {vwdId, vwdIdentifierType} = getVwdIdParams(productInfo);

        setVwdId(vwdId);
        setVwdIdentifierType(vwdIdentifierType);
    }, [productInfo]);

    if (!vwdId || !isVisible) {
        return null;
    }

    const devicePixelRatio: number = Math.max(window.devicePixelRatio, 1);
    const queryString: string = getQueryString({
        [vwdIdentifierType || VwdIdentifierTypes.ISSUE_ID]: vwdId,
        // do not send decimal dimensions to VWD
        width: Math.round(width * devicePixelRatio),
        height: Math.round(height * devicePixelRatio),
        userIdentifier: currentClient.id
    });

    return (
        <img
            alt=""
            aria-hidden="true"
            className={`${image} ${className}`}
            data-id={productInfo.id}
            loading="lazy"
            onError={onImageLoadingError}
            src={`${baseUrl}?${queryString}`}
            // Dimensions should be specified to avoid perf problems (reflow) with lazy loading images. See
            // https://bugs.chromium.org/p/chromium/issues/detail?id=954323
            // https://web.dev/native-lazy-loading/#image-loading
            width={width}
            height={height}
        />
    );
};

export default React.memo(ProductPerformanceChart);
