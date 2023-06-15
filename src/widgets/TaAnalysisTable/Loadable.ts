/**
 *
 * Asynchronously loads the component for TaAnalysisTable
 *
 */

import { lazyLoad } from 'utils/loadable';

export const TaAnalysisTable = lazyLoad(
    () => import('./TaAnalysisTable'),
    (module) => module.TaAnalysisTable,
);

export default TaAnalysisTable;
