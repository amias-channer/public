import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import './ToolsButtons.scss';
import {
  BOOKMARK_TOOL_BUTTON,
  EMAIL_TOOL_BUTTON,
  PRINT_TOOL_BUTTON,
} from '../../../pages/ProductDetailPage/ProductDetailPage.helper';
import Icon from '../../Icon';
import i18n from '../../../utils/i18n';

const ToolsButtonsCmp = ({
  className, toolsActionFunc, secondaryMarketButton,
  addToMyWatchListButton, onMyWatchListButtonClick,
}) => {
  const emailAction = (event) => toolsActionFunc(EMAIL_TOOL_BUTTON, event);
  const bookmarkAction = (event) => toolsActionFunc(BOOKMARK_TOOL_BUTTON, event);
  const printAction = (event) => toolsActionFunc(PRINT_TOOL_BUTTON, event);

  return (
    <div className={classNames('ToolsButtons', className)}>
      {secondaryMarketButton}
      {addToMyWatchListButton && addToMyWatchListButton.showButton && (
        <Button
          color="outline"
          className={classNames('addToWatchlist', secondaryMarketButton ? '' : 'ml-auto')}
          onClick={onMyWatchListButtonClick}
          title={i18n.t('add_to_watchlist')}
        >
          <Icon type="Eye-16px" />
        </Button>
      )}
      <Button title={i18n.t('email')} color="outline" className={classNames('email')} onClick={emailAction}><Icon type="mail" /></Button>
      <Button title={i18n.t('bookmark')} color="outline" className="bookmark" onClick={bookmarkAction}><Icon type="star" /></Button>
      <Button title={i18n.t('print')} color="outline" className="print" onClick={printAction}><Icon type="print" /></Button>
    </div>
  );
};
ToolsButtonsCmp.propTypes = {
  className: PropTypes.string,
  toolsActionFunc: PropTypes.func.isRequired,
  secondaryMarketButton: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.elementType,
  ]),
  addToMyWatchListButton: PropTypes.objectOf(PropTypes.any),
  onMyWatchListButtonClick: PropTypes.func,
};
ToolsButtonsCmp.defaultProps = {
  className: '',
  secondaryMarketButton: null,
  addToMyWatchListButton: null,
  onMyWatchListButtonClick: () => {},
};

const ToolsButtons = React.memo(ToolsButtonsCmp);
export default ToolsButtons;
