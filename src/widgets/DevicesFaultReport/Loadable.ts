/**
 *
 * Asynchronously loads the component for DevicesFaultReport
 *
 */

import { lazyLoad } from 'utils/loadable';

export const DevicesFaultReport = lazyLoad(
    () => import('./DevicesFaultReport'),
    (module) => module.DevicesFaultReportWidget,
);

export default DevicesFaultReport;
