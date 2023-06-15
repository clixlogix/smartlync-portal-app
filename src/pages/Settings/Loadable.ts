/**
 *
 * Asynchronously loads the component for Settings
 *
 */

import { lazyLoad } from 'utils/loadable';

export const Settings = lazyLoad(
    () => import('./Settings'),
    (module) => module.Settings,
);

export default Settings;
