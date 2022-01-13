import React from 'react';
import { path, pathOr } from 'ramda';
import { MarketInstrumentRowComponent } from '../../../MarketInstrumentTable/MarketInstrumentRow';
import PushableDefault from '../../../../PushManager/PushableDefault';
import { getProductLink } from '../../../../../utils/utils';
import HtmlText from '../../../../HtmlText';
import ProductNavLink from '../../../../ProductNavLink';

class DeriRiskTableRow extends MarketInstrumentRowComponent {
  getColumnsContentConfig() {
    const { instrument } = this.props;
    return {
      default: {
        ask: (<PushableDefault field={pathOr({}, ['ask', 'value'])(instrument)} />),
        bid: (<PushableDefault field={pathOr({}, ['bid', 'value'])(instrument)} />),
        managementFeePa: (<HtmlText data={{ text: pathOr('', ['managementFeePa', 'value'])(instrument) }} />),
        productType: pathOr('', ['productType', 'value'])(instrument),
        realPriceCurrency: pathOr('', ['realPriceCurrency', 'value'])(instrument),
        underlying: pathOr('', ['underlying', 'value'])(instrument),
        valor: pathOr('', ['valor', 'value'])(instrument),
      },
    };
  }

  getColumnContent(instrumentProperty) {
    const columnsContentConfig = this.getColumnsContentConfig();
    const { instrument } = this.props;
    return (
      <td key={instrumentProperty}>
        <ProductNavLink
          parentComponentName="Deri Risk Indicator"
          className="link-unstyled"
          to={getProductLink('isin', path(['isin', 'value'])(instrument))}
          isin={path(['isin', 'value'])(instrument)}
        >
          {columnsContentConfig.default[instrumentProperty]}
        </ProductNavLink>
      </td>
    );
  }

  getColumnsContent() {
    const { columns } = this.props;
    return columns.map(
      (instrumentProperty) => this.getColumnContent(instrumentProperty),
    );
  }

  getRowContent() {
    return (
      <>
        <tr>
          {this.getColumnsContent()}
        </tr>
      </>
    );
  }
}

export default DeriRiskTableRow;
