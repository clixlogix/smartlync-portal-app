/**
 *
 * Asynchronously loads the component for EssentialControlChart
 *
 */

import { lazyLoad } from 'utils/loadable';

export const EssentialControlChart = lazyLoad(
    () => import('./EssentialControlChart'),
    (module) => module.EssentialControlChart,
);

export default EssentialControlChart;
