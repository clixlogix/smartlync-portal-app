/**
 *
 * Asynchronously loads the component for OpportunityAnalysis
 *
 */

import { lazyLoad } from 'utils/loadable';

export const OpportunityAnalysisWidget = lazyLoad(
    () => import('./OpportunityAnalysis'),
    (module) => module.OpportunityAnalysisWidget,
);

export default OpportunityAnalysisWidget;
