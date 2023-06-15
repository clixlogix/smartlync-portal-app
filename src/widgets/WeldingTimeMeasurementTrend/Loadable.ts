/**
 *
 * Asynchronously loads the component for WeldingTimeMeasurementTrend
 *
 */

import { lazyLoad } from 'utils/loadable';

export const WeldingTimeMeasurementTrend = lazyLoad(
    () => import('./WeldingTimeMeasurementTrend'),
    (module) => module.WeldingTimeMeasurementTrendWidget,
);

export default WeldingTimeMeasurementTrend;
