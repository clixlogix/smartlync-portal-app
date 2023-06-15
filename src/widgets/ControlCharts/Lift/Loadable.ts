/**
 *
 * Asynchronously loads the component for Lift
 *
 */

import { lazyLoad } from 'utils/loadable';

export const Lift = lazyLoad(
    () => import('./Lift'),
    (module) => module.Lift,
);

export default Lift;
