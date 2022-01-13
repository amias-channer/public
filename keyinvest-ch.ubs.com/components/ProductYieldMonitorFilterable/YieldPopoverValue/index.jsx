import React from 'react';
import { PopoverBody, UncontrolledPopover } from 'reactstrap';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import HtmlText from '../../HtmlText';
import i18n from '../../../utils/i18n';
import './YieldPopoverValue.scss';
import { getProductLink } from '../../../utils/utils';
import ProductNavLink from '../../ProductNavLink';
import {
  NETCENTRIC_CTA_TYPE_HTML_TEXT,
  NETCENTRIC_YIELD_MONITOR_PARENT_CMP_NAME,
} from '../../../analytics/Analytics.helper';

const YieldPopoverValue = ({ value, className }) => {
  const productLink = getProductLink('isin', value.isin);
  return (
    <>
      <span className={classNames('YieldPopoverValue', className, value.class)} id={`POPOVER-${value.isin}`}>
        <ProductNavLink
          to={productLink}
          analyticsText={value.profit}
          analyticsCtaType={NETCENTRIC_CTA_TYPE_HTML_TEXT}
          parentComponentName={NETCENTRIC_YIELD_MONITOR_PARENT_CMP_NAME}
          isin={value.isin}
        >
          <HtmlText tag="span" className={value.class} data={{ text: value.profit }} />
        </ProductNavLink>
      </span>
      <UncontrolledPopover className="YieldPopoverValue-popover" trigger="hover" placement="top" target={`POPOVER-${value.isin}`}>
        <PopoverBody>
          <div className="name">
            <HtmlText tag="span" className={value.class} data={{ text: value.name }} />
          </div>
          <div className="distance2ClosestBarrierLevelPercent">
            <span className="field-name">{`${i18n.t('distance2ClosestBarrierLevelPercent')} :`}</span>
            <span className="field-value">{value.distance2ClosestBarrierLevelPercent}</span>
          </div>
          <div className="maturityDate">
            <span className="field-name">{`${i18n.t('maturityDate')} :`}</span>
            <span className="field-value">{value.maturityDate}</span>
          </div>
          <div className="identifiers">
            {value['es-swx'] && (<div>{value['es-swx']}</div>)}
            {value.valor && (<div>{value.valor}</div>)}
            {value.isin && (<div>{value.isin}</div>)}
          </div>
        </PopoverBody>
      </UncontrolledPopover>
    </>
  );
};

YieldPopoverValue.propTypes = {
  value: PropTypes.objectOf(PropTypes.any),
  className: PropTypes.string,
};
YieldPopoverValue.defaultProps = {
  value: {},
  className: '',
};

export default React.memo(YieldPopoverValue);
