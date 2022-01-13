import React, { useState } from 'react';
import './Accordion.scss';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import HtmlText from '../HtmlText';

function Accordion(props) {
  const { data, className } = props;
  const [openItem, setActiveState] = useState(null);
  const isOpenItem = (item) => item.id === openItem;
  const toggleAccordion = (item) => () => (openItem === item.id
    ? setActiveState(null)
    : setActiveState(item.id));
  let items = [];
  if (data && data.items) {
    items = data.items.map(
      (item) => {
        const isOpen = isOpenItem(item);
        return (
          <li key={item.id}>
            <div role="none" className="head-section" onClick={toggleAccordion(item)}>
              <h3 className="title">
                {item.title}
              </h3>
              <span className={classNames('icon float-right', isOpen ? 'icon-arrow_01_up' : 'icon-arrow_01_down')} />
            </div>
            {isOpen && (
            <div className={classNames('content')}>
              <HtmlText data={{ text: item.content }} />
            </div>
            )}
          </li>
        );
      },
    );
  }
  return (
    <div className={classNames('Accordion', className)}>
      {items.length > 0 && (
      <ul>
        {items}
      </ul>
      )}
    </div>
  );
}

Accordion.propTypes = {
  className: PropTypes.string,
  data: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.any), PropTypes.objectOf(PropTypes.any)]),
};

Accordion.defaultProps = {
  className: '',
  data: {
    items: [],
  },
};

export default Accordion;
