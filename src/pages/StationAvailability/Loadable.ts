/**
 *
 * Asynchronously loads the component for StationAvailability
 *
 */

import { lazyLoad } from 'utils/loadable';

export const StationAvailability = lazyLoad(
    () => import('./StationAvailability'),
    (module) => module.StationAvailability,
);

export default StationAvailability;
