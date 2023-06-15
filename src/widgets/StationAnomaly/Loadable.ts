/**
 *
 * Asynchronously loads the component for StationAnomaly
 *
 */

import { lazyLoad } from 'utils/loadable';

export const StationAnomaly = lazyLoad(
    () => import('./StationAnomaly'),
    (module) => module.StationAnomaly,
);

export default StationAnomaly;
