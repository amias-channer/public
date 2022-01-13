import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Row } from 'reactstrap';
import './ProductExpandableTile.scss';
import { NavLink } from 'react-router-dom';
import Icon from '../Icon';
import KeyValueGroupsComp from './KeyValueGroups';
import GenericFields
  from '../Market/MarketLeverageInstrument/MarketLeverageInstrumentDetails/GenericFields';
import FlyoutMenu from './FlyoutMenu';
import {
  FLYOUT_MENU_ACTION_REMOVE_PRODUCT,
  FLYOUT_MENU_ACTION_SET_UP_NOTIFICATION,
  getFlyoutMenuItems, getProductNotifications,
  getProductTitle,
  getUnderlyingName,
} from './ProductExpandableTile.helper';
import HtmlText from '../HtmlText';
import FieldTooltips from '../ProductDetail/FieldTooltips';
import { isEmptyData } from '../../utils/utils';

export const ProductExpandableTile = ({
  isMobileMode, data, className,
  onRemoveProduct, onSetupNotificationAlert, onEditableFieldChangeAction,
}) => {
  const [isTileExpanded, setTileExpanded] = useState(false);
  const onArrowClicked = () => (isTileExpanded ? setTileExpanded(false) : setTileExpanded(true));
  const getMobileColumns = (cols) => cols.filter(
    (item) => (item.displayOnMobile && item.displayOnMobile === true),
  );
  const productNotifications = getProductNotifications(data);

  const fetchProductTileData = () => {};

  const onMenuItemClicked = (item) => {
    switch (item.action) {
      case FLYOUT_MENU_ACTION_REMOVE_PRODUCT:
        onRemoveProduct(item.url);
        break;
      case FLYOUT_MENU_ACTION_SET_UP_NOTIFICATION:
        onSetupNotificationAlert(data.isin);
        break;
      default:
        break;
    }
  };

  const getFlyoutItemByType = (item) => {
    switch (item.type) {
      case 'directDownloadLink':
        return item.url && (
          <li key={item.label}>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon type={item.icon} />
              {item.label}
            </a>
          </li>
        );
      case 'navLink':
        return (
          <li key={item.label}>
            <NavLink to={item.url}>
              <Icon type={item.icon} />
              {item.label}
            </NavLink>
          </li>
        );
      case 'apiLink':
        return (
          <li key={item.label} role="presentation" onClick={() => onMenuItemClicked(item)}>
            <Icon type={item.icon} />
            {item.label}
          </li>
        );
      default:
        return (
          <li key={item.label}>
            <Icon type={item.icon} />
            {item.label}
          </li>
        );
    }
  };

  return (
    <div className={classNames(className, 'ProductExpandableTile')}>
      <div className="tile-wrapper">
        <Row className="top-row">
          <div className="col">
            {productNotifications && !isEmptyData(productNotifications) && (
              <FieldTooltips list={productNotifications} />
            )}
            <HtmlText className="title" data={{ text: getProductTitle(data) }} tag="h3" />
          </div>
          <div className="col-auto flyout-icon-col">
            <span className="icon-container">
              <FlyoutMenu>
                <ul>
                  {getFlyoutMenuItems(data).map((flyoutItem) => getFlyoutItemByType(flyoutItem))}
                </ul>
              </FlyoutMenu>
            </span>
          </div>
        </Row>
        <Row className="underlying-name-row">
          <div className="col underlying-name-col">
            {getUnderlyingName(data)}
          </div>
        </Row>
        <Row>
          <div className="col">
            {isMobileMode && (
            <Row className="generic-fields-mobile">
              <GenericFields fields={getMobileColumns(data.columns)} fieldClassName="col" />
            </Row>
            )}
            {!isMobileMode && (
            <Row className="generic-fields">
              <GenericFields fields={data.columns} fieldClassName="col-auto" />
            </Row>
            )}
            {isTileExpanded && (
            <KeyValueGroupsComp
              groups={data.keyValueGroups}
              fetchProductTileData={fetchProductTileData}
              urlToUpdateProductField={data.updateUrl}
              onEditableFieldChangeAction={onEditableFieldChangeAction}
            />
            )}
            <Row>
              <div className="col text-center">
                <Icon type={isTileExpanded ? 'arrow_02_up' : 'arrow_02_down'} onClick={onArrowClicked} />
              </div>
            </Row>
          </div>
        </Row>
      </div>
    </div>
  );
};

ProductExpandableTile.propTypes = {
  isMobileMode: PropTypes.bool,
  data: PropTypes.objectOf(PropTypes.any),
  className: PropTypes.string,
  onRemoveProduct: PropTypes.func,
  onSetupNotificationAlert: PropTypes.func,
  onEditableFieldChangeAction: PropTypes.func,
};

ProductExpandableTile.defaultProps = {
  isMobileMode: false,
  data: {
    columns: [],
    keyValueGroups: [],
    updateUrl: '',
  },
  className: '',
  onRemoveProduct: () => {},
  onSetupNotificationAlert: () => {},
  onEditableFieldChangeAction: () => {},
};
export default React.memo(ProductExpandableTile);
