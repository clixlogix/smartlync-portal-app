/**
 *
 * Asynchronously loads the component for MeasurementAggregateWidgetSpr
 *
 */

import { lazyLoad } from 'utils/loadable';

export const MeasurementAggregateWidgetSpr = lazyLoad(
    () => import('./MeasurementAggregateWidgetSpr'),
    (module) => module.MeasurementAggregateWidgetSprWidget,
);

export default MeasurementAggregateWidgetSpr;
