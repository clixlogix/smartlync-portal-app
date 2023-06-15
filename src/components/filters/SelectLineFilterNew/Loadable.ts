/**
 *
 * Asynchronously loads the component for SelectStudIdFilter
 *
 */

import { lazyLoad } from 'utils/loadable';

export const SelectLineFilter = lazyLoad(
    () => import('./SelectLineFilter'),
    (module) => module.SelectLineFilterNew,
);

export default SelectLineFilter;
