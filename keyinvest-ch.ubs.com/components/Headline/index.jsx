import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

function Headline(props) {
  const { data, className } = props;
  const HeadlineTagName = data.size || data.headline.size;
  return HeadlineTagName && (
    <HeadlineTagName className={classNames('Headline', className)}>{ data.text || data.headline.text}</HeadlineTagName>
  );
}

Headline.propTypes = {
  className: PropTypes.string,
  data: PropTypes.objectOf(PropTypes.any),
};
Headline.defaultProps = {
  className: '',
  data: {
    headline: {
      text: '',
      size: 'h1',
    },
  },
};

export default React.memo(Headline);
