/**
 *
 * Asynchronously loads the component for FaultCountTrendSpr
 *
 */

import { lazyLoad } from 'utils/loadable';

export const FaultCountTrendSpr = lazyLoad(
    () => import('./FaultCountTrendSpr'),
    (module) => module.FaultCountTrendSpr,
);

export default FaultCountTrendSpr;
