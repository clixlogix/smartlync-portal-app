/**
 *
 * Asynchronously loads the component for WeldTimeSpr
 *
 */

import { lazyLoad } from 'utils/loadable';

export const WeldTimeSpr = lazyLoad(
    () => import('./WeldTimeSpr'),
    (module) => module.WeldTimeSprWidget,
);

export default WeldTimeSpr;
