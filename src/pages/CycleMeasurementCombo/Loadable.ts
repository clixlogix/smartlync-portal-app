/**
 *
 * Asynchronously loads the component for CycleMeasurementCombo
 *
 */

import { lazyLoad } from 'utils/loadable';

export const CycleMeasurementCombo = lazyLoad(
    () => import('./CycleMeasurementCombo'),
    (module) => module.CycleMeasurementCombo,
);

export default CycleMeasurementCombo;
