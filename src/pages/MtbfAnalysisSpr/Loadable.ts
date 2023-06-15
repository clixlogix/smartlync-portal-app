/**
 *
 * Asynchronously loads the component for MtbfAnalysisSpr
 *
 */

import { lazyLoad } from 'utils/loadable';

export const MtbfAnalysisSpr = lazyLoad(
    () => import('./MtbfAnalysisSpr'),
    (module) => module.MtbfAnalysisSpr,
);

export default MtbfAnalysisSpr;
