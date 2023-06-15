/**
 *
 * Asynchronously loads the component for ReportingViewSpr
 *
 */

import { lazyLoad } from 'utils/loadable';

export const ReportingViewSpr = lazyLoad(
    () => import('./ReportingViewSpr'),
    (module) => module.ReportingViewSpr,
);

export default ReportingViewSpr;
