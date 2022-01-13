import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../../../Icon';
import './SearchListItem.scss';
import HtmlText from '../../../HtmlText';

const SearchListItem = ({ data, onItemClick }) => {
  const onItemClicked = () => {
    onItemClick(data);
  };
  return (
    <li role="presentation" className="SearchListItem" onClick={onItemClicked}>
      <Icon type="plus" />
      <HtmlText tag="span" data={{ text: data.name }} />
    </li>
  );
};

SearchListItem.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  onItemClick: PropTypes.func,
};

SearchListItem.defaultProps = {
  data: {},
  onItemClick: () => {},
};

export default React.memo(SearchListItem);
