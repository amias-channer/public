import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './ThemesListTable.scss';
import classNames from 'classnames';
import produce from 'immer';
import MediaQuery from 'react-responsive';
import i18n from '../../../utils/i18n';
import { ProductInstrumentTableComponent } from '../../DefaultListFilterable/ProductInstrumentTable';
import {
  CURRENCY,
  PERFORMANCE_1_MTH_PERCENT,
  PERFORMANCE_Y_TD_PERCENT,
  getTableCounts,
  getThemeChartPng,
  getThemeId,
  getThemes,
  getThemesSort,
  PERFORMANCE_SINCE_ISSUE_PERCENT,
  DEVELOPMENT_SINCE_ISSUE,
  getFieldValueFromThemeRow,
} from '../ThemesListFiltrable.helper';
import HtmlText from '../../HtmlText';
import {
  DESKTOP_MODE, MOBILE_MODE, NOTEBOOK_MODE, TABLET_MODE,
} from '../../../utils/responsive';
import {
  inverseSortDirection,
  SORT_ASC_NUM,
  SORT_DESC_NUM,
} from '../../../utils/utils';
import HttpService from '../../../utils/httpService';
import Logger from '../../../utils/logger';
import ThemeRow from './ThemeRow';
import mediaQueries from '../../../utils/mediaQueries';
import ThemeColumn from './ThemeColumn';

