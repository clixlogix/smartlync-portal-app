/**
 *
 * Asynchronously loads the component for Penetration
 *
 */

import { lazyLoad } from 'utils/loadable';

export const Penetration = lazyLoad(
    () => import('./Penetration'),
    (module) => module.Penetration,
);

export default Penetration;
