/**
 *
 * Asynchronously loads the component for CarBodyTable
 *
 */

import { lazyLoad } from 'utils/loadable';

export const CarBodyTable = lazyLoad(
    () => import('./CarBodyTable'),
    (module) => module.CarBodyTable,
);

export default CarBodyTable;
