export const KNOCK_OUT_MAP_FETCH_DATA = 'KnockoutMap/KNOCK_OUT_MAP_FETCH_DATA';
export const KNOCK_OUT_MAP_GOT_DATA = 'KnockoutMap/KNOCK_OUT_MAP_GOT_DATA';
export const KNOCK_OUT_MAP_WILL_UNMOUNT = 'KnockoutMap/KNOCK_OUT_MAP_WILL_UNMOUNT';
export function knockoutMapFetchData(url) {
  return {
    type: KNOCK_OUT_MAP_FETCH_DATA,
    url,
  };
}


export function knockoutMapGotData(data) {
  return {
    type: KNOCK_OUT_MAP_GOT_DATA,
    data,
  };
}

export function knockoutMapWillUnmount() {
  return {
    type: KNOCK_OUT_MAP_WILL_UNMOUNT,
  };
}
