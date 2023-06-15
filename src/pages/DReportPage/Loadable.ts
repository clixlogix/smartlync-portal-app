/**
 *
 * Asynchronously loads the component for DReportPage
 *
 */

import { lazyLoad } from 'utils/loadable';

export const DReportPage = lazyLoad(
    () => import('./DReportPage'),
    (module) => module.DReportPage,
);

export default DReportPage;
