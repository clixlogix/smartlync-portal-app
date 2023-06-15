/**
 *
 * Asynchronously loads the component for EventCountFrequencyWidget
 *
 */

import { lazyLoad } from 'utils/loadable';

export const EventCountFrequencyWidget = lazyLoad(
    () => import('./EventCountFrequencyWidget'),
    (module) => module.EventCountFrequencyWidget,
);

export default EventCountFrequencyWidget;
