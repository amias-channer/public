import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { ButtonToggle } from 'reactstrap';
import './ChartToggle.scss';
import ColoredShape from '../../ColoredShape';
import HtmlText from '../../HtmlText';
import { CHART_TYPE_PRODUCT } from '../../../pages/ProductDetailPage/ProductChart.helper';

class ChartToggle extends PureComponent {
  constructor(props) {
    super(props);
    this.onChangeHandler = this.onChangeHandler.bind(this);
  }

  onChangeHandler() {
    const {
      sin, onClick, chartType, status,
    } = this.props;
    if (typeof onClick === 'function') {
      onClick(sin, chartType, status);
    }
  }

  render() {
    const {
      sin, color, name, status,
    } = this.props;
    return (
      <div className="ChartToggle">
        <div key={sin}>
          <ButtonToggle
            color="chart-toggle"
            defaultValue={status}
            active={status}
            onClick={this.onChangeHandler}
          >
            <ColoredShape color={color} width="13px" height="13px" />
            <HtmlText tag="span" data={{ text: name }} />
          </ButtonToggle>
        </div>
      </div>
    );
  }
}

ChartToggle.propTypes = {
  color: PropTypes.string,
  name: PropTypes.string,
  sin: PropTypes.oneOfType([
    PropTypes.string, PropTypes.number,
  ]),
  onClick: PropTypes.func,
  status: PropTypes.bool,
  chartType: PropTypes.string,
};

ChartToggle.defaultProps = {
  color: '',
  name: '',
  sin: null,
  status: true,
  onClick: null,
  chartType: CHART_TYPE_PRODUCT,
};

export default ChartToggle;
