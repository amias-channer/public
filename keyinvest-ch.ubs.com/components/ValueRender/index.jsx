import React from 'react';
import PropTypes from 'prop-types';
import { path, pathOr } from 'ramda';
import HtmlText from '../HtmlText';
import PushableChangeAbsolute from '../PushManager/PushableChangeAbsolute';
import PushableChangePercent from '../PushManager/PushableChangePercent';
import PushableDefault from '../PushManager/PushableDefault';
import PushablePercentWithBar from '../PushManager/PushablePercentWithBar';
import PushableSize from '../PushManager/PushableSize';
import PushableTimestamp from '../PushManager/PushableTimestamp';
import ColoredValue from '../ColoredValue';

const componentsMapping = {
  'html-text': HtmlText,
  'colored-value': ColoredValue,
  'pushable-change-absolute': PushableChangeAbsolute,
  'pushable-change-percent': PushableChangePercent,
  'pushable-default': PushableDefault,
  'pushable-percent-with-bar': PushablePercentWithBar,
  'pushable-size': PushableSize,
  'pushable-timestamp': PushableTimestamp,
};

const getComponentByTemplate = (template) => componentsMapping[template];

const ValueRender = (props) => {
  const HTML_TEXT = 'html-text';
  const PUSHABLE_DEFAULT = 'pushable-default';
  const { field, className, extraProps } = props;
  let renderAs = path(['renderAs'])(field);
  const value = pathOr('', ['value'])(field);

  if (!renderAs) {
    if (typeof value === 'object') {
      renderAs = PUSHABLE_DEFAULT;
    } else {
      renderAs = HTML_TEXT;
    }
  }

  if (renderAs === HTML_TEXT) {
    return <HtmlText className={className} tag="span" data={{ text: value }} />;
  }

  const Component = getComponentByTemplate(renderAs) || HTML_TEXT;
  // eslint-disable-next-line react/jsx-props-no-spreading
  return Component && <Component className={className} field={value} {...extraProps} />;
};

ValueRender.propTypes = {
  field: PropTypes.objectOf(PropTypes.any),
  className: PropTypes.string,
  extraProps: PropTypes.objectOf(PropTypes.any),
};

ValueRender.defaultProps = {
  field: {},
  className: '',
  extraProps: {},
};

export default React.memo(ValueRender);
