/**
 *
 * Asynchronously loads the component for SelectStudIdFilter
 *
 */

import { lazyLoad } from 'utils/loadable';

export const SelectStationFilter = lazyLoad(
    () => import('./SelectStationOnlyFilter'),
    (module) => module.SelectStationOnlyFilterNew,
);

export default SelectStationFilter;
