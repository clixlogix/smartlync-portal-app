/**
 *
 * Asynchronously loads the component for SelectEventTypeFilter
 *
 */

import { lazyLoad } from 'utils/loadable';

export const SelectEventTypeFilter = lazyLoad(
    () => import('./SelectEventTypeFilter'),
    (module) => module.SelectEventTypeFilter,
);

export default SelectEventTypeFilter;
