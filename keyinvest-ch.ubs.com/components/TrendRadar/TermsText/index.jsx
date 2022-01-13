import React from 'react';
import PropTypes from 'prop-types';

const TermsText = ({ data }) => (
  <div className="TermsText">
    {data.map((term) => (
      <div key={term.label || term.value}>
        <h3>{term.label}</h3>
        <p>{term.value}</p>
      </div>
    ))}
  </div>
);

TermsText.propTypes = {
  data: PropTypes.arrayOf(PropTypes.any),
};

TermsText.defaultProps = {
  data: [],
};

export default React.memo(TermsText);
