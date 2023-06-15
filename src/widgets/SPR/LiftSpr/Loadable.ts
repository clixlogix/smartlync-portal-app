/**
 *
 * Asynchronously loads the component for LiftSpr
 *
 */

import { lazyLoad } from 'utils/loadable';

export const LiftSpr = lazyLoad(
    () => import('./LiftSpr'),
    (module) => module.LiftSprWidget,
);

export default LiftSpr;
