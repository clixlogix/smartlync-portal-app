/**
 *
 * Asynchronously loads the component for DurationOfFaults
 *
 */

import { lazyLoad } from 'utils/loadable';

export const DurationOfFaults = lazyLoad(
    () => import('./DurationOfFaults'),
    (module) => module.DurationOfFaultsWidget,
);

export default DurationOfFaults;
