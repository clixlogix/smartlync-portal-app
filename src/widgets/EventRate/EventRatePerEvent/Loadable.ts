/**
 *
 * Asynchronously loads the component for EventRatePerEvent
 *
 */

import { lazyLoad } from 'utils/loadable';

export const EventRatePerEvent = lazyLoad(
    () => import('./EventRatePerEvent'),
    (module) => module.EventRatePerEvent,
);

export default EventRatePerEvent;
