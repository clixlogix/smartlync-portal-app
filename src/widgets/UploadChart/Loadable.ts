/**
 *
 * Asynchronously loads the component for UploadChart
 *
 */

import { lazyLoad } from 'utils/loadable';

export const UploadChart = lazyLoad(
    () => import('./UploadChart'),
    (module) => module.UploadChartWidget,
);

export default UploadChart;
