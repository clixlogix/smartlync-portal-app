/**
 *
 * Asynchronously loads the component for SelectFilter
 *
 */

import { lazyLoad } from 'utils/loadable';

export const SelectFilter = lazyLoad(
    () => import('./SelectFilter'),
    (module) => module.SelectFilter,
);

export default SelectFilter;
