import React from 'react';
import { connect } from 'react-redux';
import AbstractPage from '../AbstractPage';
import { generateUniqId } from '../../utils/utils';
import DefaultListFilterable from '../../components/DefaultListFilterable';

export class ProductListPageComp extends AbstractPage {
  constructor(props) {
    super(props);
    this.uniqDefaultListId = generateUniqId();
  }

  render() {
    return (
      <div className="ProductListPage">
        {this.getHelmetData()}
        <DefaultListFilterable
          uniqDefaultListId={this.uniqDefaultListId}
          pageProps={this.props}
        />
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  responsiveMode: state.global.responsiveMode,
});
export default connect(mapStateToProps)(ProductListPageComp);
