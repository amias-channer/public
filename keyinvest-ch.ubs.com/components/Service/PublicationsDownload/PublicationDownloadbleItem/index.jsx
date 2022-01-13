import React from 'react';
import { Col, Row } from 'reactstrap';
import PropTypes from 'prop-types';
import {
  getIsPublicationOrderable,
  getPublicationName,
  getPublicationThumbnail,
  getPublicationType,
  getPublicationUrl,
} from './PublicationDownloadableItem.helper';
import Checkbox from '../../../CheckboxInput';
import HttpService from '../../../../utils/httpService';
import Image from '../../../Image';
import { dispatchAnalyticsDocDownloadTrack } from '../../../../analytics/Analytics.helper';
import { getFileNameFromUrl } from '../../../../utils/utils';

function PublicationDownloadableItem(props) {
  const {
    data, id, onCheckboxChange, isChecked,
  } = props;
  const onCheckboxChanged = () => {
    onCheckboxChange(id);
  };

  const publicationName = getPublicationName(data);
  const publicationUrl = getPublicationUrl(data);

  const onDownloadClick = () => dispatchAnalyticsDocDownloadTrack(
    publicationName, getFileNameFromUrl(publicationUrl),
  );

  return (
    <div className="PublicationDownloadableItem">
      <Row>
        <Col className="col-sm-5 col-md-3 col-lg-4">
          <Image
            source={HttpService.generateUrl(getPublicationThumbnail(data))}
            altText={publicationName}
          />
        </Col>
        <Col className="col-sm-7 col-md-9 col-lg-8">
          <h3>{publicationName}</h3>
          <a
            href={publicationUrl}
            rel="noopener noreferrer"
            target="_blank"
            onClick={onDownloadClick}
          >
            <span className="icon-pdf">
              <span className="path1" />
              <span className="path2" />
            </span>
            {`Download ${getPublicationType(data)}`}
          </a>
          {getIsPublicationOrderable(data) && (
            <div className="order-checkbox">
              <Checkbox value={id} name={publicationName} label="Bestellen" onChange={onCheckboxChanged} checked={isChecked} />
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
}

PublicationDownloadableItem.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  id: PropTypes.string,
  onCheckboxChange: PropTypes.func,
  isChecked: PropTypes.bool,
};

PublicationDownloadableItem.defaultProps = {
  data: {},
  id: '',
  onCheckboxChange: () => {},
  isChecked: false,
};

export default React.memo(PublicationDownloadableItem);
