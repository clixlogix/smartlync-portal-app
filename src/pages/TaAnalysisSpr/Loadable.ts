/**
 *
 * Asynchronously loads the component for TaAnalysisSpr
 *
 */

import { lazyLoad } from 'utils/loadable';

export const TaAnalysisSpr = lazyLoad(
    () => import('./TaAnalysisSpr'),
    (module) => module.TaAnalysisSpr,
);

export default TaAnalysisSpr;
