/**
 *
 * Asynchronously loads the component for TopFaultCount
 *
 */

import { lazyLoad } from 'utils/loadable';

export const TopFaultCount = lazyLoad(
    () => import('./TopFaultCount'),
    (module) => module.TopFaultCount,
);

export default TopFaultCount;
