/**
 *
 * Asynchronously loads the component for DashboardFilterPanel
 *
 */

import { lazyLoad } from 'utils/loadable';

export const DashboardFilterPanel = lazyLoad(
    () => import('./DashboardFilterPanel'),
    (module) => module.DashboardFilterPanel,
);

export default DashboardFilterPanel;
