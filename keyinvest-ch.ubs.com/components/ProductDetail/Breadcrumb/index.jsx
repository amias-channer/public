import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Button } from 'reactstrap';
import { connect } from 'react-redux';
import { getProductListLink } from '../../../utils/utils';
import i18n from '../../../utils/i18n';
import HtmlText from '../../HtmlText';
import { STATE_NAME_PRODUCT_LIST } from '../../../main/constants';

export const BreadcrumbCmp = ({
  className, crumb, history, previousStateName,
}) => {
  const goBack = () => {
    if (previousStateName === STATE_NAME_PRODUCT_LIST) {
      history.goBack();
    } else {
      history.push(getProductListLink());
    }
  };
  return (
    <div className={classNames('Breadcrumb', className)}>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Button color="outline" tag="a" onClick={goBack}>
              {i18n.t('Products')}
            </Button>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            <HtmlText className="d-inline-block" data={{ text: crumb }} />
          </li>
        </ol>
      </nav>
    </div>
  );
};
BreadcrumbCmp.propTypes = {
  className: PropTypes.string,
  crumb: PropTypes.string.isRequired,
  previousStateName: PropTypes.string,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
};
BreadcrumbCmp.defaultProps = {
  className: '',
  previousStateName: null,
};

const mapStateToProps = (state) => (
  { previousStateName: state.global && state.global.previousStateName }
);

const Breadcrumb = React.memo(connect(mapStateToProps)(withRouter(BreadcrumbCmp)));
export default Breadcrumb;
