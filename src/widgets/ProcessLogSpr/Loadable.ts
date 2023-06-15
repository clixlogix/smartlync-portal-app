/**
 *
 * Asynchronously loads the component for ProcessLogSpr
 *
 */

import { lazyLoad } from 'utils/loadable';

export const ProcessLogSpr = lazyLoad(
    () => import('./ProcessLogSpr'),
    (module) => module.ProcessLogSprWidget,
);

export default ProcessLogSpr;
