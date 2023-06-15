/**
 *
 * Asynchronously loads the component for FaultReport
 *
 */

import { lazyLoad } from 'utils/loadable';

export const FaultReport = lazyLoad(
    () => import('./FaultReport'),
    (module) => module.FaultReportWidget,
);

export default FaultReport;
