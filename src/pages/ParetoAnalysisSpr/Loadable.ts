/**
 *
 * Asynchronously loads the component for ParetoAnalysisSpr
 *
 */

import { lazyLoad } from 'utils/loadable';

export const ParetoAnalysisSpr = lazyLoad(
    () => import('./ParetoAnalysisSpr'),
    (module) => module.ParetoAnalysisSpr,
);

export default ParetoAnalysisSpr;
