import useMediaQuery from 'frontend-core/dist/hooks/use-media-query';
import {scrollableTable as fullLayoutMediaQuery} from '../../../media-queries';

export default function useDataTableFullLayoutFlag(): boolean {
    return useMediaQuery(fullLayoutMediaQuery);
}
