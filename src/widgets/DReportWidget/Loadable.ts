/**
 *
 * Asynchronously loads the component for DReportWidget
 *
 */

import { lazyLoad } from 'utils/loadable';

export const DReportWidget = lazyLoad(
    () => import('./DReportWidget'),
    (module) => module.DReportWidget,
);

export default DReportWidget;
