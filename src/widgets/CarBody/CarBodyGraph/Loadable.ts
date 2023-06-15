/**
 *
 * Asynchronously loads the component for CarBodyGraph
 *
 */

import { lazyLoad } from 'utils/loadable';

export const CarBodyGraph = lazyLoad(
    () => import('./CarBodyGraph'),
    (module) => module.CarBodyGraph,
);

export default CarBodyGraph;
