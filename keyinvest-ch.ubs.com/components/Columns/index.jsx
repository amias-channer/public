import React from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-cycle
import CmsComponentsContainer from '../CmsComponentsContainer';
import './Columns.scss';

function Columns(props) {
  const { data } = props;
  if (data.columns && Object.keys(data.columns).length) {
    const { columns, breakpoint, componentGroups } = data;
    const cols = Object.keys(columns).map(
      (index) => (
        <div key={index} className={`column ${breakpoint}${columns[index].size}`}>
          <CmsComponentsContainer components={componentGroups[index]} />
        </div>
      ),
    );
    return (
      <div className="row Columns">
        {cols}
      </div>
    );
  }
  return null;
}

Columns.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
};
Columns.defaultProps = {
  data: {
    columns: {},
    breakpoint: '',
    componentGroups: {},
  },
};

export default React.memo(Columns);
