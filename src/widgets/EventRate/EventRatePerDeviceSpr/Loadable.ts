/**
 *
 * Asynchronously loads the component for EventRatePerDeviceSpr
 *
 */

import { lazyLoad } from 'utils/loadable';

export const EventRatePerDeviceSpr = lazyLoad(
    () => import('./EventRatePerDeviceSpr'),
    (module) => module.EventRatePerDeviceSpr,
);

export default EventRatePerDeviceSpr;
