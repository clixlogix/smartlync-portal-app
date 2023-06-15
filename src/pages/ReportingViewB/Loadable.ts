/**
 *
 * Asynchronously loads the component for ReportingView
 *
 */

import { lazyLoad } from 'utils/loadable';

export const ReportingViewB = lazyLoad(
    () => import('./ReportingViewB'),
    (module) => module.ReportingViewB,
);
