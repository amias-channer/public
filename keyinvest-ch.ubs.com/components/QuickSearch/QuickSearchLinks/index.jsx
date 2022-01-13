import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { isEven } from '../../../utils/utils';
import i18n from '../../../utils/i18n';
import QuickSearchLink from './QuickSearchLink';

function QuickSearchLinks(props) {
  const {
    className, data, activeInputName, onQuickSearchLinkClicked,
  } = props;
  const links = data.map((item, key) => {
    if (isEven(key)) {
      return (
        <div className="row mx-sm-n1 buttons-row" key={item.value ? item.value : key}>
          <QuickSearchLink
            data={item}
            activeInputName={activeInputName}
            onQuickSearchLinkClicked={onQuickSearchLinkClicked}
          />
          <QuickSearchLink
            data={data[key + 1]}
            activeInputName={activeInputName}
            onQuickSearchLinkClicked={onQuickSearchLinkClicked}
          />
        </div>
      );
    }
    return null;
  });
  return (
    <div className={classNames('QuickSearchLinks', className)}>
      <div className="selections">
        <div className="bottom-section">
          <div className={classNames(className)}>
            <h3 className="product-type-select-heading">{i18n.t('Select SVSP category')}</h3>
            <div className="button-inputs">
              {links}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
QuickSearchLinks.propTypes = {
  className: PropTypes.string,
  activeInputName: PropTypes.string,
  onQuickSearchLinkClicked: PropTypes.func,
  data: PropTypes.arrayOf(PropTypes.any),
};

QuickSearchLinks.defaultProps = {
  className: '',
  activeInputName: '',
  onQuickSearchLinkClicked: () => {},
  data: [],
};
export default React.memo(QuickSearchLinks);
