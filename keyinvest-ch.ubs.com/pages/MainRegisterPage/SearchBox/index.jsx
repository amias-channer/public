import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import {
  Button, Col, Input, InputGroup, InputGroupAddon, Row,
} from 'reactstrap';

function SearchBox(props) {
  const {
    inputPlaceholder,
    searchButtonText,
    onInputTextChange,
    onSearchButtonClick,
    inputSearchError,
  } = props;
  return (
    <div className="SearchBox">
      <Row>
        <Col className="search-bar-container" sm={12} md={10} lg={8} xl={6}>
          <InputGroup className={classNames('SearchBar', inputSearchError ? 'error-input' : '')}>
            <Input type="text" placeholder={inputPlaceholder} onChange={onInputTextChange} onKeyDown={onInputTextChange} />
            <InputGroupAddon addonType="append">
              <Button color="white" disabled>
                <i className="icon-glass" />
              </Button>
            </InputGroupAddon>
          </InputGroup>
        </Col>
        <Col sm={12} md={2} lg={4} xl={6}>
          <Button onClick={onSearchButtonClick} className="search-button">{ searchButtonText }</Button>
        </Col>
      </Row>

    </div>
  );
}

SearchBox.propTypes = {
  inputPlaceholder: PropTypes.string,
  searchButtonText: PropTypes.string,
  onInputTextChange: PropTypes.func,
  onSearchButtonClick: PropTypes.func,
  inputSearchError: PropTypes.bool,
};

SearchBox.defaultProps = {
  inputPlaceholder: '',
  searchButtonText: '',
  onInputTextChange: () => {},
  onSearchButtonClick: () => {},
  inputSearchError: false,
};

export default SearchBox;
