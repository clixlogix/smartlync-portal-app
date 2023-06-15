/**
 *
 * Asynchronously loads the component for AnalysisOverview
 *
 */

import { lazyLoad } from 'utils/loadable';

export const AnalysisOverview = lazyLoad(
    () => import('./AnalysisOverview'),
    (module) => module.AnalysisOverview,
);

export default AnalysisOverview;
