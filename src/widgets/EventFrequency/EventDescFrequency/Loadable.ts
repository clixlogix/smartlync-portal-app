/**
 *
 * Asynchronously loads the component for EventDescFrequency
 *
 */

import { lazyLoad } from 'utils/loadable';

export const EventDescFrequency = lazyLoad(
    () => import('./EventDescFrequency'),
    (module) => module.EventDescFrequencyWidget,
);

export default EventDescFrequency;
