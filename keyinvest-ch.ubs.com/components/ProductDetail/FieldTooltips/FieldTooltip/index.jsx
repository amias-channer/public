import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { UncontrolledTooltip } from 'reactstrap';
import { generateUniqId } from '../../../../utils/utils';
import Icon from '../../../Icon';
import HtmlText from '../../../HtmlText';
import './FieldTooltip.scss';
import AsyncHistoryLightbox from '../../AsyncHistoryLightbox';

export const FIELD_TOOLTIP_TYPE = {
  INFO: 'info',
  INFO_WARNING: 'info-warning',
  DELAY: 'delay',
  KO_LEVEL_HISTORY: 'ko-level-history',
  QUESTION: 'question',
  BELL: 'bell',
};

export const FIELD_TOOLTIP_ICONS = {
  [FIELD_TOOLTIP_TYPE.INFO]: 'Information',
  [FIELD_TOOLTIP_TYPE.INFO_WARNING]: 'info-yellow',
  [FIELD_TOOLTIP_TYPE.DELAY]: 'min-delay',
  [FIELD_TOOLTIP_TYPE.KO_LEVEL_HISTORY]: 'event',
  [FIELD_TOOLTIP_TYPE.QUESTION]: 'question-circle',
  [FIELD_TOOLTIP_TYPE.BELL]: 'bell',
};

const FieldTooltip = ({
  uniqId,
  className,
  data,
  placement,
  trigger,
  delay,
  autohide,
}) => {
  const [showLightBox, setShowLightBox] = useState(false);
  if (data) {
    let content = null;

    const openLightBox = () => {
      setShowLightBox(true);
    };

    if (data.url) {
      content = (
        <AsyncHistoryLightbox
          type={data.type}
          dataUrl={data.url}
          isOpen={showLightBox}
          setIsOpen={setShowLightBox}
        />
      );
    } else if (data.value) {
      content = (
        <UncontrolledTooltip
          popperClassName={data.type}
          placement={placement}
          target={uniqId}
          trigger={trigger}
          delay={delay}
          autohide={autohide}
        >
          <HtmlText data={{ text: data.value }} />
        </UncontrolledTooltip>
      );
    }

    return (
      <div className={classNames('FieldTooltip', className, data.type, data.url ? 'clickable' : '')}>
        <Icon
          type={FIELD_TOOLTIP_ICONS[data.type] || FIELD_TOOLTIP_ICONS[FIELD_TOOLTIP_TYPE.INFO]}
          id={uniqId}
          onClick={data.url ? openLightBox : undefined}
        />
        {content}
      </div>
    );
  }
  return null;
};

FieldTooltip.propTypes = {
  className: PropTypes.string,
  uniqId: PropTypes.string,
  data: PropTypes.objectOf(PropTypes.any).isRequired,
  placement: PropTypes.string,
  trigger: PropTypes.string,
  delay: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  autohide: PropTypes.bool,
};

FieldTooltip.defaultProps = {
  className: '',
  uniqId: generateUniqId(),
  placement: 'auto',
  trigger: 'hover',
  delay: { show: 50, hide: 200 },
  autohide: false,
};

export default React.memo(FieldTooltip);
