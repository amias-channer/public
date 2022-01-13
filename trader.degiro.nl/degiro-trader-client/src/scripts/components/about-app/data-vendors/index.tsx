import NewTabLink from 'frontend-core/dist/components/ui-common/new-tab-link';
import Icon from 'frontend-core/dist/components/ui-trader4/icon';
import useMediaQuery from 'frontend-core/dist/hooks/use-media-query';
import localize from 'frontend-core/dist/services/i18n/localize';
import * as React from 'react';
import batsLogoPath from '../../../../images/bats-logo.png';
import euronextLogoPath from '../../../../images/euronext-logo.png';
import refinitivLogoPath from '../../../../images/refinitiv-logo.png';
import vwdLogoPath from '../../../../images/vwd-logo.png';
import {smallViewportMinWidth} from '../../../media-queries';
import {I18nContext} from '../../app-component/app-context';
import Hint from '../../hint';
import {nbsp, valuesDelimiter} from '../../value';
import {
    batsLogo as batsLogoClassName,
    compactLayout,
    euronextLogo as euronextLogoClassName,
    firstLine,
    fullLayout,
    label,
    logos,
    refinitivLogo as refinitivLogoClassName,
    titles,
    toggleIcon,
    vwdLogo as vwdLogoClassName
} from './data-vendors.css';

interface Props {
    className: string;
    withLogos?: boolean;
}

const {useContext} = React;
const DataVendors: React.FunctionComponent<Props> = ({withLogos, className}) => {
    const year = new Date().getFullYear();
    const i18n = useContext(I18nContext);
    const hasXSmallLayout: boolean = !useMediaQuery(smallViewportMinWidth);

    return (
        <div data-name="data-vendors" className={`${hasXSmallLayout ? compactLayout : fullLayout} ${className}`}>
            <div className={firstLine}>
                <span className={label}>
                    © {year} - flatexDEGIRO Bank Dutch Branch
                    {withLogos && ` - ${localize(i18n, 'trader.aboutApp.copyright.dataFrom')}`}
                </span>
                {withLogos ? (
                    <figure className={logos}>
                        <img className={refinitivLogoClassName} alt="Refinitiv" src={refinitivLogoPath} />
                        <img className={vwdLogoClassName} alt="VWD group" src={vwdLogoPath} />
                        <img className={euronextLogoClassName} alt="Euronext" src={euronextLogoPath} />
                        <img className={batsLogoClassName} alt="Chi-X Bats" src={batsLogoPath} />
                    </figure>
                ) : (
                    <span className={titles}>
                        - {localize(i18n, 'trader.aboutApp.copyright.dataSource')} Refinitiv
                        <Hint
                            hasCloseButton={true}
                            hoverTriggerDisabled={true}
                            content={
                                <span>
                                    © {year} {localize(i18n, 'trader.aboutApp.copyright.refinitivDescription')}
                                    {nbsp}
                                    <NewTabLink href="https://www.refinitiv.com">www.refinitiv.com</NewTabLink>
                                </span>
                            }
                            verticalPosition="before"
                            horizontalPosition="inside-center">
                            <Icon infoIcon={true} className={toggleIcon} />
                        </Hint>
                    </span>
                )}
            </div>
            {!withLogos && (
                <div className={titles}>
                    {!hasXSmallLayout && valuesDelimiter}
                    {localize(i18n, 'trader.aboutApp.copyright.priceData')}
                    {nbsp}VWD group Euronext Chi-X Bats
                </div>
            )}
        </div>
    );
};

export default React.memo(DataVendors);
