import React from 'react';
import { connect } from 'react-redux';
import AbstractPage from '../AbstractPage';
import { generateUniqId } from '../../utils/utils';
import ProductYieldMonitorFilterable from '../../components/ProductYieldMonitorFilterable';
import NoteText from '../../components/NoteText';
import i18n from '../../utils/i18n';

export class ProductYieldMonitorPageComp extends AbstractPage {
  constructor(props) {
    super(props);
    this.uniqDefaultListId = generateUniqId();
  }

  render() {
    return (
      <div className="ProductListPage ProductYieldMonitorPage">
        {this.getHelmetData()}
        <ProductYieldMonitorFilterable
          uniqDefaultListId={this.uniqDefaultListId}
          pageProps={this.props}
        />
        <NoteText text={i18n.t('early_redemption_description')} />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  responsiveMode: state.global.responsiveMode,
});
export default connect(mapStateToProps)(ProductYieldMonitorPageComp);
