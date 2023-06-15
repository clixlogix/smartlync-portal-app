/**
 *
 * Asynchronously loads the component for CarbodyRiskAnalysis
 *
 */

import { lazyLoad } from 'utils/loadable';

export const CarbodyRiskAnalysis = lazyLoad(
    () => import('./CarbodyRiskAnalysis'),
    (module) => module.CarbodyRiskAnalysis,
);

export default CarbodyRiskAnalysis;
