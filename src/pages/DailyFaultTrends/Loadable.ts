/**
 *
 * Asynchronously loads the component for DailyFaultTrends
 *
 */

import { lazyLoad } from 'utils/loadable';

export const DailyFaultTrends = lazyLoad(
    () => import('./DailyFaultTrends'),
    (module) => module.DailyFaultTrends,
);

export default DailyFaultTrends;
