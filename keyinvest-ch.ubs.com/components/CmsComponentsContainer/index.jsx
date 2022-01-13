import React from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-cycle
import GenericCmsComponent from './GenericCmsComponent';

function CmsComponentsContainer(props) {
  const { components } = props;

  return components.map(
    (component) => (
      <GenericCmsComponent
        uniqId={component.url}
        key={component.url}
        template={component.template}
        data={component.data}
      />
    ),
  );
}

CmsComponentsContainer.propTypes = {
  components: PropTypes.arrayOf(PropTypes.any),
};
CmsComponentsContainer.defaultProps = {
  components: [],
};

export default React.memo(CmsComponentsContainer);
