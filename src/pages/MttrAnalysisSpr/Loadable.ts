/**
 *
 * Asynchronously loads the component for MttrAnalysisSpr
 *
 */

import { lazyLoad } from 'utils/loadable';

export const MttrAnalysisSpr = lazyLoad(
    () => import('./MttrAnalysisSpr'),
    (module) => module.MttrAnalysisSpr,
);

export default MttrAnalysisSpr;
