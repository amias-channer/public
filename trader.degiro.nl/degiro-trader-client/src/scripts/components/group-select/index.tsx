import PersistentHorizontalScrollSection from 'frontend-core/dist/components/ui-trader4/scroll-panel/persistent-horizontal-scroll-section';
import * as React from 'react';
import {activeItem, group, item} from './group-select.css';

export interface GroupSelectOption<T extends string = string> {
    id: T;
    disabled?: boolean;
    label: React.ReactNode | React.ReactNode[];
}

type Props<T extends string = string> = React.PropsWithChildren<{
    name?: string;
    itemName?: string;
    className?: string;
    itemClassName?: string;
    activeItemClassName?: string;
    selectedOptionId?: GroupSelectOption<T>['id'];
    options: GroupSelectOption<T>[];
    onChange(id: GroupSelectOption<T>['id']): void;
    activeItemRef?: React.Ref<HTMLButtonElement>;
}>;

const GroupSelect = React.memo(
    <T extends string = string>({
        name,
        options,
        onChange,
        itemName,
        className = '',
        itemClassName = '',
        activeItemClassName = '',
        selectedOptionId,
        activeItemRef
    }: React.PropsWithChildren<Props<T>>) => (
        <PersistentHorizontalScrollSection
            activeItemSelector={`.${activeItem}`}
            className={`${group} ${className}`}
            data-name={name || undefined}>
            {options.map(({id: optionId, disabled, label}: GroupSelectOption) => {
                const isActive: boolean = selectedOptionId === optionId;

                return (
                    <button
                        ref={isActive ? activeItemRef : undefined}
                        type="button"
                        onClick={(event: React.MouseEvent<HTMLElement>) => {
                            const {id} = event.currentTarget.dataset;
                            const selectedOption = options.find((item: GroupSelectOption) => item.id === id);

                            if (selectedOption) {
                                onChange(selectedOption.id);
                            }
                        }}
                        disabled={isActive || disabled}
                        className={`${item} ${isActive ? `${activeItem} ${activeItemClassName}` : ''} ${itemClassName}`}
                        data-id={optionId}
                        key={optionId}
                        name={itemName}>
                        {label}
                    </button>
                );
            })}
        </PersistentHorizontalScrollSection>
    )
);

GroupSelect.displayName = 'GroupSelect';

export default GroupSelect as <T extends string = string>(props: Props<T>) => JSX.Element;
