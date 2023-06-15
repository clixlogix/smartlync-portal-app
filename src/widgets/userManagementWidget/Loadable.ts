/**
 *
 * Asynchronously loads the component for UserManagementWidget
 *
 */

import { lazyLoad } from 'utils/loadable';

export const UserManagementWidget = lazyLoad(
    () => import('./UserManagementWidget'),
    (module) => module.UserManagementWidget,
);

export default UserManagementWidget;
