import React from 'react';
import produce from 'immer';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Tooltip } from 'reactstrap';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import i18n from '../../utils/i18n';
import Logger from '../../utils/logger';
import './CopyableText.scss';
import { generateUniqId } from '../../utils/utils';

class CopyableText extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tooltipOpen: false,
      copied: false,
    };
    this.onCopiedByClick = this.onCopiedByClick.bind(this);
    this.onCopiedByKeyboard = this.onCopiedByKeyboard.bind(this);
    this.setTooltipOpen = this.setTooltipOpen.bind(this);
    this.setCopied = this.setCopied.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  onCopiedByClick() {
    const { onCopy } = this.props;
    this.setCopied(true);
    onCopy();
  }

  onCopiedByKeyboard() {
    const { onCopy } = this.props;
    onCopy();
  }

  setTooltipOpen(value) {
    this.setState(produce((draft) => {
      draft.tooltipOpen = value;
    }));
  }

  setCopied(value) {
    this.setState(produce((draft) => {
      draft.copied = value;
    }));
  }

  toggle() {
    const { tooltipOpen } = this.state;
    this.setTooltipOpen(!tooltipOpen);
    if (!tooltipOpen) {
      this.setCopied(false);
    }
  }

  // eslint-disable-next-line react/sort-comp
  handleKeyDown(e) {
    const charCode = String.fromCharCode(e.which)
      .toLowerCase();
    if (e.ctrlKey && charCode === 'c') {
      Logger.debug('Ctrl + C pressed');
      this.onCopiedByKeyboard();
    }

    // For MAC we can use metaKey to detect cmd key
    if (e.metaKey && charCode === 'c') {
      Logger.debug('Cmd + C pressed');
      this.onCopiedByKeyboard();
    }
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
            target={`CopyableText-${uniqId}`}
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
            className={classNames('CopyableText', className)}
            id={`CopyableText-${uniqId}`}
            onKeyDown={this.handleKeyDown}
          >
            {text}
          </div>
        </CopyToClipboard>
      </>
    );
  }
}

CopyableText.propTypes = {
  text: PropTypes.oneOfType([
    PropTypes.string, PropTypes.number,
  ]).isRequired,
  className: PropTypes.string,
  uniqId: PropTypes.string,
  showTooltip: PropTypes.bool,
  onCopy: PropTypes.func,
};
CopyableText.defaultProps = {
  onCopy: () => {},
  className: '',
  showTooltip: true,
  uniqId: generateUniqId(),
};

export default CopyableText;
