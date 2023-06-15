/**
 *
 * Asynchronously loads the component for ParetoAnalysis
 *
 */

import { lazyLoad } from 'utils/loadable';

export const ParetoAnalysis = lazyLoad(
    () => import('./ParetoAnalysis'),
    (module) => module.ParetoAnalysis,
);

export default ParetoAnalysis;
