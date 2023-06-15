/**
 *
 * Asynchronously loads the component for EventRatePerEventSpr
 *
 */

import { lazyLoad } from 'utils/loadable';

export const EventRatePerEventSpr = lazyLoad(
    () => import('./EventRatePerEventSpr'),
    (module) => module.EventRatePerEventSpr,
);

export default EventRatePerEventSpr;
