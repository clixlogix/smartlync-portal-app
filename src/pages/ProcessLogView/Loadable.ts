/**
 *
 * Asynchronously loads the component for ProcessLogView
 *
 */

import { lazyLoad } from 'utils/loadable';

export const ProcessLogView = lazyLoad(
    () => import('./ProcessLogView'),
    (module) => module.ProcessLogView,
);
