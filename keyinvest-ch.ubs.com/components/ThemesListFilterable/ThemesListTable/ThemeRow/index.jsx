import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button } from 'reactstrap';
import './ThemeRow.scss';
import MediaQuery from 'react-responsive';
import {
  DEVELOPMENT_SINCE_ISSUE,
  getThemeChartUrl,
  getThemeDescription,
  getThemeDetailsColumns,
  getThemeDetailsPageUrl,
  getThemeDetailsTableData,
  getThemeDocuments,
  getThemeImage,
  getThemeTitle,
  shouldDisplayDetailsPageButton,
} from '../../ThemesListFiltrable.helper';
import HtmlText from '../../../HtmlText';
import AsyncChart from '../../../Chart/AsyncChart';
import { MOBILE_MODE } from '../../../../utils/responsive';
import ChartUnderlyingDisclaimer from '../../../Chart/ChartUnderlyingDisclaimer';
import DownloadLink from '../../../DownloadLink';
import ThemeDetailsTable from '../ThemeDetailsTable';
import i18n from '../../../../utils/i18n';
import mediaQueries from '../../../../utils/mediaQueries';
import ThemeDetailsTableMobile from '../ThemeDetailsTableMobile';
import {
  dispatchAnalyticsClickTrack,
  NETCENTRIC_CTA_TYPE_IMAGE_LINK,
  NETCENTRIC_CTA_TYPE_PRIMARY_BUTTON,
} from '../../../../analytics/Analytics.helper';
import { TIMESPAN_MAX } from '../../../Chart/Chart.helper';
import { adformTrackEventClick } from '../../../../adformTracking/AdformTracking.helper';

const ThemeRowComponent = ({
  isOpen,
  toggleTheme,
  theme,
  responsiveMode,
  className,
  columnsConfig,
  id,
}) => {
  const onClickToDetailsButton = (e) => {
    adformTrackEventClick(
      e,
      'details-page-click',
    );
    dispatchAnalyticsClickTrack(
      i18n.t('to_theme_page'),
      getThemeDetailsPageUrl(theme),
      NETCENTRIC_CTA_TYPE_PRIMARY_BUTTON,
      'Theme Row',
    );
  };
  const triggerToggleTheme = () => {
    toggleTheme(id);

    dispatchAnalyticsClickTrack(
      getThemeTitle(theme),
      getThemeImage(theme),
      NETCENTRIC_CTA_TYPE_IMAGE_LINK,
      'Theme Row',
    );
  };
  const getColumnsCompactContent = () => {
    const columnsKeys = Object.keys(columnsConfig);
    return columnsKeys.map((col) => {
      if (columnsConfig[col][responsiveMode] === false) {
        return null;
      }
      return (
        <td key={col}>
          <div>
            {columnsConfig[col].value}
          </div>
        </td>
      );
    });
  };

  const getColumnsExpandedContent = () => {
    const columnsKeys = Object.keys(columnsConfig);
    return columnsKeys.map((col) => {
      if (col === DEVELOPMENT_SINCE_ISSUE) {
        return null;
      }
      if (col === 'title') {
        return (
          <div className={classNames('col col-md-12 col-lg-5', 'title-container')} key={col}>
            <div className="row">
              <div className="col">
                {columnsConfig[col].value}
              </div>
            </div>
          </div>
        );
      }

      return (
        <MediaQuery query={mediaQueries.tablet} key={col}>
          <div className={classNames('col col-md-3 field col-lg', col)}>
            <div className="field-name">
              {columnsConfig[col].label}
            </div>
            <div className="field-value">
              {columnsConfig[col].value}
            </div>
          </div>
        </MediaQuery>
      );
    });
  };

  if (isOpen) {
    return (
      <tr className={classNames('ThemeRow', 'details-expanded', className)}>
        <td colSpan={Object.keys(columnsConfig).length}>
          <div className="row close-container">
            <div className="col text-right">
              <Button className="close-button" color="outline" onClick={triggerToggleTheme}>
                <i className="icon-close-bold" />
              </Button>
            </div>
          </div>
          <div className="row title-fields-container">
            {getColumnsExpandedContent()}
          </div>
          <div className="row">
            <div className="col-12 col-xl-5 description-docs">
              <HtmlText className="description" data={{ text: getThemeDescription(theme) }} />
              <div className="documents">
                {getThemeDocuments(theme).map((file) => (
                  <DownloadLink
                    key={file.label}
                    url={file.link}
                    label={file.label}
                    contentType={file.type}
                  />
                ))}
              </div>
            </div>
            {responsiveMode !== MOBILE_MODE && (
              <div className="col-12 col-xl-7 chart-interactive-container">
                <AsyncChart
                  uniqKey={getThemeChartUrl(theme)}
                  url={getThemeChartUrl(theme)}
                  options={{
                    showTimespans: true,
                    showTooltip: true,
                  }}
                  timespan={TIMESPAN_MAX}
                />
                <ChartUnderlyingDisclaimer className="theme-chart-underlying-disclaimer" />
              </div>
            )}
          </div>
          <MediaQuery query={mediaQueries.mobileTabletOnly}>
            <ThemeDetailsTableMobile className="row" data={getThemeDetailsTableData(theme)} />
          </MediaQuery>
          <MediaQuery query={mediaQueries.notebook}>
            <div className="row">
              <ThemeDetailsTable className="col" data={getThemeDetailsTableData(theme)} columns={getThemeDetailsColumns(theme)} />
            </div>
          </MediaQuery>
          <div className="row">
            <div className="col">
              {shouldDisplayDetailsPageButton(theme) && (
              <Button
                tag="a"
                rel="noopener noreferrer"
                target="_blank"
                color="green"
                href={getThemeDetailsPageUrl(theme)}
                className="btn-arrowed to-details-button"
                onClick={onClickToDetailsButton}
              >
                {i18n.t('to_theme_page')}
              </Button>
              )}
            </div>
          </div>
        </td>
      </tr>
    );
  }
  return (
    <tr className={classNames('ThemeRow', className)} onClick={triggerToggleTheme} key={id}>
      {getColumnsCompactContent()}
    </tr>
  );
};
ThemeRowComponent.propTypes = {
  isOpen: PropTypes.bool,
  toggleTheme: PropTypes.func.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  theme: PropTypes.objectOf(PropTypes.any).isRequired,
  responsiveMode: PropTypes.string.isRequired,
  className: PropTypes.string,
  columnsConfig: PropTypes.objectOf(PropTypes.any).isRequired,
};
ThemeRowComponent.defaultProps = {
  isOpen: false,
  className: '',
};

const ThemeRow = React.memo(ThemeRowComponent);
export default ThemeRow;
