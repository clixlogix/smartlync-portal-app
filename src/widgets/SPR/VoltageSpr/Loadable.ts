/**
 *
 * Asynchronously loads the component for VoltageSpr
 *
 */

import { lazyLoad } from 'utils/loadable';

export const VoltageSpr = lazyLoad(
    () => import('./VoltageSpr'),
    (module) => module.VoltageSprWidget,
);

export default VoltageSpr;
