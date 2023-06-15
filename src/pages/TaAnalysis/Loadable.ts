/**
 *
 * Asynchronously loads the component for TaAnalysis
 *
 */

import { lazyLoad } from 'utils/loadable';

export const TaAnalysis = lazyLoad(
    () => import('./TaAnalysis'),
    (module) => module.TaAnalysis,
);

export default TaAnalysis;
