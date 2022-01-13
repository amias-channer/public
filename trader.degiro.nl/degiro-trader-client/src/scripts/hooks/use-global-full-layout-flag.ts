import useMediaQuery from 'frontend-core/dist/hooks/use-media-query';
import {globalFullLayout} from '../media-queries';

export default function useGlobalFullLayoutFlag(): boolean {
    return useMediaQuery(globalFullLayout);
}
