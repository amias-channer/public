import * as React from 'react';
import NewTabLink from 'frontend-core/dist/components/ui-common/new-tab-link';
import {inlineLeft} from 'frontend-core/dist/components/ui-trader4/alignment-utils.css';
import Icon from 'frontend-core/dist/components/ui-trader4/icon';
import localize from 'frontend-core/dist/services/i18n/localize';
import getFeeScheduleLink from 'frontend-core/dist/services/order/get-fee-schedule-link';
import aboutIconUrl from '../../../../images/svg/about.svg';
import knowledgeCenterIconUrl from '../../../../images/svg/knowledge-center.svg';
import feeScheduleIconUrl from '../../../../images/svg/fee-schedule.svg';
import helpIconUrl from '../../../../images/svg/help.svg';
import guideIconUrl from '../../../../images/svg/guide.svg';
import {CurrentClientContext, I18nContext} from '../../app-component/app-context';
import AboutAppButton from '../../about-app/button';
import ProductTourButton from '../../product-tour/product-tour-button';
import BlockMenu, {BlockMenuProps} from '../../menu/block-menu';
import BlockMenuItemLayout from '../../menu/block-menu/block-menu-item-layout';
import {link, linkWrapper} from './help-menu.css';

const {memo, useCallback, useContext} = React;
const HelpMenu: React.FunctionComponent = () => {
    const currentClient = useContext(CurrentClientContext);
    const i18n = useContext(I18nContext);
    const title = localize(i18n, 'trader.navigation.support');
    const renderTarget = useCallback<BlockMenuProps['renderTarget']>(
        ({isOpened, open, close}) => (
            <NewTabLink
                className={link}
                onFocus={open}
                onMouseLeave={close}
                onMouseOver={open}
                href={localize(i18n, 'help.desk.url')}>
                <Icon type={isOpened ? 'help' : 'help_outline'} className={inlineLeft} />
                {title}
            </NewTabLink>
        ),
        [title]
    );

    return (
        <BlockMenu horizontalPosition="inside-start" renderTarget={renderTarget} targetWrapperClassName={linkWrapper}>
            <nav aria-label={title}>
                <ul>
                    <li>
                        <NewTabLink href={localize(i18n, 'mail.footer.helpcenter.link')}>
                            <BlockMenuItemLayout
                                iconUrl={helpIconUrl}
                                title={localize(i18n, 'trader.navigation.support.helpCenter')}
                                description={localize(i18n, 'trader.navigation.support.helpCenter.description')}
                            />
                        </NewTabLink>
                    </li>
                    <li>
                        <NewTabLink href={getFeeScheduleLink(currentClient, i18n)}>
                            <BlockMenuItemLayout
                                iconUrl={feeScheduleIconUrl}
                                title={localize(i18n, 'trader.navigation.support.feeSchedule')}
                                description={localize(i18n, 'trader.navigation.support.feeSchedule.description')}
                            />
                        </NewTabLink>
                    </li>
                    <li>
                        <NewTabLink href={localize(i18n, 'trader.navigation.knowledgeCenter.link')}>
                            <BlockMenuItemLayout
                                iconUrl={knowledgeCenterIconUrl}
                                title={localize(i18n, 'trader.navigation.knowledgeCenter.title')}
                                description={localize(i18n, 'trader.navigation.knowledgeCenter.description')}
                            />
                        </NewTabLink>
                    </li>
                    <li>
                        <ProductTourButton>
                            <BlockMenuItemLayout
                                iconUrl={guideIconUrl}
                                title={localize(i18n, 'trader.navigation.productTour.title')}
                                description={localize(i18n, 'trader.navigation.productTour.description')}
                            />
                        </ProductTourButton>
                    </li>
                    <li>
                        <AboutAppButton>
                            <BlockMenuItemLayout
                                iconUrl={aboutIconUrl}
                                title={localize(i18n, 'trader.aboutApp.globalButton.title')}
                                description={localize(i18n, 'trader.aboutApp.globalButton.description')}
                            />
                        </AboutAppButton>
                    </li>
                </ul>
            </nav>
        </BlockMenu>
    );
};

export default memo(HelpMenu);
