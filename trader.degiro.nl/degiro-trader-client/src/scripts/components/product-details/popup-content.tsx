import * as React from 'react';
import Accordion from '../accordion';
import AccordionItem from '../accordion/accordion-item';
import {productDetailsTooltipContent, productDetailsTooltipTitle} from './product-details.css';
import {TooltipItem, Tooltips} from '../../models/refinitiv-product-details-tooltips';

interface Props {
    tooltips: Tooltips;
}

const PopupContent: React.FunctionComponent<Props> = ({tooltips}) => (
    <Accordion>
        {({toggle, openedItemIds}) =>
            Object.values(tooltips).map((value: TooltipItem, index: number) => {
                const id: string = index.toString();

                return (
                    <AccordionItem
                        header={value.label}
                        key={id}
                        isOpened={openedItemIds.includes(id)}
                        onToggle={toggle.bind(null, id)}>
                        <dl>
                            <dt className={productDetailsTooltipTitle}>{value.title}</dt>
                            <dd className={productDetailsTooltipContent}>{value.content}</dd>
                        </dl>
                    </AccordionItem>
                );
            })
        }
    </Accordion>
);

export default React.memo(PopupContent);
