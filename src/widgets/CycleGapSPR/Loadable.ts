/**
 *
 * Asynchronously loads the component for CycleGapSpr
 *
 */

import { lazyLoad } from 'utils/loadable';

export const CycleGapSpr = lazyLoad(
    () => import('./CycleGapSpr'),
    (module) => module.CycleGapSprWidget,
);

export default CycleGapSpr;