export class ThemesListTableComponent extends ProductInstrumentTableComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeTheme: null,
    };
    this.toggleTheme = this.toggleTheme.bind(this);
    this.triggerColumnSort = this.triggerColumnSort.bind(this);
  }

  toggleTheme(id) {
    const { activeTheme } = this.state;
    if (activeTheme === id) {
      this.setState(produce(() => ({
        activeTheme: null,
      })));
    } else {
      this.setState(produce(() => ({
        activeTheme: id,
      })));
    }
  }

  static getFieldValueToRenderFromThemeRows(theme, fieldName) {
    if (theme && theme.rows && theme.rows.length) {
      return theme.rows.map((row) => {
        const value = getFieldValueFromThemeRow(fieldName, row);
        return (
          <HtmlText
            className="value"
            key={value}
            data={{ text: value }}
          />
        );
      });
    }
    return null;
  }

  static getColumnsConfig(data = {}, theme = {}) {
    return {
      title: {
        label: getTableCounts(data),
        sortable: false,
        value: (
          <div className="row title">
            <div className="col-auto col-md-auto align-self-center image-container">
              {theme.image && (
                <div
                  className="avatar rounded-circle"
                  style={{ backgroundImage: `url(${HttpService.generateUrl(theme.image)})` }}
                />
              )}
            </div>
            <div className="col col-md align-self-center text-container">
              <HtmlText data={{ text: theme.title }} />
            </div>
          </div>
        ),
      },
      [CURRENCY]: {
        label: i18n.t(CURRENCY),
        sortable: true,
        [MOBILE_MODE]: false,
        [TABLET_MODE]: false,
        value: ThemesListTableComponent.getFieldValueToRenderFromThemeRows(
          theme, CURRENCY,
        ),
      },
      [PERFORMANCE_1_MTH_PERCENT]: {
        label: i18n.t(PERFORMANCE_1_MTH_PERCENT),
        sortable: true,
        [MOBILE_MODE]: false,
        [TABLET_MODE]: false,
        value: ThemesListTableComponent.getFieldValueToRenderFromThemeRows(
          theme, PERFORMANCE_1_MTH_PERCENT,
        ),
      },
      [PERFORMANCE_Y_TD_PERCENT]: {
        label: i18n.t(PERFORMANCE_Y_TD_PERCENT),
        sortable: true,
        [MOBILE_MODE]: false,
        [TABLET_MODE]: false,
        value: ThemesListTableComponent.getFieldValueToRenderFromThemeRows(
          theme, PERFORMANCE_Y_TD_PERCENT,
        ),
      },
      [PERFORMANCE_SINCE_ISSUE_PERCENT]: {
        label: i18n.t(PERFORMANCE_SINCE_ISSUE_PERCENT),
        sortable: true,
        [MOBILE_MODE]: false,
        [TABLET_MODE]: false,
        value: ThemesListTableComponent.getFieldValueToRenderFromThemeRows(
          theme, PERFORMANCE_SINCE_ISSUE_PERCENT,
        ),
      },
      [DEVELOPMENT_SINCE_ISSUE]: {
        label: i18n.t(DEVELOPMENT_SINCE_ISSUE),
        [MOBILE_MODE]: false,
        sortable: false,
        value: getThemeChartPng(theme) ? (
          <img
            className="chart-image"
            src={HttpService.generateUrl(getThemeChartPng(theme))}
            alt=""
          />
        ) : null,
      },
    };
  }

  getTableRow(theme) {
    const { responsiveMode, data } = this.props;
    return (
      <ThemeRow
        key={getThemeId(theme)}
        isOpen={this.state.activeTheme === getThemeId(theme)}
        id={getThemeId(theme)}
        toggleTheme={this.toggleTheme}
        theme={theme}
        responsiveMode={responsiveMode}
        columnsConfig={ThemesListTableComponent.getColumnsConfig(data, theme)}
      />
    );
  }

  getTableRows() {
    const { data } = this.props;
    return getThemes(data)
      .map((theme) => this.getTableRow(theme));
  }

  getTableColumns() {
    const { responsiveMode, data } = this.props;
    const columnsConfig = ThemesListTableComponent.getColumnsConfig(data);
    return (
      <tr>
        {Object.keys(columnsConfig)
          .map((col) => {
            if (columnsConfig[col][responsiveMode] === false) {
              return null;
            }
            return (
              <th key={col}>
                {this.getTableColumn(col)}
              </th>
            );
          })}
      </tr>
    );
  }

  triggerColumnSort(column) {
    const { onUpdateFunc, data } = this.props;
    const columnsConfig = ThemesListTableComponent.getColumnsConfig(data);
    let direction = SORT_ASC_NUM;

    if (!onUpdateFunc || typeof onUpdateFunc !== 'function') {
      return;
    }

    try {
      const sort = getThemesSort(data);
      if (!sort || !columnsConfig[column] || !columnsConfig[column].sortable) {
        return;
      }
      if (sort[column]) {
        direction = inverseSortDirection(sort[column], SORT_ASC_NUM, SORT_DESC_NUM);
      }
    } catch (e) {
      Logger.warn('THEMES_LIST_TABLE::triggerColumnSort()', e);
    }
    try {
      onUpdateFunc('sort', `{"${column}":${typeof direction === 'string' ? `"${direction}"` : direction}}`);
    } catch (e) {
      Logger.warn('THEMES_LIST_TABLE::triggerColumnSort()', e);
    }
  }

  getTableColumn(column) {
    const { data } = this.props;
    const columnsConfig = ThemesListTableComponent.getColumnsConfig(data);
    let sortIcon = null;
    const sort = getThemesSort(data);
    if (sort && columnsConfig[column].sortable) {
      if (sort[column]) {
        sortIcon = (
          <i
            className={classNames(
              'sort-icon',
              sort[column] === SORT_DESC_NUM ? 'icon-triangle-down' : 'icon-triangle-up',
            )}
          />
        );
      }
    }
    return (
      <ThemeColumn
        className={`${column} ${columnsConfig[column].sortable ? 'sortable' : ''} ${sortIcon ? 'sorted' : ''}`}
        onColumnClick={this.triggerColumnSort}
        column={column}
        sortIcon={sortIcon}
        label={columnsConfig[column].label}
      />
    );
  }

  render() {
    const { data, responsiveMode, className } = this.props;
    const themes = getThemes(data);
    return (
      <div className={classNames('ProductInstrumentTable', 'ThemesListTable', className)}>
        {themes.length > 0 && (
          <>
            <MediaQuery query={mediaQueries.mobileTabletOnly}>
              <HtmlText className="count-title-mobile" data={{ text: getTableCounts(data) }} />
            </MediaQuery>
            <table className="table table-default rows-hover-effect">
              {(responsiveMode === NOTEBOOK_MODE || responsiveMode === DESKTOP_MODE) && (
                <thead>
                  {this.getTableColumns()}
                </thead>
              )}
              <tbody>
                {this.getTableRows()}
              </tbody>
            </table>
          </>
        )}
      </div>
    );
  }
}

ThemesListTableComponent.propTypes = {
  groupName: PropTypes.string,
  className: PropTypes.string,
  data: PropTypes.objectOf(PropTypes.any),
  onUpdateFunc: PropTypes.func.isRequired,
  responsiveMode: PropTypes.string,
};
ThemesListTableComponent.defaultProps = {
  groupName: '',
  className: '',
  responsiveMode: DESKTOP_MODE,
  data: {},
};

const mapStateToProps = (state) => ({
  responsiveMode: state.global.responsiveMode,
});

const ThemesListTable = connect(mapStateToProps)(ThemesListTableComponent);
export default ThemesListTable;
