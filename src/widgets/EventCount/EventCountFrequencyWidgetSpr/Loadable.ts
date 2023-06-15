/**
 *
 * Asynchronously loads the component for EventCountFrequencyWidgetSpr
 *
 */

import { lazyLoad } from 'utils/loadable';

export const EventCountFrequencyWidgetSpr = lazyLoad(
    () => import('./EventCountFrequencyWidgetSpr'),
    (module) => module.EventCountFrequencyWidgetSpr,
);

export default EventCountFrequencyWidgetSpr;
