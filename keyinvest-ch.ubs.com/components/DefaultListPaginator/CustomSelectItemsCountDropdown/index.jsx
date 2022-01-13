import React from 'react';
import PropTypes from 'prop-types';
import {
  Dropdown, DropdownItem, DropdownMenu, DropdownToggle,
} from 'reactstrap';
import { produce } from 'immer';
import i18n from '../../../utils/i18n';

class CustomSelectItemsCountDropdown extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
    };

    this.onSelected = this.onSelected.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  onSelected(e) {
    const { onChange } = this.props;
    onChange(e.currentTarget.value);
  }

  toggle() {
    const { dropdownOpen } = this.state;
    this.setState(produce((draft) => {
      draft.dropdownOpen = !dropdownOpen;
    }));
  }

  render() {
    const { value, children } = this.props;
    const { dropdownOpen } = this.state;
    return (
      <div className="CustomSelectItemsCountDropdown">
        <Dropdown isOpen={dropdownOpen} toggle={this.toggle}>
          <DropdownToggle color="outline" caret>
            { `${value} ${i18n.t('items_per_page')}` }
          </DropdownToggle>
          <DropdownMenu>
            {children.map((item) => (
              // eslint-disable-next-line react/jsx-props-no-spreading
              <DropdownItem key={item.props.value} {...item.props} type="option" onClick={this.onSelected}>{ `${item.props.value} ${i18n.t('items_per_page')}` }</DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </div>
    );
  }
}

CustomSelectItemsCountDropdown.propTypes = {
  onChange: PropTypes.func,
  children: PropTypes.arrayOf(PropTypes.any),
  value: PropTypes.string,
  type: PropTypes.string,
};

CustomSelectItemsCountDropdown.defaultProps = {
  onChange: () => {},
  children: [],
  value: '',
  type: 'option',
};

CustomSelectItemsCountDropdown.Option = 'div';

export default CustomSelectItemsCountDropdown;
