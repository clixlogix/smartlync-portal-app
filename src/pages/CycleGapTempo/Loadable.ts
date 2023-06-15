/**
 *
 * Asynchronously loads the component for CycleGapTempo
 *
 */

import { lazyLoad } from 'utils/loadable';

export const CycleGapTempo = lazyLoad(
    () => import('./CycleGapTempo'),
    (module) => module.CycleGapTempo,
);

export default CycleGapTempo;
