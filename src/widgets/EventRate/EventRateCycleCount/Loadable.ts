/**
 *
 * Asynchronously loads the component for EventRateCycleCount
 *
 */

import { lazyLoad } from 'utils/loadable';

export const EventRateCycleCount = lazyLoad(
    () => import('./EventRateCycleCount'),
    (module) => module.EventRateCycleCount,
);

export default EventRateCycleCount;
