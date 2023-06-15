/**
 *
 * Asynchronously loads the component for CarBodyDurationWidget
 *
 */

import { lazyLoad } from 'utils/loadable';

export const CarBodyDurationWidget = lazyLoad(
    () => import('./CarBodyDurationWidget'),
    (module) => module.CarBodyDurationWidget,
);

export default CarBodyDurationWidget;
