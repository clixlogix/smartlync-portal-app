/**
 *
 * Asynchronously loads the component for ReportingView
 *
 */

import { lazyLoad } from 'utils/loadable';

export const ReportingView = lazyLoad(
    () => import('./ReportingView'),
    (module) => module.ReportingView,
);
