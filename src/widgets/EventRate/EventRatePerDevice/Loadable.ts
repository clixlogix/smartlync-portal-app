/**
 *
 * Asynchronously loads the component for EventRatePerDevice
 *
 */

import { lazyLoad } from 'utils/loadable';

export const EventRatePerDevice = lazyLoad(
    () => import('./EventRatePerDevice'),
    (module) => module.EventRatePerDevice,
);

export default EventRatePerDevice;
