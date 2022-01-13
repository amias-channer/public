export const MY_NEWS_FETCH_DATA = 'MyWatchList/MY_NEWS_FETCH_DATA';
export const MY_NEWS_GOT_DATA = 'MyWatchList/MY_NEWS_GOT_DATA';
export const MY_NEWS_WILL_UNMOUNT = 'MyWatchList/MY_NEWS_WILL_UNMOUNT';

export function myNewsFetchData(url) {
  return {
    type: MY_NEWS_FETCH_DATA,
    url,
  };
}

export function myNewsGotData(data) {
  return {
    type: MY_NEWS_GOT_DATA,
    data,
  };
}
export function myNewsWillUnmount() {
  return {
    type: MY_NEWS_WILL_UNMOUNT,
  };
}
