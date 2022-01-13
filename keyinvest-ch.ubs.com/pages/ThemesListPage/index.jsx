import React from 'react';
import { connect } from 'react-redux';
import AbstractPage from '../AbstractPage';
import { generateUniqId } from '../../utils/utils';
import ThemesListFilterable from '../../components/ThemesListFilterable';

export class ThemesListPageComp extends AbstractPage {
  constructor(props) {
    super(props);
    this.uniqDefaultListId = generateUniqId();
  }

  render() {
    const { responsiveMode } = this.props;
    return (
      <div className="ThemesListPage">
        {this.getHelmetData()}
        <ThemesListFilterable
          uniqDefaultListId={this.uniqDefaultListId}
          pageProps={this.props}
          responsiveMode={responsiveMode}
        />
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  responsiveMode: state.global.responsiveMode,
});
export default connect(mapStateToProps)(ThemesListPageComp);
