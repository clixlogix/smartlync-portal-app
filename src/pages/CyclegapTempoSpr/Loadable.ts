/**
 *
 * Asynchronously loads the component for CyclegapTempoSpr
 *
 */

import { lazyLoad } from 'utils/loadable';

export const CyclegapTempoSpr = lazyLoad(
    () => import('./CyclegapTempoSpr'),
    (module) => module.CycleGapTempoSpr,
);

export default CyclegapTempoSpr;
