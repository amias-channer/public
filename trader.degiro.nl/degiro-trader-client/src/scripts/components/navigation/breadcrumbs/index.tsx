import {inlineLeft} from 'frontend-core/dist/components/ui-trader4/alignment-utils.css';
import Icon from 'frontend-core/dist/components/ui-trader4/icon/index';
import * as React from 'react';
import {Link} from 'react-router-dom';
import {backLink, layout, navigationWrapper, navigation, selectedNavigationItem} from './breadcrumbs.css';

export interface BackLinkProps {
    to: string;
    content: React.ReactNode;
}

export interface BreadcrumbsItem {
    id: string;
    to?: string;
    selected?: boolean;
    content: React.ReactNode;
}

export interface BreadcrumbsProps {
    backLinkProps?: BackLinkProps;
    items: BreadcrumbsItem[];
}

const Breadcrumbs: React.FunctionComponent<BreadcrumbsProps> = ({backLinkProps, items}) => (
    <div className={layout}>
        <div className={navigationWrapper}>
            {backLinkProps && (
                <Link data-name="backLink" to={backLinkProps.to} className={backLink}>
                    <Icon type="arrow_back" className={inlineLeft} />
                    {backLinkProps.content}
                </Link>
            )}
            <div className={navigation}>
                {items.reduce((nodes: React.ReactNode[], item: BreadcrumbsItem, index, items) => {
                    const {id, to} = item;
                    const itemClassName: string = item.selected ? selectedNavigationItem : '';

                    if (to) {
                        nodes.push(
                            <Link key={id} to={to} className={itemClassName}>
                                {item.content}
                            </Link>
                        );
                    } else {
                        nodes.push(
                            <span key={id} className={itemClassName}>
                                {item.content}
                            </span>
                        );
                    }

                    // there is a next item
                    if (items[index + 1]) {
                        nodes.push(<Icon key={`itemsSeparator-${index}`} type="keyboard_arrow_right" />);
                    }

                    return nodes;
                }, [])}
            </div>
        </div>
    </div>
);

export default React.memo(Breadcrumbs);
