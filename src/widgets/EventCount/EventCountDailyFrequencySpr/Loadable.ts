/**
 *
 * Asynchronously loads the component for EventCountDailyFrequencySpr
 *
 */

import { lazyLoad } from 'utils/loadable';

export const EventCountDailyFrequencySpr = lazyLoad(
    () => import('./EventCountDailyFrequencySpr'),
    (module) => module.EventCountDailyFrequencySprWidget,
);

export default EventCountDailyFrequencySpr;
