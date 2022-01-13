import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { pathOr, path } from 'ramda';
import { Provider } from 'react-redux';
import Logger from '../../utils/logger';
import { store } from '../../main/configureStore';
import PushableDefault from '../PushManager/PushableDefault';

class HtmlText extends React.Component {
  constructor(props) {
    super(props);
    this.setRef = this.setRef.bind(this);
    this.pushableInstances = [];
  }

  shouldComponentUpdate(nextProps) {
    const newText = pathOr(false, ['data', 'text'])(nextProps);
    const currentText = pathOr(false, ['data', 'text'])(this.props);
    return newText !== currentText;
  }

  componentWillUnmount() {
    if (this.pushableInstances && this.pushableInstances.length) {
      this.pushableInstances.forEach((node) => {
        try {
          ReactDOM.unmountComponentAtNode(node);
        } catch (e) {
          Logger.warn('HtmlText::componentWillUnmount', e);
        }
      });
    }
  }

  setRef(node) {
    try {
      if (node && typeof node.querySelectorAll === 'function') {
        this.pushableInstances = node.querySelectorAll('[data-push]');
        this.mountPushableNodes(this.pushableInstances);
      }
    } catch (e) {
      Logger.debug('HtmlText::setRef', e);
    }
  }

  mountPushableNodes(pushableNodes) {
    if (pushableNodes && pushableNodes.length) {
      pushableNodes.forEach((node) => {
        try {
          const pushDataStr = path(['dataset', 'push'], node);
          if (pushDataStr) {
            const parsedPushData = JSON.parse(pushDataStr);
            if (typeof parsedPushData === 'object') {
              this.renderNewPushableComponent(node, parsedPushData);
            }
          }
        } catch (e) {
          Logger.warn('HtmlText::mountPushableNodes', e);
        }
      });
    }
  }

  // eslint-disable-next-line class-methods-use-this
  renderNewPushableComponent(node, parsedPushData) {
    try {
      ReactDOM.render(
        <Provider store={store}>
          <PushableDefault field={parsedPushData} />
        </Provider>,
        node,
      );
    } catch (e) {
      Logger.warn('HtmlText::renderNewPushableComponent', e);
    }
  }

  render() {
    const { data, className, tag } = this.props;
    const Tag = tag;
    return Tag && (
      // eslint-disable-next-line react/no-danger
      <Tag
        ref={this.setRef}
        className={classNames('HtmlText', className)}
        dangerouslySetInnerHTML={{ __html: data.text }}
      />
    );
  }
}

HtmlText.propTypes = {
  className: PropTypes.string,
  data: PropTypes.objectOf(PropTypes.any),
  tag: PropTypes.string,
};
HtmlText.defaultProps = {
  className: '',
  tag: 'div',
  data: {
    text: null,
  },
};

export default HtmlText;
