import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { getProductListLink } from '../../../utils/utils';

function NewsStoryIdeasList(props) {
  const { data } = props;
  const getListItems = () => {
    if (data && data.length > 0) {
      return data.map((listItem) => (
        <li key={listItem.link}>
          <span><i className="icon-arrow_01_forward" /></span>
          <NavLink to={`${getProductListLink()}${listItem.link}`}>{listItem.label}</NavLink>
        </li>
      ));
    }
    return null;
  };
  return (
    <div className="NewsStoryIdeasList">
      <ul>
        {getListItems()}
      </ul>
    </div>
  );
}

NewsStoryIdeasList.propTypes = {
  data: PropTypes.arrayOf(PropTypes.any),
};

NewsStoryIdeasList.defaultProps = {
  data: [],
};

export default React.memo(NewsStoryIdeasList);
