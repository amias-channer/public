import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import i18n from '../../../../utils/i18n';
import {
  getCountryValue,
  getIsValidated,
  getSalutationValue,
  getUserTypeValue,
} from '../PublicationsDownloadComponent.helper';

function PublicationsForm(props) {
  const {
    salutations, countriesList,
    userTypes, onFormInputChange, data,
    onFormSubmit,
    onFieldClicked,
  } = props;

  const getCountriesList = (countriesData) => Object.keys(countriesData).map(
    (item) => (
      <option
        key={item}
        value={item}
      >
        {countriesData[item]}
      </option>
    ),
  );

  const getUserTypes = (userTypesData) => userTypesData.map(
    (userType) => <option key={userType.type} value={userType.label}>{userType.label}</option>,
  );

  const isFalse = (variable) => variable === false;

  const { male, female } = salutations;
  return (
    <div className="PublicationsForm">
      <form>
        <h1>{i18n.t('order_now')}</h1>
        <div className="form-row row-radio-controls">
          <div className="col">
            <div className="custom-control custom-radio form-check-inline">
              <input
                type="radio"
                className="custom-control-input"
                id="mr"
                name="salutation"
                onChange={onFormInputChange}
                value={i18n.t('male')}
                checked={getSalutationValue(data) === i18n.t('male')}
              />
              <label className="custom-control-label" htmlFor="mr">{male}</label>
            </div>

            <div className="custom-control custom-radio form-check-inline">
              <input
                type="radio"
                className="custom-control-input"
                id="mrs"
                name="salutation"
                onChange={onFormInputChange}
                value={i18n.t('female')}
                checked={getSalutationValue(data) === i18n.t('female')}
              />
              <label className="custom-control-label" htmlFor="mrs">
                {female}
              </label>
            </div>

          </div>
        </div>
        <div className="form-row">
          <div className="form-group col col-sm-12 col-md-6">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="firstName">{`${i18n.t('first_name')}*`}</label>
            <input
              type="text"
              name="firstName"
              className={classNames('form-control', isFalse(getIsValidated('firstName')(data)) ? 'is-invalid' : '')}
              id="firstName"
              onChange={onFormInputChange}
              onClick={onFieldClicked}
              required
            />
          </div>
          <div className="form-group col col-sm-12 col-md-6">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="lastName">{`${i18n.t('last_name')}*`}</label>
            <input
              type="text"
              name="lastName"
              onClick={onFieldClicked}
              className={classNames('form-control', isFalse(getIsValidated('lastName')(data)) ? 'is-invalid' : '')}
              id="lastName"
              onChange={onFormInputChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group col col-sm-12 col-md-6">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="company">{i18n.t('company')}</label>
            <input
              type="text"
              name="company"
              onClick={onFieldClicked}
              className={classNames('form-control', isFalse(getIsValidated('company')(data)) ? 'is-invalid' : '')}
              id="company"
              onChange={onFormInputChange}
            />
          </div>
          <div className="form-group col col-sm-12 col-md-6">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="department">{i18n.t('division')}</label>
            <input
              type="text"
              name="department"
              onClick={onFieldClicked}
              className={classNames('form-control', isFalse(getIsValidated('department')(data)) ? 'is-invalid' : '')}
              id="department"
              onChange={onFormInputChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group col col-sm-12 col-md-6">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="iAm">{i18n.t('user_type')}</label>
            <select
              className="custom-select"
              id="iAm"
              onChange={onFormInputChange}
              name="iAm"
              value={getUserTypeValue(data)}
              onClick={onFieldClicked}
            >
              {getUserTypes(userTypes)}
            </select>
          </div>
          <div className="form-group col col-sm-12 col-md-6">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="street">{`${i18n.t('street')}*`}</label>
            <input
              type="text"
              name="street"
              onClick={onFieldClicked}
              className={classNames('form-control', isFalse(getIsValidated('street')(data)) ? 'is-invalid' : '')}
              id="street"
              onChange={onFormInputChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group col col-sm-12 col-md-6">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="postalCode">{`${i18n.t('zip')}*`}</label>
            <input
              type="text"
              name="postalCode"
              onClick={onFieldClicked}
              className={classNames('form-control', isFalse(getIsValidated('postalCode')(data)) ? 'is-invalid' : '')}
              id="postalCode"
              onChange={onFormInputChange}
              required
            />
          </div>
          <div className="form-group col col-sm-12 col-md-6">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="city">{`${i18n.t('place')}*`}</label>
            <input
              type="text"
              name="city"
              onClick={onFieldClicked}
              className={classNames('form-control', isFalse(getIsValidated('city')(data)) ? 'is-invalid' : '')}
              onChange={onFormInputChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group col col-sm-12 col-md-6">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="country">{`${i18n.t('country')}*`}</label>
            <select
              className="custom-select"
              id="country"
              onClick={onFieldClicked}
              onChange={onFormInputChange}
              name="country"
              required
              value={getCountryValue(data)}
            >
              {getCountriesList(countriesList)}
            </select>
          </div>
          <div className="form-group col col-sm-12 col-md-6">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="email">{`${i18n.t('mail')}*`}</label>
            <input
              type="text"
              onClick={onFieldClicked}
              className={classNames('form-control', isFalse(getIsValidated('email')(data)) ? 'is-invalid' : '')}
              id="email"
              onChange={onFormInputChange}
              name="email"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="btn btn-green"
          onClick={onFormSubmit}
        >
          {i18n.t('submit')}
        </button>
      </form>
    </div>
  );
}

PublicationsForm.propTypes = {
  salutations: PropTypes.objectOf(PropTypes.any),
  data: PropTypes.objectOf(PropTypes.any),
  countriesList: PropTypes.objectOf(PropTypes.any),
  userTypes: PropTypes.arrayOf(PropTypes.any),
  onFormInputChange: PropTypes.func,
  onFormSubmit: PropTypes.func,
  onFieldClicked: PropTypes.func,
};

PublicationsForm.defaultProps = {
  salutations: {},
  data: {},
  countriesList: {},
  userTypes: [],
  onFormInputChange: () => {},
  onFormSubmit: () => {},
  onFieldClicked: () => {},
};

export default React.memo(PublicationsForm);
