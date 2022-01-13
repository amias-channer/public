import React from 'react';
import PropTypes from 'prop-types';
import { dispatchAnalyticsGlobalSearchTrack } from '../../../../../analytics/Analytics.helper';
import HtmlText from '../../../../HtmlText';

const SearchResultLink = React.forwardRef((props, ref) => {
  const {
    searchPhrase, onClick, group, name, url,
  } = props;
  const onLinkClick = (e) => {
    if (typeof onClick === 'function') {
      onClick(e);
    }

    const searchItem = `${group}:${name}`;
    dispatchAnalyticsGlobalSearchTrack(searchPhrase, searchItem);
  };
  return (
    <a
      href={url}
      onClick={onLinkClick}
      title={name}
      ref={ref}
    >
      <HtmlText data={{ text: name }} />
    </a>
  );
});

SearchResultLink.propTypes = {
  group: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  searchPhrase: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

SearchResultLink.defaultProps = {
  onClick: null,
};

export default React.memo(SearchResultLink);
