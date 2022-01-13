import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import IframeResizer from 'iframe-resizer-react';
import './IFrame.scss';

const IFrameComponent = (props) => {
  const { data, className } = props;
  const [isLoading, setIsLoading] = useState(true);
  const hideLoader = () => {
    setIsLoading(false);
  };
  if (data && data.url) {
    return (
      <div className={classNames('IFrame', className)}>
        {isLoading && <div className="is-loading" />}
        <IframeResizer
          onLoad={hideLoader}
          warningTimeout={0}
          src={data.url}
        />
      </div>
    );
  }
  return null;
};

IFrameComponent.propTypes = {
  className: PropTypes.string,
  data: PropTypes.objectOf(PropTypes.any),
};
IFrameComponent.defaultProps = {
  className: '',
  data: {
    src: '',
  },
};
const IFrame = React.memo(IFrameComponent);
export default IFrame;
