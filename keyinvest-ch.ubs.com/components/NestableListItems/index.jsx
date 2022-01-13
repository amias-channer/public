import React from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'reactstrap';
import classNames from 'classnames';
import Masonry from 'react-masonry-css';
import { pathOr } from 'ramda';
import NestableListItem from './NestableListItem';
import Logger from '../../utils/logger';
import {
  getSortedListOfKeys,
  getTooltip,
  hasNestedList,
  isNotVisibleItem,
  LIST_DISPLAY_STYLE_COLUMNS,
} from './NestableListItems.helper';
import { generateUniqId } from '../../utils/utils';

function NestableListItems(props) {
  const {
    list, onChange, displayStyle, itemType, childOf, setListItemRef,
    breakpointColumnsConfigByNestingLevel, disableSort,
    currentNestingLevel, innerPath, uniqId,
  } = props;

  const getBreakpointColumnsConfigByNestingLevel = (nestingLevel) => pathOr(
    null, [nestingLevel], breakpointColumnsConfigByNestingLevel,
  );

  const sortedListOfKeys = disableSort ? Object.keys(list) : getSortedListOfKeys(list);

  const setRef = (ref) => {
    if (ref && setListItemRef) {
      setListItemRef(ref);
      return ref;
    }
    return undefined;
  };
  const getListItems = () => {
    if (list && sortedListOfKeys.length > 0) {
      const listItems = sortedListOfKeys.map((itemKey) => {
        if (list[itemKey] && list[itemKey].hideItem) {
          return null;
        }
        return (
          <li
            key={itemKey}
            className={classNames(
              /* isNotVisibleItem(list[item]) ? 'not-visible' : '', */
              hasNestedList(list[itemKey]) ? 'hasNestedList' : '',
              `nesting-level-${currentNestingLevel}`,
            )}
          >
            <NestableListItem
              disableSort={disableSort}
              innerPath={innerPath}
              className={isNotVisibleItem(list[itemKey]) ? 'not-visible' : ''}
              data={list[itemKey]}
              onClick={onChange}
              key={itemKey}
              displayStyle={displayStyle}
              itemType={itemType}
              childOf={childOf}
              ref={isNotVisibleItem(list[itemKey]) ? undefined : setRef}
              listUniqId={uniqId}
            >
              {hasNestedList(list[itemKey]) && (
                <NestableListItems
                  innerPath={[...innerPath, itemKey, 'list']}
                  list={list[itemKey].list}
                  onChange={onChange}
                  displayStyle={displayStyle}
                  itemType={itemType}
                  childOf={itemKey}
                  setListItemRef={setListItemRef}
                  currentNestingLevel={currentNestingLevel + 1}
                />
              )}
            </NestableListItem>
          </li>
        );
      });
      return (
        <ul>
          {listItems}
        </ul>
      );
    }
    return null;
  };

  const getListItemsAsColumns = () => {
    if (list && sortedListOfKeys.length > 0) {
      const listItems = sortedListOfKeys.map(
        (item) => (
          <div
            key={item}
            className={classNames(
              'elements-group',
              /* isNotVisibleItem(list[item]) ? 'not-visible' : '' */
              `nesting-level-${currentNestingLevel}`,
            )}
          >
            <NestableListItem
              innerPath={innerPath}
              data={list[item]}
              onClick={onChange}
              key={item}
              itemType={itemType}
              childOf={childOf}
              ref={setRef}
              className={isNotVisibleItem(list[item]) ? 'not-visible' : ''}
              tooltip={getTooltip(list[item])}
              listUniqId={uniqId}
            >
              {list[item] && list[item].list && getSortedListOfKeys(list[item].list).length > 0 && (
              <NestableListItems
                disableSort={disableSort}
                innerPath={[...innerPath, item, 'list']}
                list={list[item].list}
                onChange={onChange}
                itemType={itemType}
                childOf={item}
                setListItemRef={setListItemRef}
                currentNestingLevel={currentNestingLevel + 1}
                breakpointColumnsConfigByNestingLevel={breakpointColumnsConfigByNestingLevel}
                displayStyle={getBreakpointColumnsConfigByNestingLevel(currentNestingLevel + 1)
                  ? LIST_DISPLAY_STYLE_COLUMNS : null}
              />
              )}
            </NestableListItem>
          </div>
        ),
      );

      return (
        <Row>
          <Col>
            <Masonry
              breakpointCols={getBreakpointColumnsConfigByNestingLevel(currentNestingLevel)}
              className="masonry-grid"
              columnClassName="masonry-grid_column"
            >
              {listItems}
            </Masonry>
          </Col>
        </Row>
      );
    }
    return null;
  };

  const getListData = () => {
    if (!uniqId) {
      Logger.error('NestableListItems: Prop "uniqId" not provided, it is required to have a unique id for the multiple instances of NestableListItems component to work properly!');
    }

    return (
      displayStyle === LIST_DISPLAY_STYLE_COLUMNS
        ? getListItemsAsColumns() : getListItems()
    );
  };

  return (
    <div className="list">
      {getListData()}
    </div>
  );
}

NestableListItems.propTypes = {
  displayStyle: PropTypes.string,
  onChange: PropTypes.func,
  setListItemRef: PropTypes.func,
  list: PropTypes.objectOf(PropTypes.any),
  itemType: PropTypes.string,
  childOf: PropTypes.string,
  breakpointColumnsConfigByNestingLevel: PropTypes.objectOf(PropTypes.any),
  currentNestingLevel: PropTypes.number,
  innerPath: PropTypes.arrayOf(PropTypes.string),
  uniqId: PropTypes.string,
  disableSort: PropTypes.bool,
};

NestableListItems.defaultProps = {
  displayStyle: 'list',
  onChange: () => {},
  setListItemRef: () => {},
  list: {},
  itemType: '',
  childOf: '',
  breakpointColumnsConfigByNestingLevel: {
    0: {
      default: 3,
      600: 1,
    },
    2: {
      default: 3,
      600: 1,
    },
  },
  currentNestingLevel: 0,
  innerPath: [],
  uniqId: generateUniqId(),
  disableSort: false,
};

export default React.memo(NestableListItems);
