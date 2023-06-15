/**
 *
 * Asynchronously loads the component for OverviewAnalysis
 *
 */

import { lazyLoad } from 'utils/loadable';

export const OverviewAnalysis = lazyLoad(
    () => import('./OverviewAnalysis'),
    (module) => module.OverviewAnalysis,
);

export default OverviewAnalysis;
