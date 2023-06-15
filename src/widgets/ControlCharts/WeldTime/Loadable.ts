/**
 *
 * Asynchronously loads the component for WeldTime
 *
 */

import { lazyLoad } from 'utils/loadable';

export const WeldTime = lazyLoad(
    () => import('./WeldTime'),
    (module) => module.WeldTime,
);

export default WeldTime;
