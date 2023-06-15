/**
 *
 * Asynchronously loads the component for OpportunityAnalysisTool
 *
 */

import { lazyLoad } from 'utils/loadable';

export const OpportunityAnalysisTool = lazyLoad(
    () => import('./OpportunityAnalysisTool'),
    (module) => module.OpportunityAnalysisTool,
);

export default OpportunityAnalysisTool;
