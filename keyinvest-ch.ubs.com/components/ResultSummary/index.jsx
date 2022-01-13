import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Col, Row } from 'reactstrap';
import './ResultSummary.scss';
import ExportButton from '../ExportButton';

function ResultSummary({
  className,
  summaryText,
  triggerExportFunc,
  exportButtons,
}) {
  return (
    <div className={classNames('ResultSummary', className)}>
      <Row className="results-summary-row">
        <Col className="col results-count-col">{summaryText}</Col>
        {exportButtons && exportButtons.map((type, index) => (
          <ExportButton
            key={type}
            className={`col-auto ${index === 0 ? 'ml-auto' : ''}`}
            type={type}
            onClick={triggerExportFunc}
          />
        ))}
      </Row>
    </div>
  );
}

ResultSummary.propTypes = {
  className: PropTypes.string,
  summaryText: PropTypes.string,
  triggerExportFunc: PropTypes.func,
  exportButtons: PropTypes.arrayOf(PropTypes.string),
};

ResultSummary.defaultProps = {
  className: '',
  summaryText: '',
  triggerExportFunc: () => {},
  exportButtons: [],
};

export default React.memo(ResultSummary);
