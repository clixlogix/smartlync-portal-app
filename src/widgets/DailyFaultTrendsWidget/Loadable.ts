/**
 *
 * Asynchronously loads the component for DailyFaultTrendsWidget
 *
 */

import { lazyLoad } from 'utils/loadable';

export const DailyFaultTrendsWidget = lazyLoad(
    () => import('./DailyFaultTrendsWidget'),
    (module) => module.DailyFaultTrendsWidget,
);

export default DailyFaultTrendsWidget;
