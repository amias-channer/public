import {Routes} from 'frontend-core/dist/components/ui-trader4/navigation';
import {Location} from 'history';

export default function isNewsArticleLinkActive({pathname}: Location): boolean {
    if (!pathname.startsWith(Routes.MARKETS_NEWS) || pathname.startsWith(Routes.MARKETS_NEWS_CATEGORIES)) {
        return false;
    }

    return pathname.split('/').length === 5;
}
