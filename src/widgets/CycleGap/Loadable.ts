/**
 *
 * Asynchronously loads the component for CycleGap
 *
 */

import { lazyLoad } from 'utils/loadable';

export const CycleGap = lazyLoad(
    () => import('./CycleGap'),
    (module) => module.CycleGapWidget,
);

export default CycleGap;
