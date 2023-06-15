/**
 *
 * Asynchronously loads the component for CarBodyAnalysis
 *
 */

import { lazyLoad } from 'utils/loadable';

export const CarBodyAnalysis = lazyLoad(
    () => import('./CarBodyAnalysis'),
    (module) => module.CarBodyAnalysis,
);

export default CarBodyAnalysis;
