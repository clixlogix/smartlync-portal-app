/**
 *
 * Asynchronously loads the component for FailureRateTrend
 *
 */

import { lazyLoad } from 'utils/loadable';

export const FailureRateTrend = lazyLoad(
    () => import('./FailureRateTrend'),
    (module) => module.FailureRateTrend,
);

export default FailureRateTrend;
