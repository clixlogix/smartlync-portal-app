/**
 *
 * Asynchronously loads the component for CarBodyDurationsPerStation
 *
 */

import { lazyLoad } from 'utils/loadable';

export const CarBodyDurationsPerStation = lazyLoad(
    () => import('./CarBodyDurationsPerStation'),
    (module) => module.CarBodyDurationsPerStation,
);

export default CarBodyDurationsPerStation;
