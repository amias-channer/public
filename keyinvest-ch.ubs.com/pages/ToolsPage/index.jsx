import React from 'react';
import { connect } from 'react-redux';
import AbstractPage from '../AbstractPage';
import { mapPageStateNameToComponent } from '../../utils/utils';
import { STATE_NAME_TOOLS_KNOCK_OUT_MAP } from '../../main/constants';
import KnockoutMap from '../../components/Tools/KnockoutMap';

const toolsSubStateToComponent = {
  [STATE_NAME_TOOLS_KNOCK_OUT_MAP]: KnockoutMap,
};
export class ToolsPageComponent extends AbstractPage {
  render() {
    const { stateName, location } = this.props;
    const ToolsSubComponent = mapPageStateNameToComponent(stateName, toolsSubStateToComponent);
    return (
      <div className="ToolsPage">
        {this.getHelmetData()}
        {ToolsSubComponent && (<ToolsSubComponent stateName={stateName} location={location} />)}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  responsiveMode: state.global.responsiveMode,
});
const ToolsPage = connect(mapStateToProps)(ToolsPageComponent);
export default ToolsPage;
