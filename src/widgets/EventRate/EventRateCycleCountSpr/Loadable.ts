/**
 *
 * Asynchronously loads the component for EventRateCycleCountSpr
 *
 */

import { lazyLoad } from 'utils/loadable';

export const EventRateCycleCountSpr = lazyLoad(
    () => import('./EventRateCycleCountSpr'),
    (module) => module.EventRateCycleCountSpr,
);

export default EventRateCycleCountSpr;
