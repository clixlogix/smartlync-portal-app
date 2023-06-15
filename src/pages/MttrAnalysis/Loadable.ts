/**
 *
 * Asynchronously loads the component for MttrAnalysis
 *
 */

import { lazyLoad } from 'utils/loadable';

export const MttrAnalysis = lazyLoad(
    () => import('./MttrAnalysis'),
    (module) => module.MttrAnalysis,
);

export default MttrAnalysis;
