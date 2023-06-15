/**
 *
 * Asynchronously loads the component for MeanTimeBetweenFailureTableAnalysis
 *
 */

import { lazyLoad } from 'utils/loadable';

export const MeanTimeBetweenFailureTableAnalysis = lazyLoad(
    () => import('./MeanTimeBetweenFailureTableAnalysis'),
    (module) => module.MeanTimeBetweenFailureTableAnalysisWidget,
);

export default MeanTimeBetweenFailureTableAnalysis;
