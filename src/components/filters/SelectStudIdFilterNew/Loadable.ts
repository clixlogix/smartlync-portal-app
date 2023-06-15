/**
 *
 * Asynchronously loads the component for SelectStudIdFilter
 *
 */

import { lazyLoad } from 'utils/loadable';

export const SelectStudIdFilter = lazyLoad(
    () => import('./SelectStudIdFilter'),
    (module) => module.SelectStudIdFilterNew,
);

export default SelectStudIdFilter;
