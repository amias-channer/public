import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './ProductTablesBlock.scss';
import { DOCUMENTS_SECTION_KEY } from '../../../pages/ProductDetailPage/ProductDetailPage.helper';
import DocumentsTable from '../DocumentsTable';
import KeyValueTable from '../../KeyValueTable';

const ProductTablesBlockCmp = ({
  className, sections, isin,
}) => (
  <div className={classNames('ProductTablesBlock', className)}>
    {sections && Object.keys(sections).map((sectionKey) => {
      if (sectionKey === DOCUMENTS_SECTION_KEY) {
        return (
          <DocumentsTable
            key={sectionKey}
            fields={sections[sectionKey]}
            isin={isin}
          />
        );
      }
      return (
        <KeyValueTable
          key={sectionKey}
          fields={sections[sectionKey]}
        />
      );
    })}
  </div>
);
ProductTablesBlockCmp.propTypes = {
  className: PropTypes.string,
  sections: PropTypes.objectOf(PropTypes.any),
  isin: PropTypes.string,
};
ProductTablesBlockCmp.defaultProps = {
  className: '',
  sections: {},
  isin: '',
};

const ProductTablesBlock = React.memo(ProductTablesBlockCmp);
export default ProductTablesBlock;
