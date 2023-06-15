/**
 *
 * Asynchronously loads the component for DashboardPowerBi
 *
 */

import { lazyLoad } from 'utils/loadable';

export const DashboardPowerBi = lazyLoad(
    () => import('./DashboardPowerBi'),
    (module) => module.DashboardPowerBi,
);
