/**
 *
 * Asynchronously loads the component for MeanTimeBetweenFailureTableAnalysisSpr
 *
 */

import { lazyLoad } from 'utils/loadable';

export const MeanTimeBetweenFailureTableAnalysisSpr = lazyLoad(
    () => import('./MeanTimeBetweenFailureTableAnalysisSpr'),
    (module) => module.MeanTimeBetweenFailureTableAnalysisSprWidget,
);

export default MeanTimeBetweenFailureTableAnalysisSpr;
