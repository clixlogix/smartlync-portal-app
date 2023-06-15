/**
 *
 * Asynchronously loads the component for SelectDeviceNameFilter
 *
 */

import { lazyLoad } from 'utils/loadable';

export const SelectDeviceNameFilter = lazyLoad(
    () => import('./SelectDeviceNameFilter'),
    (module) => module.SelectDeviceNameFilter,
);

export default SelectDeviceNameFilter;
