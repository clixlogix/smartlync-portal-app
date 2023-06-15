/**
 *
 * Asynchronously loads the component for FailureRateTrendSpr
 *
 */

import { lazyLoad } from 'utils/loadable';

export const FailureRateTrendSpr = lazyLoad(
    () => import('./FailureRateTrendSpr'),
    (module) => module.FailureRateTrendSpr,
);

export default FailureRateTrendSpr;
