import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { pathOr } from 'ramda';
import { checkComponentRenderStatus } from '../../../utils/responsive';
// eslint-disable-next-line import/no-cycle
import { getComponentByTemplate } from '../../componentsConfig';

export class GenericCmsComponentCmp extends React.PureComponent {
  render() {
    const {
      template, data, shouldRender, uniqId,
    } = this.props;
    const ComponentTagName = getComponentByTemplate(template);
    if (!ComponentTagName) {
      return (
        <span style={{ color: 'red' }}>
          {`The component "${template}" is not yet implemented!`}
        </span>
      );
    }

    return shouldRender && <ComponentTagName className="CmsComponent" data={data} uniqId={uniqId} />;
  }
}

GenericCmsComponentCmp.propTypes = {
  template: PropTypes.string,
  data: PropTypes.oneOfType([
    PropTypes.objectOf(PropTypes.any),
    PropTypes.arrayOf(PropTypes.any),
  ]),
  shouldRender: PropTypes.bool,
  uniqId: PropTypes.string.isRequired,
};
GenericCmsComponentCmp.defaultProps = {
  template: 'row',
  data: {},
  shouldRender: true,
};

const EMPTY_OBJ = {};
const mapStateToProps = (state, ownProps) => ({
  shouldRender: checkComponentRenderStatus(
    pathOr(EMPTY_OBJ, ['data', 'visibility'])(ownProps), state.global.responsiveMode,
  ),
});

const GenericCmsComponent = connect(mapStateToProps)(GenericCmsComponentCmp);
export default GenericCmsComponent;
