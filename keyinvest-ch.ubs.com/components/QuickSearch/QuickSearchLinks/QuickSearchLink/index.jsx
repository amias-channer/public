import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';
import Button from '../../../Button';
import { searchAndReplaceTextInString } from '../../../../utils/utils';

function QuickSearchLink(props) {
  const { data, activeInputName, onQuickSearchLinkClicked } = props;
  const onClick = () => {
    onQuickSearchLinkClicked(data.value);
  };

  const isLinkDisabled = () => {
    if (data.disabled) {
      return true;
    }

    if (activeInputName === null) {
      return false;
    }
    return !(activeInputName in data);
  };

  const prepareDefaultUrl = (url) => {
    let preparedUrl = searchAndReplaceTextInString('%s', '', url);
    preparedUrl = searchAndReplaceTextInString('%e', '', preparedUrl);
    return preparedUrl;
  };

  const getToLocation = () => {
    if (activeInputName && data[activeInputName]) {
      return data[activeInputName];
    }

    if (data.urlStrike) {
      return prepareDefaultUrl(data.urlStrike);
    }

    if (data.urlLeverage) {
      return prepareDefaultUrl(data.urlLeverage);
    }

    return '';
  };

  return (
    <div className="QuickSearchLink col px-sm-1">
      <Button
        className={classNames('quick-search-link-button', (isLinkDisabled()) ? 'disabled' : '')}
        to={getToLocation()}
        onClick={onClick}
        RenderAs={NavLink}
      >
        {data.value}
      </Button>
    </div>
  );
}

QuickSearchLink.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  onQuickSearchLinkClicked: PropTypes.func,
  activeInputName: PropTypes.string,
};

QuickSearchLink.defaultProps = {
  data: {},
  onQuickSearchLinkClicked: () => {},
  activeInputName: '',
};

export default React.memo(QuickSearchLink);
