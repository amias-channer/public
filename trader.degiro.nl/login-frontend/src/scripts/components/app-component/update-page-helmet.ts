import {I18n} from 'frontend-core/dist/models/i18n';
import localize from 'frontend-core/dist/services/i18n/localize';

function setMetaContent(name: 'keywords' | 'description', content: string) {
    const meta: HTMLMetaElement | null = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);

    meta?.setAttribute('content', content);
}

export default function updatePageHelmet(i18n: I18n) {
    document.title = localize(i18n, 'login.html.title');
    setMetaContent('keywords', localize(i18n, 'login.html.metakeywords'));
    setMetaContent('description', localize(i18n, 'login.html.metadescription'));
}
