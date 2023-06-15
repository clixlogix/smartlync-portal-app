/**
 *
 * Asynchronously loads the component for MeasurementAggregateWidget
 *
 */

import { lazyLoad } from 'utils/loadable';

export const MeasurementAggregateWidget = lazyLoad(
    () => import('./MeasurementAggregateWidget'),
    (module) => module.MeasurementAggregateWidgetWidget,
);

export default MeasurementAggregateWidget;
