import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import './LevelFiltersContainerWithFiles.scss';
import i18n from '../../../../../utils/i18n';
import { LevelFiltersContainerComponent } from '../../../../DefaultListFilterable/ProductFilters/LevelFiltersContainer';
import DownloadLink from '../../../../DownloadLink';
import FlyoutMenu from '../../../../ProductExpandableTile/FlyoutMenu';

export class LevelFiltersContainerWithFilesComponent extends LevelFiltersContainerComponent {
  render() {
    const {
      activeTab, level, data, files,
    } = this.props;
    const noFiltersAvailable = !data || Object.keys(data).length === 0;
    const ResourcesButton = (
      <DownloadLink className="toggle-flyout" type="upload" label={i18n.t('resources_and_help')} />
    );
    return !noFiltersAvailable && (
      <div className={classNames('LevelFiltersContainer LevelFiltersContainerWithFiles', level)}>
        {files && files.length > 0 && (
          <div className="files-flyout mb-2">
            <FlyoutMenu buttonComponent={ResourcesButton} className="text-right">
              <ul className="col text-left">
                {files.map((file) => (
                  <li key={file.name || file.link}>
                    <DownloadLink type={file.type} label={file.label} url={file.link} />
                  </li>
                ))}
              </ul>
            </FlyoutMenu>
          </div>
        )}
        <div className="row filters-wrapper pt-0">
          {activeTab && this.getFilterComponentsFromData()}
        </div>
      </div>
    );
  }
}
LevelFiltersContainerWithFilesComponent.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  dataSource: PropTypes.arrayOf(PropTypes.string).isRequired,
  activeTab: PropTypes.string,
  onUpdateFunc: PropTypes.func.isRequired,
  level: PropTypes.string.isRequired,
  isToggleable: PropTypes.bool,
  uniqDefaultListId: PropTypes.string.isRequired,
};
LevelFiltersContainerWithFilesComponent.defaultProps = {
  data: {},
  activeTab: null,
  isToggleable: false,
};
const LevelFiltersContainerWithFiles = connect()(LevelFiltersContainerWithFilesComponent);
export default LevelFiltersContainerWithFiles;
