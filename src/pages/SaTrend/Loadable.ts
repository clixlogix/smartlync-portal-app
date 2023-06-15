/**
 *
 * Asynchronously loads the component for StationAvailability
 *
 */

import { lazyLoad } from 'utils/loadable';

export const SaTrend = lazyLoad(
    () => import('./SaTrend'),
    (module) => module.SaTrend,
);

export default SaTrend;
