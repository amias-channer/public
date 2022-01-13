import React, { createRef } from 'react';
import classNames from 'classnames';
import { path } from 'ramda';
import PropTypes from 'prop-types';
import produce from 'immer';
import i18n from '../../../utils/i18n';
import HtmlText from '../../HtmlText';
import Button, { BUTTON_COLOR } from '../../Button';
import RegisterForm from './RegisterForm';
import './RegisterSection.scss';

class RegisterSection extends React.PureComponent {
  constructor(props) {
    super(props);
    this.openForm = this.openForm.bind(this);
    this.titleRef = createRef();
    this.state = {
      isFormOpen: false,
    };
  }

  openForm() {
    const { scrollToFunc } = this.props;
    this.setState(produce((draft) => {
      draft.isFormOpen = true;
    }), () => {
      const offsetTop = path(['titleRef', 'current', 'offsetTop'], this);
      if (typeof scrollToFunc === 'function' && typeof offsetTop !== 'undefined') {
        scrollToFunc(offsetTop);
      }
    });
  }

  render() {
    const { className } = this.props;
    const { isFormOpen } = this.state;
    return (
      <div className={classNames('RegisterSection', className)}>
        <h3 className="ubs-header-3 pt-2" ref={this.titleRef}>{i18n.t('registration')}</h3>
        <div className="row pt-2">
          <div className="col">
            <HtmlText data={{ text: i18n.t('not_yet_registered') }} />
          </div>
        </div>
        {!isFormOpen && (
          <Button
            onClick={this.openForm}
            color={BUTTON_COLOR.ATLANTIC}
            className="w-100 open-register-form"
          >
            {i18n.t('register')}
          </Button>
        )}
        {isFormOpen && (
          <RegisterForm />
        )}
      </div>
    );
  }
}

RegisterSection.propTypes = {
  className: PropTypes.string,
  scrollToFunc: PropTypes.func,
};

RegisterSection.defaultProps = {
  className: '',
  scrollToFunc: () => {},
};

export default RegisterSection;
