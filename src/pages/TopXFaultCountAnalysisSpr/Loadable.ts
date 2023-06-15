/**
 *
 * Asynchronously loads the component for TopXFaultCountAnalysisSpr
 *
 */

import { lazyLoad } from 'utils/loadable';

export const TopXFaultCountAnalysisSpr = lazyLoad(
    () => import('./TopXFaultCountAnalysisSpr'),
    (module) => module.TopXFaultCountAnalysisSpr,
);

export default TopXFaultCountAnalysisSpr;
