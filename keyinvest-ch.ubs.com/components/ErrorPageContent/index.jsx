import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { getErrorPageContentByStatusCode } from '../../utils/utils';
import GenericErrorMessage from '../GenericErrorMessage';
import { generateCmsLayout } from '../../pages/CmsPage/CmsPage.helper';

class ErrorPageContentCmp extends React.PureComponent {
  render() {
    const { errorCode, className } = this.props;
    return (
      <div className={classNames('ErrorPageContent', className)}>
        {generateCmsLayout(getErrorPageContentByStatusCode(errorCode))}
        {!errorCode && (
          <GenericErrorMessage />
        )}
      </div>
    );
  }
}

ErrorPageContentCmp.propTypes = {
  errorCode: PropTypes.number,
  className: PropTypes.string,
};
ErrorPageContentCmp.defaultProps = {
  errorCode: null,
  className: '',
};

const ErrorPageContent = connect()(ErrorPageContentCmp);
export default ErrorPageContent;
