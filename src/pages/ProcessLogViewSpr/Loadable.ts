/**
 *
 * Asynchronously loads the component for ProcessLogViewSpr
 *
 */

import { lazyLoad } from 'utils/loadable';

export const ProcessLogViewSpr = lazyLoad(
    () => import('./ProcessLogViewSpr'),
    (module) => module.ProcessLogViewSpr,
);

export default ProcessLogViewSpr;
