/**
 *
 * Asynchronously loads the component for EventCodeFrequencySpr
 *
 */

import { lazyLoad } from 'utils/loadable';

export const EventCodeFrequencySpr = lazyLoad(
    () => import('./EventCodeFrequencySpr'),
    (module) => module.EventCodeFrequencySprWidget,
);

export default EventCodeFrequencySpr;
