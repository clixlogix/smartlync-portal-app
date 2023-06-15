/**
 *
 * Asynchronously loads the component for SelectStudTypeFilter
 *
 */

import { lazyLoad } from 'utils/loadable';

export const SelectStudTypeFilter = lazyLoad(
    () => import('./SelectStudTypeFilter'),
    (module) => module.SelectStudTypeFilter,
);

export default SelectStudTypeFilter;
