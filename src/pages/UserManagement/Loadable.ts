/**
 *
 * Asynchronously loads the component for UserManagement
 *
 */

import { lazyLoad } from 'utils/loadable';

export const UserManagement = lazyLoad(
    () => import('./UserManagement'),
    (module) => module.UserManagement,
);

export default UserManagement;
