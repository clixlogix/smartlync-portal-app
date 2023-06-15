import { AuthRoles } from 'models';
/**
 *
 *
 * @export
 * @interface RouteItem
 */
export interface RouteItem {
    id?: string;
    label?: string | JSX.Element;
    component?: string;
    componentSPR?: string;
    route?: string;
    title?: string | JSX.Element;
    subTitle?: string | JSX.Element;
    icon?: string | JSX.Element;
    disabled?: boolean;
    roles?: AuthRoles;
    url?: string | string[];
    description?: string;
    children?: RouteItems;
}

export type RouteItems = RouteItem[];

export default RouteItem;
