import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Pagination from 'rc-pagination';
import './DefaultListPaginator.scss';
import i18n from '../../utils/i18n';
import CustomSelectItemsCountDropdown from './CustomSelectItemsCountDropdown';
import { isOfTypeFunction } from '../../utils/utils';
import { getPageSizeOptions } from './DefaultListPaginator.helper';

export class DefaultListPaginatorComponent extends React.PureComponent {
  constructor(props) {
    super(props);
    this.locale = {
      // Options.jsx
      items_per_page: i18n.t('items_per_page'),
      jump_to: i18n.t('jump_to'),
      jump_to_confirm: i18n.t('jump_to_confirm'),
      page: 'page',

      // Pagination.jsx
      prev_page: i18n.t('prev_page'),
      next_page: i18n.t('next_page'),
      prev_5: i18n.t('prev_5'),
      next_5: i18n.t('next_5'),
      prev_3: i18n.t('prev_3'),
      next_3: i18n.t('next_3'),
    };
    this.onChange = this.onChange.bind(this);
  }

  onChange(page, rowsPerPage) {
    const { onUpdateFunc, hideRowsPerPageSelector } = this.props;
    if (!isOfTypeFunction(onUpdateFunc)) {
      return;
    }

    if (!hideRowsPerPageSelector) {
      onUpdateFunc('rowsPerPage', rowsPerPage);
    }
    onUpdateFunc('page', page);
  }

  render() {
    const { data, hideRowsPerPageSelector } = this.props;
    const pageSizeOptions = getPageSizeOptions(data);
    return data && (
    <div className="ProductInstrumentTablePagingComponent">
      <Pagination
        selectComponentClass={hideRowsPerPageSelector ? null : CustomSelectItemsCountDropdown}
        prefixCls="table-pagination"
        showSizeChanger
        onChange={this.onChange}
        pageSize={data.rowsPerPage || 20}
        onShowSizeChange={this.onChange}
        defaultCurrent={data.activePageNumber || 1}
        total={data.pagesCount && data.rowsPerPage ? data.pagesCount * data.rowsPerPage : null}
        locale={this.locale}
        pageSizeOptions={pageSizeOptions}
      />
    </div>
    );
  }
}
DefaultListPaginatorComponent.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
  hideRowsPerPageSelector: PropTypes.bool,
  onUpdateFunc: PropTypes.func.isRequired,
};
DefaultListPaginatorComponent.defaultProps = {
  hideRowsPerPageSelector: false,
};
const DefaultListPaginator = connect()(DefaultListPaginatorComponent);
export default DefaultListPaginator;
