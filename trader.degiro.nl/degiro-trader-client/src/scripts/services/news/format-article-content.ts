import sanitize from 'frontend-core/dist/utils/sanitize';

export interface FormatArticleParams {
    isHtml: boolean;
    tableClassName: string;
}

interface ArticleContentPartsAccumulator {
    listItems: string[];
    tableRows: string[];
    formattedText: string;
}

// TODO: move formatting and post-processing to BE
export default function formatArticleContent(content: string, params: FormatArticleParams): string {
    const paragraphSeparator = /\n\s{1,}/;
    const multipleSpacesInSequenceAfterWord = /\S{1,} {3,}\S/g;
    const textOnlyBullet = /^ {0,4}\*{1,2} {1,}|^ {0,3}-{1,2} {1,}/;
    const htmlAnchorPattern: RegExp = /<a\s+(?:[^>]*?\s+)?href=["'](.*?)["'](?:.*?)>(.*?)<\/a>/gi;
    const preprocessedContent: string = content.replace(htmlAnchorPattern, '<a target="_blank" href="$1">$2</a>');

    if (params.isHtml) {
        return sanitize(preprocessedContent);
    }

    return preprocessedContent.split(paragraphSeparator).reduce(
        (accumulator: ArticleContentPartsAccumulator, line: string): ArticleContentPartsAccumulator => {
            const isTableRow: boolean = (line.match(multipleSpacesInSequenceAfterWord)?.length || 0) > 0;
            const isListItem: boolean = (line.match(textOnlyBullet)?.length || 0) > 0;
            let {listItems, tableRows, formattedText} = accumulator;

            if (tableRows.length > 0 && !isTableRow) {
                // render table
                formattedText += `<div class="${params.tableClassName}">${tableRows.join('\n')}</div>`;
                tableRows = [];
            }

            if (listItems.length > 0 && !isListItem) {
                // render list
                const listItemsHtml: string = listItems
                    .map((listItem: string) => `<li>${listItem.replace(textOnlyBullet, '')}</li>`)
                    .join('');

                formattedText += `<ul>${listItemsHtml}</ul>`;
                listItems = [];
            }

            if (isTableRow) {
                tableRows.push(line);
            } else if (isListItem) {
                listItems.push(line);
            } else {
                formattedText += `<p>${line}</p>`;
            }

            return {formattedText, tableRows, listItems};
        },
        {
            formattedText: '',
            tableRows: [],
            listItems: []
        }
    ).formattedText;
}
