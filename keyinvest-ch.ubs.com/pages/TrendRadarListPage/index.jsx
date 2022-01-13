import React from 'react';
import { connect } from 'react-redux';
import AbstractPage from '../AbstractPage';
import { generateUniqId } from '../../utils/utils';
import TrendRadarListFilterable from '../../components/TrendRadar/TrendRadarListFilterable';

export class TrendRadarListPageComp extends AbstractPage {
  constructor(props) {
    super(props);
    this.uniqDefaultListId = generateUniqId();
  }

  render() {
    const { responsiveMode } = this.props;
    return (
      <div className="TrendRadarListPage">
        {this.getHelmetData()}
        <TrendRadarListFilterable
          uniqDefaultListId={this.uniqDefaultListId}
          pageProps={this.props}
          responsiveMode={responsiveMode}
          independentFilters
        />
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  responsiveMode: state.global.responsiveMode,
});
export default connect(mapStateToProps)(TrendRadarListPageComp);
