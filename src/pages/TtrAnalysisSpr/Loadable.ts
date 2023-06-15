/**
 *
 * Asynchronously loads the component for TtrAnalysisSpr
 *
 */

import { lazyLoad } from 'utils/loadable';

export const TtrAnalysisSpr = lazyLoad(
    () => import('./TtrAnalysisSpr'),
    (module) => module.TtrAnalysisSpr,
);

export default TtrAnalysisSpr;
