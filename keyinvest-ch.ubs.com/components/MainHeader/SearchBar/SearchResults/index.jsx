import React from 'react';
import PropTypes from 'prop-types';
import { Scrollbars } from 'react-custom-scrollbars';
import {
  concat, filter, drop, update,
} from 'ramda';
import './SearchResults.scss';
import SearchResultLink from './SearchResultLink';
import ArrowKeysListNavigation from '../../../ArrowKeysListNavigation';

const filterOutNullItems = (results) => {
  const isNotNull = (item) => item !== null;
  return filter(isNotNull, results);
};

const getPreparedResults = (results) => {
  const preparedResults = filterOutNullItems(results);
  const [firstGroup] = preparedResults;
  if (!firstGroup) {
    return preparedResults;
  }
  const groupWithSeparatorRemoved = drop(1, firstGroup);
  return update(0, groupWithSeparatorRemoved, preparedResults);
};

class SearchResults extends React.PureComponent {
  constructor(props) {
    super(props);
    this.searchResultRef = React.createRef();
  }

  componentDidMount() {
    const { syncSearchResultRef } = this.props;
    if (typeof syncSearchResultRef === 'function') {
      syncSearchResultRef(this.searchResultRef.current);
    }
  }

  render() {
    const {
      data, searchPhrase, searchResultListRefs, setListItemRef,
    } = this.props;
    let results;
    if (data.translations && data.translations.noResults) {
      results = (<p tabIndex="-1">{data.translations.noResults}</p>);
    } else {
      results = Object.keys(data).map((item) => {
        if (data[item] && data[item].entries && data[item].entries.length > 0) {
          return concat([
            <div className="separator" tabIndex="-1" />,
            (
              <h5 tabIndex="-1">
                {data[item].title}
              </h5>
            )], data[item].entries.map(
            (i) => (
              <SearchResultLink
                key={i.name + i.url}
                url={i.url}
                name={i.name}
                searchPhrase={searchPhrase}
                group={data[item].title}
                ref={setListItemRef}
              >
                {i.name}
              </SearchResultLink>
            ),
          ));
        }
        return null;
      });

      results = getPreparedResults(results);
    }
    return (
      <div className="SearchResults search-results-wrapper">
        <Scrollbars style={{
          height: 'calc(100vh - 200px)',
          maxHeight: '700px',
          minHeight: '100px',
        }}
        >
          <ArrowKeysListNavigation startIndex={0} listItemRefs={searchResultListRefs} className="search-results-list">
            <div
              className="focus"
              ref={this.searchResultRef}
            />
            {results}
          </ArrowKeysListNavigation>
        </Scrollbars>
      </div>
    );
  }
}

SearchResults.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  syncSearchResultRef: PropTypes.func,
  searchPhrase: PropTypes.string,
  searchResultListRefs: PropTypes.arrayOf(PropTypes.any),
  setListItemRef: PropTypes.func,
};

SearchResults.defaultProps = {
  data: {},
  searchPhrase: '',
  syncSearchResultRef: undefined,
  searchResultListRefs: [],
  setListItemRef: () => {},
};

export default SearchResults;
