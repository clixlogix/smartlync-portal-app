/**
 *
 * Asynchronously loads the component for Measurements
 *
 */

import { lazyLoad } from 'utils/loadable';

export const Measurements = lazyLoad(
    () => import('./Measurements'),
    (module) => module.Measurements,
);

export default Measurements;
