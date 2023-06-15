/**
 *
 * Asynchronously loads the component for EventDescFrequencySpr
 *
 */

import { lazyLoad } from 'utils/loadable';

export const EventDescFrequencySpr = lazyLoad(
    () => import('./EventDescFrequencySpr'),
    (module) => module.EventDescFrequencySprWidget,
);

export default EventDescFrequencySpr;
