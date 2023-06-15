/**
 *
 * Asynchronously loads the component for TopFaultCountSpr
 *
 */

import { lazyLoad } from 'utils/loadable';

export const TopFaultCountSpr = lazyLoad(
    () => import('./TopFaultCountSpr'),
    (module) => module.TopFaultCountSpr,
);

export default TopFaultCountSpr;
