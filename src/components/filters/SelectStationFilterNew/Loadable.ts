/**
 *
 * Asynchronously loads the component for SelectStudIdFilter
 *
 */

import { lazyLoad } from 'utils/loadable';

export const SelectStationFilter = lazyLoad(
    () => import('./SelectStationFilter'),
    (module) => module.SelectStationFilterNew,
);

export default SelectStationFilter;
