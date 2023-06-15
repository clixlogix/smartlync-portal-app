/**
 *
 * Asynchronously loads the component for PenetrationSpr
 *
 */

import { lazyLoad } from 'utils/loadable';

export const PenetrationSpr = lazyLoad(
    () => import('./PenetrationSpr'),
    (module) => module.PenetrationSprWidget,
);

export default PenetrationSpr;
