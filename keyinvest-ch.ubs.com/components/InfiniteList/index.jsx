import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Logger from '../../utils/logger';

const InfiniteList = ({
  isLoading, isLoadingMore, loadMoreFunc, hasMore, children, className,
}) => {
  // Will hold a ref to a "bottom" element we will observe
  const [bottom, setBottom] = React.useState(null);
  // Will hold the IntersectionObserver
  const bottomObserver = React.useRef(null);

  React.useEffect(() => {
    (window.IntersectionObserver
      ? Promise.resolve()
      : import('intersection-observer')
    ).then(() => {
      const observer = new window.IntersectionObserver(
        (entries) => {
          try {
            const entry = entries[0];
            if (entry && entry.isIntersecting && !isLoadingMore && hasMore) {
              loadMoreFunc();
            }
          } catch (e) {
            Logger.warn('InfiniteList::IntersectionObserver', e);
          }
        },
        { threshold: 0.25, rootMargin: '100px' },
      );
      bottomObserver.current = observer;
    });
  }, [loadMoreFunc, isLoadingMore, hasMore]);

  React.useEffect(() => {
    const observer = bottomObserver.current;
    if (observer && bottom) {
      observer.observe(bottom);
    }
    return () => {
      if (observer && bottom) {
        observer.unobserve(bottom);
      }
    };
  }, [bottom]);

  return (
    <div className={classNames('InfiniteList', className)}>
      {!isLoading && (
        <>
          {children}

          {hasMore && !isLoadingMore && (
            <div ref={setBottom} className="bottom-tracker m-1 p-1" />
          )}

          {hasMore && isLoadingMore && (
            <div className="mt-4 is-loading" />
          )}
        </>
      )}
    </div>
  );
};

InfiniteList.propTypes = {
  isLoading: PropTypes.bool,
  isLoadingMore: PropTypes.bool,
  hasMore: PropTypes.bool,
  loadMoreFunc: PropTypes.func,
  children: PropTypes.node,
  className: PropTypes.string,
};
InfiniteList.defaultProps = {
  isLoading: false,
  isLoadingMore: false,
  hasMore: false,
  loadMoreFunc: () => {},
  children: null,
  className: '',
};

export default React.memo(InfiniteList);
