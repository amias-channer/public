import getQueryString from 'frontend-core/dist/utils/url/get-query-string';
import parseUrlSearchParams from 'frontend-core/dist/utils/url/parse-url-search-params';
import {useCallback, useEffect, useState} from 'react';
import {useHistory, useLocation} from 'react-router-dom';

interface Result<T> {
    data: T;
    prevData: T | undefined;
    setData: (filters: T) => void;
}

const defaultDeserialize = (searchStr: string): any => parseUrlSearchParams(searchStr);
const defaultSerialize = <T>(data: T, prevSearchString: string) => {
    return getQueryString({...parseUrlSearchParams(prevSearchString), ...data});
};

export default function useStateFromLocationSearch<T>(
    deserialize: (searchStr: string) => T = defaultDeserialize,
    serialize: (data: T, prevSearchString: string) => string = defaultSerialize
): Result<T> {
    const {search} = useLocation();
    const history = useHistory();
    const [data, setDataState] = useState<T>(deserialize(search));
    const [prevData, setPrevDataState] = useState<T | undefined>();
    const setData = useCallback(
        (data) => {
            const queryString = serialize(data, search);

            if (queryString !== search) {
                history.replace({...history.location, search: queryString ? `?${queryString}` : ''});
            }
        },
        [search]
    );

    useEffect(() => {
        const newData = deserialize(search);

        if (JSON.stringify(newData) !== JSON.stringify(data)) {
            setDataState(newData);
            setPrevDataState(data);
        }
    }, [search, data]);

    return {data, prevData, setData};
}
