/**
 *
 * Asynchronously loads the component for SelectFaultCodeFilter
 *
 */

import { lazyLoad } from 'utils/loadable';

export const SelectFaultCodeFilter = lazyLoad(
    () => import('./SelectFaultCodeFilter'),
    (module) => module.SelectFaultCodeFilter,
);

export default SelectFaultCodeFilter;
