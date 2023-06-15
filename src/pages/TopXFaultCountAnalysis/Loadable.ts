/**
 *
 * Asynchronously loads the component for TopXFaultCountAnalysis
 *
 */

import { lazyLoad } from 'utils/loadable';

export const TopXFaultCountAnalysis = lazyLoad(
    () => import('./TopXFaultCountAnalysis'),
    (module) => module.TopXFaultCountAnalysis,
);

export default TopXFaultCountAnalysis;
