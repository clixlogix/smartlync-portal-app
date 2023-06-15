/**
 *
 * Asynchronously loads the component for CarbodyRiskTable
 *
 */

import { lazyLoad } from 'utils/loadable';

export const CarbodyRiskTable = lazyLoad(
    () => import('./CarbodyRiskTable'),
    (module) => module.CarbodyRiskTableWidget,
);

export default CarbodyRiskTable;
