import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import {
  Button, Col, Row,
} from 'reactstrap';
import './ProductInformationTeaser.scss';
import MediaQuery from 'react-responsive';
import mediaQueries from '../../utils/mediaQueries';
import {
  getButtonTwoSrc,
  getImageAltDescription,
  getImageSrc,
  getPdfOneSrc,
  getPdfOneTitle,
  getPdfTwoSrc,
  getPdfTwoTitle,
  getOpenButtonTwoInNewTab,
  getButtonTwoText,
  getOpenButtonOneInNewTab,
  getButtonOneSrc,
  getButtonOneText,
  getOpenMobileButtonTwoInNewTab,
  getMobileButtonTwoSrc,
  getMobileButtonTwoText,
  getOpenMobileButtonOneInNewTab,
  getMobileButtonOneSrc,
  getMobileButtonOneText,
  getMobileButtonTwoDescription,
  getMobileButtonOneDescription,
  getButtonOneDescription,
  getButtonTwoDescription,
} from './ProductInformationTeaser.helper';
import { adformTrackEventClick } from '../../adformTracking/AdformTracking.helper';

function ProductInformationTeaser(props) {
  const { data, className } = props;

  const getImage = (componentData) => (<img className="img-fluid" alt={getImageAltDescription(componentData)} src={getImageSrc(componentData)} />);
  const onPdfLinkClick = (e, fileTitle) => {
    adformTrackEventClick(
      e,
      `${fileTitle}-pdf-download-click`.toLowerCase(),
    );
  };
  const getPdfLinks = (componentData) => (
    <ul className="pdf-links">
      {getPdfOneSrc(componentData) && getPdfOneTitle(componentData) && (
        <li>
          <i className="icon-upload" />
          <a
            href={getPdfOneSrc(componentData)}
            target="_blank"
            rel="noopener noreferrer"
            download
            onClick={(e) => onPdfLinkClick(e, getPdfOneTitle(componentData))}
          >
            {getPdfOneTitle(componentData)}
          </a>
        </li>
      )}
      {getPdfTwoSrc(componentData) && getPdfTwoTitle(componentData) && (
        <li>
          <i className="icon-upload" />
          <a
            href={getPdfTwoSrc(componentData)}
            target="_blank"
            rel="noopener noreferrer"
            download
            onClick={(e) => onPdfLinkClick(e, getPdfTwoTitle(componentData))}
          >
            {getPdfTwoTitle(componentData)}
          </a>
        </li>
      )}
    </ul>
  );
  const getButtonLinks = (componentData) => (
    <ul className="button-links">
      <MediaQuery query={mediaQueries.tablet}>
        {getButtonTwoSrc(componentData) && (
          <li>
            <Button
              target={parseInt(getOpenButtonTwoInNewTab(componentData), 10) ? '_blank' : '_self'}
              tag="a"
              title={getButtonTwoDescription(componentData)}
              href={getButtonTwoSrc(componentData)}
              color="gray"
            >
              {getButtonTwoText(componentData)}
            </Button>
          </li>
        )}
        {getButtonOneSrc(componentData) && (
          <li>
            <Button
              target={parseInt(getOpenButtonOneInNewTab(componentData), 10) ? '_blank' : '_self'}
              tag="a"
              title={getButtonOneDescription(componentData)}
              href={getButtonOneSrc(componentData)}
              color="green"
              className="btn-arrowed"
            >
              {getButtonOneText(componentData)}
            </Button>
          </li>
        )}
      </MediaQuery>

      <MediaQuery query={mediaQueries.mobileOnly}>
        {getMobileButtonTwoSrc(componentData) && (
          <li>
            <Button
              target={parseInt(getOpenMobileButtonTwoInNewTab(componentData), 10) ? '_blank' : '_self'}
              tag="a"
              title={getMobileButtonTwoDescription(componentData)}
              href={getMobileButtonTwoSrc(componentData)}
              color="gray"
            >
              {getMobileButtonTwoText(componentData)}
            </Button>
          </li>
        )}
        {getMobileButtonOneSrc(componentData) && (
          <li>
            <Button
              target={parseInt(getOpenMobileButtonOneInNewTab(componentData), 10) ? '_blank' : '_self'}
              tag="a"
              title={getMobileButtonOneDescription(componentData)}
              href={getMobileButtonOneSrc(componentData)}
              color="green"
              className="btn-arrowed"
            >
              {getMobileButtonOneText(componentData)}
            </Button>
          </li>
        )}
      </MediaQuery>
    </ul>
  );
  return (
    <div className={classNames('ProductInformationTeaser', className)}>
      <Row>
        <Col className="col-sm-12 col-lg-6">
          {getImage(data)}
        </Col>
        <Col className="col-sm-12  col-lg-6 col-relative">
          {getPdfLinks(data)}
          {getButtonLinks(data)}
        </Col>
      </Row>
    </div>
  );
}

ProductInformationTeaser.propTypes = {
  className: PropTypes.string,
  data: PropTypes.objectOf(PropTypes.any),
};

ProductInformationTeaser.defaultProps = {
  className: '',
  data: {},
};

export default React.memo(ProductInformationTeaser);
