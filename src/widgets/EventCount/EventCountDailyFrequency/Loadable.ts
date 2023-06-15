/**
 *
 * Asynchronously loads the component for EventCountDailyFrequency
 *
 */

import { lazyLoad } from 'utils/loadable';

export const EventCountDailyFrequency = lazyLoad(
    () => import('./EventCountDailyFrequency'),
    (module) => module.EventCountDailyFrequency,
);

export default EventCountDailyFrequency;
