/**
 *
 * Asynchronously loads the component for SelectFilter
 *
 */

import { lazyLoad } from 'utils/loadable';

export const SelectFixedRollingWeek = lazyLoad(
    () => import('./SelectFixedRollingWeek'),
    (module) => module.SelectFixedRollingWeek,
);

export default SelectFixedRollingWeek;
