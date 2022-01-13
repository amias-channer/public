import * as React from 'react';
import NewTabLink from 'frontend-core/dist/components/ui-common/new-tab-link';
import Icon from 'frontend-core/dist/components/ui-trader4/icon';
import localize from 'frontend-core/dist/services/i18n/localize';
import {
    cardHeaderTitle,
    companyProfileLastModified,
    croppedValue,
    summaryMoreButton,
    companyProfileSummarySection,
    companyProfileSummaryWrapper,
    viewMoreButton,
    label,
    valueItem,
    lineTopSeparator
} from './product-company-information.css';
import {autoWidthLabel, inlineEndValueItem, line} from '../../../../styles/details-overview.css';
import {actionLink} from '../../../../styles/link.css';
import {ModalSizes} from '../../modal';
import {valuePlaceholder} from '../../value';
import DateValue from '../../value/date';
import {RefinitivCompanyProfile} from '../../../models/refinitiv-company-profile';
import parseCompanyWebsiteUrl from '../../../services/refinitiv-company-profile/parse-company-website-url';
import NumericValue from '../../value/numeric';
import {AppApiContext, I18nContext} from '../../app-component/app-context';

interface Props {
    companyProfile?: RefinitivCompanyProfile;
}
const {useContext} = React;
const ProductCompanyInformation: React.FunctionComponent<Props> = ({companyProfile = {}}) => {
    const i18n = useContext(I18nContext);
    const app = useContext(AppApiContext);
    const {financialSummary, businessSummary, contacts} = companyProfile;
    const companyWebSiteUrl: string | undefined = contacts?.WEBSITE;
    const parsedCompanyWebSiteUrl: string | undefined = contacts && parseCompanyWebsiteUrl(contacts.WEBSITE);
    const showSummaryInformation = (title: string, content: string) => {
        app.openModal({
            size: ModalSizes.MEDIUM,
            title,
            content,
            footer: null
        });
    };

    return (
        <div>
            <dl>
                <div className={line}>
                    <dt className={`${label} ${autoWidthLabel}`}>
                        {localize(i18n, 'trader.productDetails.companyName')}
                    </dt>
                    <dd className={`${valueItem} ${inlineEndValueItem}`}>
                        {companyProfile.contacts?.NAME || valuePlaceholder}
                    </dd>
                </div>
                <div className={line}>
                    <dt className={`${label} ${autoWidthLabel}`}>{localize(i18n, 'trader.productDetails.website')}</dt>
                    <dd data-name="website" className={`${valueItem} ${inlineEndValueItem}`}>
                        {companyWebSiteUrl ? (
                            <div className={croppedValue}>
                                <NewTabLink className={actionLink} href={companyWebSiteUrl}>
                                    {parsedCompanyWebSiteUrl}
                                </NewTabLink>
                            </div>
                        ) : (
                            valuePlaceholder
                        )}
                    </dd>
                </div>
                <div className={line}>
                    <dt className={`${label} ${autoWidthLabel}`}>{localize(i18n, 'trader.productDetails.industry')}</dt>
                    <dd className={`${valueItem} ${inlineEndValueItem}`}>
                        <div className={croppedValue}>{companyProfile.industry || valuePlaceholder}</div>
                    </dd>
                </div>
                <div className={line}>
                    <dt className={`${label} ${autoWidthLabel}`}>{localize(i18n, 'trader.productDetails.sector')}</dt>
                    <dd className={`${valueItem} ${inlineEndValueItem}`}>
                        <div className={croppedValue}>{companyProfile.sector || valuePlaceholder}</div>
                    </dd>
                </div>
                <div className={line}>
                    <dt className={`${label} ${autoWidthLabel}`}>
                        {localize(i18n, 'trader.productDetails.numberOfEmployees')}
                    </dt>
                    <dd className={`${valueItem} ${inlineEndValueItem}`}>
                        <NumericValue id="companyProfile" value={companyProfile.employees} field="employees" />
                    </dd>
                </div>
                <div className={line}>
                    <dt className={`${label} ${autoWidthLabel}`}>
                        {localize(i18n, 'trader.productDetails.reportingCurrency')}
                    </dt>
                    <dd className={`${valueItem} ${inlineEndValueItem}`}>
                        {companyProfile.ratios?.currency || valuePlaceholder}
                    </dd>
                </div>
            </dl>
            <hr className={lineTopSeparator} />
            <div className={companyProfileSummaryWrapper}>
                <div className={companyProfileSummarySection}>
                    <h3 className={cardHeaderTitle}>{localize(i18n, 'trader.productDetails.businessSummary')} </h3>
                    {businessSummary ? (
                        <>
                            <div className={companyProfileLastModified}>
                                {localize(i18n, 'trader.productDetails.lastModified')}:{' '}
                                <DateValue
                                    id="companyProfile"
                                    field="businessSummaryLastModified"
                                    value={companyProfile.businessSummaryLastModified}
                                    onlyTodayTime={true}
                                />
                            </div>
                            <button
                                type="button"
                                className={summaryMoreButton}
                                onClick={showSummaryInformation.bind(
                                    null,
                                    localize(i18n, 'trader.productDetails.businessSummary'),
                                    businessSummary
                                )}>
                                {businessSummary}
                            </button>
                        </>
                    ) : (
                        valuePlaceholder
                    )}
                </div>
                {businessSummary && (
                    <div className={viewMoreButton}>
                        <button
                            type="button"
                            data-name="businessSummaryMoreButton"
                            onClick={showSummaryInformation.bind(
                                null,
                                localize(i18n, 'trader.productDetails.businessSummary'),
                                businessSummary
                            )}>
                            <Icon type="keyboard_arrow_right" />
                        </button>
                    </div>
                )}
            </div>
            <hr className={lineTopSeparator} />
            <div className={companyProfileSummaryWrapper}>
                <div className={companyProfileSummarySection}>
                    <h3 className={cardHeaderTitle}>{localize(i18n, 'trader.productDetails.financialSummary')}</h3>
                    {financialSummary ? (
                        <>
                            <div className={companyProfileLastModified}>
                                {localize(i18n, 'trader.productDetails.lastModified')}:{' '}
                                <DateValue
                                    id="companyProfile"
                                    field="financialSummaryLastModified"
                                    value={companyProfile.financialSummaryLastModified}
                                    onlyTodayTime={true}
                                />
                            </div>
                            <button
                                type="button"
                                className={summaryMoreButton}
                                onClick={showSummaryInformation.bind(
                                    null,
                                    localize(i18n, 'trader.productDetails.financialSummary'),
                                    financialSummary
                                )}>
                                {financialSummary}
                            </button>
                        </>
                    ) : (
                        valuePlaceholder
                    )}
                </div>
                {financialSummary && (
                    <div className={viewMoreButton}>
                        <button
                            type="button"
                            data-name="financialSummaryMoreButton"
                            onClick={showSummaryInformation.bind(
                                null,
                                localize(i18n, 'trader.productDetails.financialSummary'),
                                financialSummary
                            )}>
                            <Icon type="keyboard_arrow_right" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default React.memo(ProductCompanyInformation);
