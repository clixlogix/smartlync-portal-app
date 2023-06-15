/**
 *
 * Asynchronously loads the component for FaultCountTrend
 *
 */

import { lazyLoad } from 'utils/loadable';

export const FaultCountTrend = lazyLoad(
    () => import('./FaultCountTrend'),
    (module) => module.FaultCountTrend,
);

export default FaultCountTrend;
