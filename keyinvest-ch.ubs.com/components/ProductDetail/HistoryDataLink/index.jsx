import React from 'react';
import PropTypes from 'prop-types';
import './HistoryDataLink.scss';
import { Col, Row } from 'reactstrap';
import Icon from '../../Icon';

const HistoryDataLink = ({ data }) => data.showLink && (
  <div className="HistoryDataLink">
    <h2 className="title">{data.title}</h2>
    <Row className="field">
      <Col className="content">
        <Icon type="csv" />
        <a
          className="history-csv-link"
          target="_blank"
          rel="noopener noreferrer"
          href={data.link}
        >
          {data.label}
        </a>
      </Col>
    </Row>
  </div>
);

HistoryDataLink.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
};

HistoryDataLink.defaultProps = {
  data: {
    showLink: false,
    title: '',
    label: '',
    link: '',
  },
};

export default React.memo(HistoryDataLink);
