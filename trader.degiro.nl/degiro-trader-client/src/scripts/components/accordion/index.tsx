import * as React from 'react';
import useStateFromProp from 'frontend-core/dist/hooks/use-state-from-prop';

export type AccordionItemId = string;
interface AccordionApi {
    toggle: (id: string) => void;
    openedItemIds: AccordionItemId[];
}

/* TODO remove 'initial' prefix from 'initialOpenedItemIds', cause this prop controls opened
   items from outside the component. */
interface AccordionProps {
    initialOpenedItemIds?: AccordionItemId[];
    children(props: AccordionApi): React.ReactNode[];
}

const Accordion: React.FunctionComponent<AccordionProps> = ({children, initialOpenedItemIds}) => {
    const [openedItemIds, setOpenedItemIds] = useStateFromProp(initialOpenedItemIds, (ids = []) => ids);
    const toggle = (id: string) =>
        setOpenedItemIds((openedItemIds) => {
            if (openedItemIds.includes(id)) {
                return openedItemIds.filter((openedItemId) => openedItemId !== id);
            }

            return [...openedItemIds, id];
        });

    return <ul>{children({toggle, openedItemIds})}</ul>;
};

export default React.memo(Accordion);
