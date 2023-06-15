/**
 *
 * Asynchronously loads the component for EssentialControlChartSpr
 *
 */

import { lazyLoad } from 'utils/loadable';

export const EssentialControlChartSpr = lazyLoad(
    () => import('./EssentialControlChartSpr'),
    (module) => module.EssentialControlChartSpr,
);

export default EssentialControlChartSpr;
