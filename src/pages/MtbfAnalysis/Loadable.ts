/**
 *
 * Asynchronously loads the component for MtbfAnalysis
 *
 */

import { lazyLoad } from 'utils/loadable';

export const MtbfAnalysis = lazyLoad(
    () => import('./MtbfAnalysis'),
    (module) => module.MtbfAnalysis,
);

export default MtbfAnalysis;
