/**
 *
 * Asynchronously loads the component for EventCodeFrequency
 *
 */

import { lazyLoad } from 'utils/loadable';

export const EventCodeFrequency = lazyLoad(
    () => import('./EventCodeFrequency'),
    (module) => module.EventCodeFrequency,
);

export default EventCodeFrequency;
