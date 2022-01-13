import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Tooltip } from 'reactstrap';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import i18n from '../../utils/i18n';
import { generateUniqId } from '../../utils/utils';
import {
  dispatchAnalyticsProductTrack,
  NETCENTRIC_PRODUCT_COPY_BUTTON,
  NETCENTRIC_PRODUCT_COPY_CTRL_C,
} from '../../analytics/Analytics.helper';
import CopyableText from '../CopyableText';

class CopyableISIN extends CopyableText {
  onCopiedByClick() {
    const { text, onCopy } = this.props;
    this.setCopied(true);
    dispatchAnalyticsProductTrack(text, NETCENTRIC_PRODUCT_COPY_BUTTON);
    onCopy();
  }

  onCopiedByKeyboard() {
    const { text, onCopy } = this.props;
    dispatchAnalyticsProductTrack(text, NETCENTRIC_PRODUCT_COPY_CTRL_C);
    onCopy();
  }

  render() {
    const {
      text, className, showTooltip, uniqId,
    } = this.props;
    const { tooltipOpen, copied } = this.state;

    return (
      <>
        {showTooltip && (
          <Tooltip
            placement="right"
            isOpen={tooltipOpen}
            target={text + uniqId}
            toggle={this.toggle}
            trigger="hover click"
            delay={{ show: 20, hide: 400 }}
            popperClassName="info"
          >
            {copied ? i18n.t('copied') : i18n.t('click to copy')}
          </Tooltip>
        )}
        <CopyToClipboard text={text} onCopy={this.onCopiedByClick}>
          <div
            tabIndex="-1"
            role="button"
            className={classNames('CopyableText CopyableISIN', className)}
            id={text + uniqId}
            onKeyDown={this.handleKeyDown}
          >
            {text}
          </div>
        </CopyToClipboard>
      </>
    );
  }
}

CopyableISIN.propTypes = {
  text: PropTypes.string.isRequired,
  className: PropTypes.string,
  uniqId: PropTypes.string,
  showTooltip: PropTypes.bool,
  onCopy: PropTypes.func,
};
CopyableISIN.defaultProps = {
  onCopy: () => {},
  className: '',
  showTooltip: true,
  uniqId: generateUniqId(),
};

export default CopyableISIN;
