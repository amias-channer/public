import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Row } from 'reactstrap';
import AbstractPage from '../AbstractPage';
import { getSubNavigationByStateName, mapPageStateNameToComponent } from '../../utils/utils';
import { MOBILE_MODE, TABLET_MODE } from '../../utils/responsive';
import LeftHandNavigation from '../../components/LeftHandNavigation';
import PublicationsDownload from '../../components/Service/PublicationsDownload';
import {
  STATE_NAME_PRODUCT_KNOWLEDGE_ROOT_NAVIGATION_STATE,
  STATE_NAME_SERVICE_PUBLICATIONS_DOWNLOAD,
} from '../../main/constants';

const serviceSubStateToComponent = {
  [STATE_NAME_SERVICE_PUBLICATIONS_DOWNLOAD]: PublicationsDownload,
};

export class ProductKnowledgePageComponent extends AbstractPage {
  render() {
    const { stateName, location, responsiveMode } = this.props;
    const ProductKnowledgeSubComponent = mapPageStateNameToComponent(
      stateName,
      serviceSubStateToComponent,
    );
    return (
      <div className="ProductKnowledgePage">
        {this.getHelmetData()}
        <Row>
          {responsiveMode !== MOBILE_MODE && responsiveMode !== TABLET_MODE && (
          <LeftHandNavigation
            data={{
              navigation: getSubNavigationByStateName(
                STATE_NAME_PRODUCT_KNOWLEDGE_ROOT_NAVIGATION_STATE,
              ),
            }}
            className="col-lg-auto"
          />
          )}
          {ProductKnowledgeSubComponent && (
          <ProductKnowledgeSubComponent
            stateName={stateName}
            location={location}
          />
          )}
        </Row>
      </div>
    );
  }
}

ProductKnowledgePageComponent.propTypes = {
  stateName: PropTypes.string,
};
ProductKnowledgePageComponent.defaultProps = {
  stateName: '',
};
const mapStateToProps = (state) => ({
  responsiveMode: state.global.responsiveMode,
});
const ProductKnowledgePage = connect(mapStateToProps)(ProductKnowledgePageComponent);
export default ProductKnowledgePage;
