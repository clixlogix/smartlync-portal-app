/**
 *
 * Asynchronously loads the component for ReportingViewBspr
 *
 */

import { lazyLoad } from 'utils/loadable';

export const ReportingViewBspr = lazyLoad(
    () => import('./ReportingViewBspr'),
    (module) => module.ReportingViewBspr,
);

export default ReportingViewBspr;
