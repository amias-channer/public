import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import HtmlText from '../../../HtmlText';

function ThemeColumn(props) {
  const {
    className, onColumnClick, column, label, sortIcon,
  } = props;
  const onColumnClicked = () => {
    onColumnClick(column);
  };
  return (
    <span
      role="link"
      tabIndex="-1"
      onKeyUp={onColumnClicked}
      className={classNames('ThemeColumn', className)}
      onClick={onColumnClicked}
      key={column}
      id={column}
    >
      <HtmlText tag="span" data={{ text: label }} />
      {sortIcon}
    </span>
  );
}

ThemeColumn.propTypes = {
  className: PropTypes.string,
  onColumnClick: PropTypes.func,
  column: PropTypes.string,
  label: PropTypes.string,
  sortIcon: PropTypes.objectOf(PropTypes.any),
};

ThemeColumn.defaultProps = {
  className: '',
  onColumnClick: () => {},
  column: '',
  label: '',
  sortIcon: {},
};

export default React.memo(ThemeColumn);
